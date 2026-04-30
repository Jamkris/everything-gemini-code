/**
 * Tests for scripts/lib/grok-engine.js
 *
 * Run with: node tests/lib/grok-engine.test.js
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const engine = require('../../scripts/lib/grok-engine');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed += 1;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    failed += 1;
  }
}

function makeTempRepo(structure) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'grok-test-'));
  for (const [rel, content] of Object.entries(structure)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  return root;
}

function rmTempRepo(root) {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log('\n=== Testing grok-engine.js ===\n');

test('extractImports finds require()', () => {
  const imports = engine.extractImports("const x = require('./a');");
  assert.deepStrictEqual(imports, ['./a']);
});

test('extractImports finds named and default import-from', () => {
  const imports = engine.extractImports("import x from './a';\nimport { y } from './b';");
  assert.deepStrictEqual(imports, ['./a', './b']);
});

test('extractImports finds bare side-effect imports', () => {
  const imports = engine.extractImports("import './side-effect';");
  assert.deepStrictEqual(imports, ['./side-effect']);
});

test('extractImports finds dynamic import()', () => {
  const imports = engine.extractImports("const m = await import('./lazy');");
  assert.deepStrictEqual(imports, ['./lazy']);
});

test('extractImports finds export-from re-exports', () => {
  const imports = engine.extractImports("export { x } from './re';");
  assert.deepStrictEqual(imports, ['./re']);
});

test('extractImports ignores commented-out imports', () => {
  const src = `
    // const a = require('./skip-line');
    /* import b from './skip-block'; */
    const c = require('./keep');
  `;
  const imports = engine.extractImports(src);
  assert.deepStrictEqual(imports, ['./keep']);
});

test('extractImports does not strip URLs containing //', () => {
  const src = "const url = 'https://example.com'; require('./real');";
  const imports = engine.extractImports(src);
  assert.deepStrictEqual(imports, ['./real']);
});

test('isRelativeImport classifies relative vs package specifiers', () => {
  assert.strictEqual(engine.isRelativeImport('./a'), true);
  assert.strictEqual(engine.isRelativeImport('../a'), true);
  assert.strictEqual(engine.isRelativeImport('/abs/path'), true);
  assert.strictEqual(engine.isRelativeImport('lodash'), false);
  assert.strictEqual(engine.isRelativeImport('@scope/pkg'), false);
});

test('walkRepo skips node_modules and hidden dirs', () => {
  const root = makeTempRepo({
    'a.js': '',
    'src/b.js': '',
    'node_modules/lib/index.js': '',
    '.git/HEAD': '',
    '.cache/x': '',
  });
  try {
    const files = engine.walkRepo(root);
    assert.ok(files.includes('a.js'));
    assert.ok(files.includes(path.join('src', 'b.js')));
    assert.ok(!files.some((f) => f.includes('node_modules')));
    assert.ok(!files.some((f) => f.startsWith('.git')));
    assert.ok(!files.some((f) => f.startsWith('.cache')));
  } finally {
    rmTempRepo(root);
  }
});

test('walkRepo keeps .github directory', () => {
  const root = makeTempRepo({
    '.github/workflows/ci.yml': 'name: ci',
  });
  try {
    const files = engine.walkRepo(root);
    assert.ok(files.some((f) => f.includes('.github')));
  } finally {
    rmTempRepo(root);
  }
});

test('summarizeFiles groups by language and counts JS/TS lines', () => {
  const root = makeTempRepo({
    'a.js': 'line1\nline2\n',
    'b.ts': 'line1\n',
    'README.md': '# hi',
    'package.json': '{"name":"t"}',
  });
  try {
    const files = engine.walkRepo(root);
    const sum = engine.summarizeFiles(files, root);
    assert.strictEqual(sum.byLanguage.javascript.files, 1);
    assert.strictEqual(sum.byLanguage.typescript.files, 1);
    assert.strictEqual(sum.byLanguage.markdown.files, 1);
    assert.strictEqual(sum.byLanguage.json.files, 1);
    assert.ok(sum.totalCodeLines > 0);
  } finally {
    rmTempRepo(root);
  }
});

test('buildGraph + detectCycles finds simple 2-cycle', () => {
  const root = makeTempRepo({
    'a.js': "require('./b');",
    'b.js': "require('./a');",
    'package.json': '{"name":"t"}',
  });
  try {
    const files = engine.walkRepo(root);
    const graph = engine.buildGraph(files, root);
    const cycles = engine.detectCycles(graph);
    assert.strictEqual(cycles.length, 1);
    assert.strictEqual(cycles[0].length, 2);
  } finally {
    rmTempRepo(root);
  }
});

test('detectCycles finds self-loop', () => {
  const root = makeTempRepo({
    'a.js': "require('./a');",
    'package.json': '{"name":"t"}',
  });
  try {
    const files = engine.walkRepo(root);
    const graph = engine.buildGraph(files, root);
    const cycles = engine.detectCycles(graph);
    assert.strictEqual(cycles.length, 1);
    assert.strictEqual(cycles[0].length, 1);
  } finally {
    rmTempRepo(root);
  }
});

test('detectCycles returns none for a DAG', () => {
  const root = makeTempRepo({
    'a.js': "require('./b'); require('./c');",
    'b.js': "require('./c');",
    'c.js': 'module.exports = {};',
    'package.json': '{"name":"t"}',
  });
  try {
    const files = engine.walkRepo(root);
    const graph = engine.buildGraph(files, root);
    const cycles = engine.detectCycles(graph);
    assert.strictEqual(cycles.length, 0);
  } finally {
    rmTempRepo(root);
  }
});

test('resolveRelativeImport resolves index files', () => {
  const fileSet = new Set(['lib/foo/index.js', 'a.js']);
  const resolved = engine.resolveRelativeImport('a.js', './lib/foo', fileSet);
  assert.strictEqual(resolved, path.join('lib', 'foo', 'index.js'));
});

test('detectDeadFiles flags orphans and respects entry patterns', () => {
  const root = makeTempRepo({
    'scripts/main.js': "require('../lib/used');",
    'lib/used.js': 'module.exports = {};',
    'lib/orphan.js': 'module.exports = {};',
    'package.json': '{"name":"t"}',
  });
  try {
    const files = engine.walkRepo(root);
    const graph = engine.buildGraph(files, root);
    const patterns = engine.loadEntryPatterns(root);
    const dead = engine.detectDeadFiles(graph, patterns);
    assert.ok(dead.includes(path.join('lib', 'orphan.js')), `expected orphan in dead, got ${JSON.stringify(dead)}`);
    assert.ok(!dead.some((f) => f.endsWith('main.js')), 'scripts/*.js should be entry');
    assert.ok(!dead.some((f) => f.endsWith('used.js')), 'used.js has incoming edge');
  } finally {
    rmTempRepo(root);
  }
});

test('loadEntryPatterns includes package.json bin entries', () => {
  const root = makeTempRepo({
    'package.json': JSON.stringify({ name: 't', bin: { mycli: 'cli/index.js' } }),
  });
  try {
    const patterns = engine.loadEntryPatterns(root);
    assert.ok(patterns.some((p) => p === 'cli/index.js'));
  } finally {
    rmTempRepo(root);
  }
});

test('buildReport returns expected shape', () => {
  const root = makeTempRepo({
    'a.js': "require('./b');",
    'b.js': 'module.exports = {};',
    'package.json': '{"name":"t"}',
  });
  try {
    const report = engine.buildReport(root);
    assert.ok(report.summary);
    assert.ok(report.dependencyGraph);
    assert.strictEqual(typeof report.dependencyGraph.nodeCount, 'number');
    assert.ok(Array.isArray(report.cycles));
    assert.ok(Array.isArray(report.deadFiles));
    assert.strictEqual(typeof report.rootDir, 'string');
  } finally {
    rmTempRepo(root);
  }
});

test('formatText renders all sections', () => {
  const root = makeTempRepo({
    'a.js': "require('./b');",
    'b.js': "require('./a');",
    'package.json': '{"name":"t"}',
  });
  try {
    const report = engine.buildReport(root);
    const text = engine.formatText(report);
    assert.ok(text.includes('# Repo Grok'));
    assert.ok(text.includes('## Inventory'));
    assert.ok(text.includes('## Dependency graph'));
    assert.ok(text.includes('## Circular dependencies'));
    assert.ok(text.includes('## Dead-file candidates'));
  } finally {
    rmTempRepo(root);
  }
});

test('formatJson is valid JSON', () => {
  const root = makeTempRepo({
    'a.js': '',
    'package.json': '{"name":"t"}',
  });
  try {
    const report = engine.buildReport(root);
    const json = engine.formatJson(report);
    const parsed = JSON.parse(json);
    assert.strictEqual(parsed.rootDir, path.basename(root));
  } finally {
    rmTempRepo(root);
  }
});

console.log('\n=== Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}\n`);

process.exit(failed === 0 ? 0 : 1);
