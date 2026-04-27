/**
 * Gemini CLI tool allowlist + frontmatter validation helpers.
 *
 * Single source of truth for what `tools:` and other frontmatter keys are
 * accepted by the Gemini CLI agent loader. `.gemini/styleguide.md` mirrors
 * this list for human-facing review guidance — keep both in sync.
 *
 * Issue #34 history: Gemini CLI rejects agents whose frontmatter references
 * Claude-style names (Read, Edit), legacy names (search_files), MCP tools
 * (mcp__*), or unsupported keys (color, model). The validators below catch
 * those before they hit the loader.
 */

'use strict';

const VALID_TOOLS = Object.freeze([
  'read_file',
  'read_many_files',
  'write_file',
  'replace',
  'glob',
  'search_file_content',
  'list_directory',
  'run_shell_command',
  'save_memory',
  'web_fetch',
  'google_web_search'
]);

const VALID_TOOL_SET = new Set(VALID_TOOLS);

// Forbidden top-level frontmatter keys. The Gemini CLI agent schema only
// supports `name`, `description`, `tools`. Anything else (notably `color`
// and `model`) causes the loader to reject the file.
const FORBIDDEN_FRONTMATTER_KEYS = Object.freeze(['color', 'model']);

const REQUIRED_FRONTMATTER_KEYS = Object.freeze(['name', 'description', 'tools']);

// Claude Code → Gemini CLI tool name migration table. Used to produce
// actionable error messages when contributors copy frontmatter from a
// Claude-style agent.
const CLAUDE_TO_GEMINI = Object.freeze({
  Read: 'read_file',
  Write: 'write_file',
  Edit: 'replace',
  Bash: 'run_shell_command',
  Glob: 'glob',
  Grep: 'search_file_content',
  LS: 'list_directory',
  WebFetch: 'web_fetch',
  WebSearch: 'google_web_search',
  search_files: 'search_file_content',
  replace_in_file: 'replace'
});

/**
 * Parse the value of a `tools:` frontmatter line into a list of tool names.
 *
 * Accepts both quoted and unquoted YAML inline arrays:
 *   tools: ["read_file", "write_file"]
 *   tools: [read_file, write_file]
 *
 * Returns null if the value is malformed (missing brackets, etc.) so callers
 * can surface a frontmatter parse error instead of silently passing.
 *
 * @param {string} rawValue
 * @returns {string[]|null}
 */
function parseToolsField(rawValue) {
  if (typeof rawValue !== 'string') return null;
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;

  const inner = trimmed.slice(1, -1).trim();
  if (inner.length === 0) return [];

  return inner
    .split(',')
    .map(part => part.trim().replace(/^["']|["']$/g, ''))
    .filter(part => part.length > 0);
}

/**
 * Compute Levenshtein distance for "did you mean" suggestions.
 * Bounded loop, no allocations beyond the working row.
 */
function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/**
 * Suggest the nearest valid tool name for a typo. Returns null if no
 * candidate is close enough (distance > 4) to be useful.
 */
function suggestTool(badName) {
  if (CLAUDE_TO_GEMINI[badName]) return CLAUDE_TO_GEMINI[badName];

  let best = null;
  let bestDist = Infinity;
  for (const candidate of VALID_TOOLS) {
    const d = levenshtein(badName.toLowerCase(), candidate);
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }
  return bestDist <= 4 ? best : null;
}

/**
 * Validate a list of tool names against the Gemini CLI allowlist.
 * Returns an array of human-readable error strings (empty on success).
 *
 * @param {string[]} tools
 * @returns {string[]}
 */
function validateToolList(tools) {
  const errors = [];
  for (const tool of tools) {
    if (VALID_TOOL_SET.has(tool)) continue;

    if (tool.startsWith('mcp__')) {
      errors.push(
        `Invalid tool "${tool}": MCP tools must not be listed in agent ` +
        `frontmatter — they are auto-discovered from configured MCP servers.`
      );
      continue;
    }

    const suggestion = suggestTool(tool);
    const hint = suggestion ? ` Did you mean "${suggestion}"?` : '';
    errors.push(`Invalid tool "${tool}".${hint}`);
  }
  return errors;
}

/**
 * Validate the full frontmatter object of an agent file.
 * @param {object} frontmatter - parsed key/value pairs
 * @returns {string[]} list of error messages (empty on success)
 */
function validateAgentFrontmatter(frontmatter) {
  const errors = [];
  const has = key => Object.prototype.hasOwnProperty.call(frontmatter, key);
  const isEmpty = value => value === null || value === undefined || value === '';

  for (const key of REQUIRED_FRONTMATTER_KEYS) {
    if (!has(key)) {
      errors.push(`Missing required field: ${key}`);
    } else if (isEmpty(frontmatter[key])) {
      errors.push(`Empty required field: ${key}`);
    }
  }

  for (const key of FORBIDDEN_FRONTMATTER_KEYS) {
    if (has(key)) {
      errors.push(
        `Forbidden frontmatter key: "${key}" — Gemini CLI agent schema only ` +
        `accepts ${REQUIRED_FRONTMATTER_KEYS.join(', ')}.`
      );
    }
  }

  // Run the tool-list parse only if the field has a non-empty value. The
  // empty / missing cases are already covered above; running parseToolsField
  // on `''` would just produce a redundant "Malformed tools field" message.
  if (has('tools') && !isEmpty(frontmatter.tools)) {
    const tools = parseToolsField(frontmatter.tools);
    if (tools === null) {
      errors.push(
        `Malformed tools field: expected an inline YAML array like ` +
        `[read_file, write_file].`
      );
    } else if (tools.length === 0) {
      errors.push('Empty tools array — agents must declare at least one tool.');
    } else {
      errors.push(...validateToolList(tools));
    }
  }

  return errors;
}

module.exports = {
  VALID_TOOLS,
  FORBIDDEN_FRONTMATTER_KEYS,
  REQUIRED_FRONTMATTER_KEYS,
  CLAUDE_TO_GEMINI,
  parseToolsField,
  suggestTool,
  validateToolList,
  validateAgentFrontmatter
};
