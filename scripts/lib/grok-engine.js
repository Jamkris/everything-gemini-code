/**
 * Grok engine: deterministic full-repo audit.
 *
 * Pure(ish) functions used by scripts/grok.js and tested in
 * tests/lib/grok-engine.test.js. Builds an inventory, a JS/TS import
 * graph, detects cycles via Tarjan's SCC, and lists dead-file
 * candidates. The slash command uses these outputs verbatim and only
 * adds synthesis on top.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_IGNORE = Object.freeze([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
  '.cache',
  'out',
]);

const LANGUAGE_BY_EXT = Object.freeze({
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.kt': 'kotlin',
  '.swift': 'swift',
  '.md': 'markdown',
  '.toml': 'toml',
  '.json': 'json',
  '.yml': 'yaml',
  '.yaml': 'yaml',
  '.sh': 'shell',
});

const JS_LIKE_EXT = Object.freeze(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx']);

function walkRepo(rootDir, options = {}) {
  const ignore = new Set(options.ignore || DEFAULT_IGNORE);
  const errors = options.errors || [];
  const results = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      errors.push({
        path: path.relative(rootDir, current) || '.',
        op: 'readdir',
        message: err.message,
      });
      continue;
    }

    for (const entry of entries) {
      if (ignore.has(entry.name)) continue;
      // Skip hidden dirs/files except .github (CI configs).
      if (entry.name.startsWith('.') && entry.name !== '.github') continue;

      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        results.push(path.relative(rootDir, fullPath));
      }
    }
  }

  return results.sort();
}

function classifyLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return LANGUAGE_BY_EXT[ext] || 'other';
}

function countLines(absolutePath) {
  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    if (content.length === 0) return 0;
    return content.split('\n').length;
  } catch (_err) {
    return 0;
  }
}

function summarizeFiles(files, rootDir) {
  const summary = {
    totalFiles: files.length,
    totalCodeLines: 0,
    byLanguage: {},
  };

  for (const rel of files) {
    const lang = classifyLanguage(rel);
    if (!summary.byLanguage[lang]) {
      summary.byLanguage[lang] = { files: 0, lines: 0 };
    }
    summary.byLanguage[lang].files += 1;

    if (lang === 'javascript' || lang === 'typescript') {
      const lines = countLines(path.join(rootDir, rel));
      summary.byLanguage[lang].lines += lines;
      summary.totalCodeLines += lines;
    }
  }

  return summary;
}

// Strips line/block comments. Does NOT strip string literals — an import-like
// pattern inside a string (e.g. `"const a = require('x')"`) will produce a
// false edge. Acceptable for v1 because grok-engine only consumes the result
// to build a graph and reports it as a "candidate" for synthesis.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

const REQUIRE_RE = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
const IMPORT_FROM_RE = /(?:^|[\s;])import\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
const EXPORT_FROM_RE = /(?:^|[\s;])export\s+[^'"]*?from\s+['"]([^'"]+)['"]/g;

function extractImports(content) {
  const cleaned = stripComments(content);
  const imports = new Set();
  const patterns = [REQUIRE_RE, IMPORT_FROM_RE, DYNAMIC_IMPORT_RE, EXPORT_FROM_RE];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(cleaned)) !== null) {
      imports.add(match[1]);
    }
  }

  return Array.from(imports).sort();
}

function isRelativeImport(specifier) {
  return specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/');
}

function resolveRelativeImport(fromRel, specifier, fileSet) {
  if (!isRelativeImport(specifier)) return null;

  const fromDir = path.dirname(fromRel);
  const targetBase = path.normalize(path.join(fromDir, specifier));
  const candidates = [targetBase];

  for (const ext of JS_LIKE_EXT) {
    candidates.push(targetBase + ext);
    candidates.push(path.join(targetBase, `index${ext}`));
  }

  for (const candidate of candidates) {
    if (fileSet.has(candidate)) return candidate;
  }
  return null;
}

function buildGraph(files, rootDir, errors = []) {
  const jsFiles = files.filter((f) => JS_LIKE_EXT.includes(path.extname(f)));
  const fileSet = new Set(jsFiles);
  const edges = new Map();
  const reverse = new Map();
  const unresolved = [];

  for (const rel of jsFiles) {
    edges.set(rel, new Set());
    reverse.set(rel, new Set());
  }

  for (const rel of jsFiles) {
    let content;
    try {
      content = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    } catch (err) {
      errors.push({ path: rel, op: 'readFile', message: err.message });
      continue;
    }

    const specs = extractImports(content);
    for (const spec of specs) {
      if (!isRelativeImport(spec)) continue;
      const resolved = resolveRelativeImport(rel, spec, fileSet);
      if (resolved) {
        edges.get(rel).add(resolved);
        reverse.get(resolved).add(rel);
      } else {
        unresolved.push({ from: rel, specifier: spec });
      }
    }
  }

  return { nodes: jsFiles, edges, reverse, unresolved };
}

function detectCycles(graph) {
  const { nodes, edges } = graph;
  const indices = new Map();
  const lowlinks = new Map();
  const onStack = new Set();
  const stack = [];
  const sccs = [];
  let nextIndex = 0;

  function strongconnect(v) {
    indices.set(v, nextIndex);
    lowlinks.set(v, nextIndex);
    nextIndex += 1;
    stack.push(v);
    onStack.add(v);

    const adj = edges.get(v) || new Set();
    for (const w of adj) {
      if (!indices.has(w)) {
        strongconnect(w);
        lowlinks.set(v, Math.min(lowlinks.get(v), lowlinks.get(w)));
      } else if (onStack.has(w)) {
        lowlinks.set(v, Math.min(lowlinks.get(v), indices.get(w)));
      }
    }

    if (lowlinks.get(v) === indices.get(v)) {
      const component = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        component.push(w);
      } while (w !== v);
      sccs.push(component);
    }
  }

  for (const v of nodes) {
    if (!indices.has(v)) strongconnect(v);
  }

  return sccs.filter((scc) => {
    if (scc.length > 1) return true;
    const v = scc[0];
    const adj = edges.get(v);
    return adj && adj.has(v);
  });
}

const DEFAULT_ENTRY_PATTERNS = Object.freeze([
  // CLI scripts at any depth under scripts/
  /^scripts\/.+\.(?:js|mjs|cjs)$/,
  // Hooks at any depth under hooks/
  /^hooks\/.+\.(?:js|mjs|cjs)$/,
  // Skill-bundled commands, hooks, and renderable assets
  /^skills\/[^/]+\/(?:commands|hooks)\/.+\.(?:js|mjs|cjs)$/,
  /^skills\/.+\/(?:assets|templates|rules\/assets)\/.+$/,
  // Test files
  /^tests\/.+\.test\.js$/,
  /^tests\/run-all\.js$/,
  // Root config files (any *.config.js at the top level)
  /^[^/]+\.config\.(?:js|mjs|cjs)$/,
]);

// `package.json` paths can carry leading `./` or `/`, but walkRepo emits
// repo-relative paths without that prefix. Normalize so both shapes match.
function normalizePackagePath(value) {
  const stripped = value.replace(/^\.\//, '').replace(/^\//, '');
  return path.posix.normalize(stripped);
}

function loadEntryPatterns(rootDir, errors = []) {
  const patterns = [...DEFAULT_ENTRY_PATTERNS];

  try {
    const pkgRaw = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgRaw);
    if (typeof pkg.main === 'string') {
      patterns.push(normalizePackagePath(pkg.main));
    }
    if (pkg.bin) {
      const binValues = typeof pkg.bin === 'string' ? [pkg.bin] : Object.values(pkg.bin);
      for (const value of binValues) {
        if (typeof value === 'string') patterns.push(normalizePackagePath(value));
      }
    }
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      errors.push({ path: 'package.json', op: 'parse', message: err.message });
    }
  }

  return patterns;
}

function isEntryFile(rel, entryPatterns) {
  for (const pattern of entryPatterns) {
    if (pattern instanceof RegExp) {
      if (pattern.test(rel)) return true;
    } else if (typeof pattern === 'string' && rel === pattern) {
      return true;
    }
  }
  return false;
}

function detectDeadFiles(graph, entryPatterns) {
  const { nodes, reverse } = graph;
  const dead = [];

  for (const node of nodes) {
    if (isEntryFile(node, entryPatterns)) continue;
    const incoming = reverse.get(node) || new Set();
    if (incoming.size === 0) dead.push(node);
  }

  return dead.sort();
}

function countEdges(graph) {
  let total = 0;
  for (const adj of graph.edges.values()) total += adj.size;
  return total;
}

function buildReport(rootDir, options = {}) {
  const errors = [];
  const files = walkRepo(rootDir, { ignore: options.ignore, errors });
  const summary = summarizeFiles(files, rootDir);
  const graph = buildGraph(files, rootDir, errors);
  const cycles = detectCycles(graph);
  const entryPatterns = loadEntryPatterns(rootDir, errors);
  const deadFiles = detectDeadFiles(graph, entryPatterns);

  return {
    rootDir: path.basename(rootDir),
    summary,
    dependencyGraph: {
      nodeCount: graph.nodes.length,
      edgeCount: countEdges(graph),
      unresolvedCount: graph.unresolved.length,
    },
    cycles: cycles.map((files) => ({ size: files.length, files })),
    deadFiles,
    errors,
  };
}

function formatText(report) {
  const lines = [];
  lines.push(`# Repo Grok: ${report.rootDir}`);
  lines.push('');

  lines.push('## Inventory');
  lines.push(`- Total files: ${report.summary.totalFiles}`);
  lines.push(`- JS/TS lines: ${report.summary.totalCodeLines}`);
  lines.push('');

  lines.push('### By language');
  const langs = Object.entries(report.summary.byLanguage).sort((a, b) => b[1].files - a[1].files);
  for (const [lang, stats] of langs) {
    const linePart = stats.lines ? `, ${stats.lines} lines` : '';
    lines.push(`- ${lang}: ${stats.files} files${linePart}`);
  }
  lines.push('');

  lines.push('## Dependency graph');
  lines.push(`- Nodes (JS/TS files): ${report.dependencyGraph.nodeCount}`);
  lines.push(`- Edges (relative imports): ${report.dependencyGraph.edgeCount}`);
  lines.push(`- Unresolved relative imports: ${report.dependencyGraph.unresolvedCount}`);
  lines.push('');

  lines.push(`## Circular dependencies (${report.cycles.length})`);
  if (report.cycles.length === 0) {
    lines.push('- None detected');
  } else {
    for (const cycle of report.cycles) {
      const chain = cycle.files.join(' -> ');
      lines.push(`- (size ${cycle.size}) ${chain} -> ${cycle.files[0]}`);
    }
  }
  lines.push('');

  lines.push(`## Dead-file candidates (${report.deadFiles.length})`);
  if (report.deadFiles.length === 0) {
    lines.push('- None detected');
  } else {
    for (const f of report.deadFiles) {
      lines.push(`- ${f}`);
    }
  }
  lines.push('');

  const errors = report.errors || [];
  if (errors.length > 0) {
    lines.push(`## Read errors (${errors.length})`);
    lines.push('Some files or directories could not be read; results may be incomplete.');
    for (const err of errors) {
      lines.push(`- [${err.op}] ${err.path}: ${err.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatJson(report) {
  return JSON.stringify(report, null, 2);
}

module.exports = {
  DEFAULT_IGNORE,
  JS_LIKE_EXT,
  walkRepo,
  classifyLanguage,
  countLines,
  summarizeFiles,
  stripComments,
  extractImports,
  isRelativeImport,
  resolveRelativeImport,
  buildGraph,
  detectCycles,
  loadEntryPatterns,
  normalizePackagePath,
  isEntryFile,
  detectDeadFiles,
  countEdges,
  buildReport,
  formatText,
  formatJson,
};
