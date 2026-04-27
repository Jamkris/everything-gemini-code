/**
 * Tests for scripts/lib/gemini-tools.js
 *
 * Run with: node tests/lib/gemini-tools.test.js
 */

'use strict';

const assert = require('assert');
const {
  VALID_TOOLS,
  FORBIDDEN_FRONTMATTER_KEYS,
  CLAUDE_TO_GEMINI,
  parseToolsField,
  suggestTool,
  validateToolList,
  validateAgentFrontmatter
} = require('../../scripts/lib/gemini-tools');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing gemini-tools.js ===\n');

  let passed = 0;
  let failed = 0;

  console.log('parseToolsField:');

  if (test('parses quoted inline array', () => {
    const result = parseToolsField('["read_file", "write_file"]');
    assert.deepStrictEqual(result, ['read_file', 'write_file']);
  })) passed++; else failed++;

  if (test('parses unquoted inline array', () => {
    const result = parseToolsField('[read_file, write_file]');
    assert.deepStrictEqual(result, ['read_file', 'write_file']);
  })) passed++; else failed++;

  if (test('parses single-quoted entries', () => {
    const result = parseToolsField("['read_file', 'replace']");
    assert.deepStrictEqual(result, ['read_file', 'replace']);
  })) passed++; else failed++;

  if (test('handles empty array', () => {
    assert.deepStrictEqual(parseToolsField('[]'), []);
  })) passed++; else failed++;

  if (test('returns null on missing brackets', () => {
    assert.strictEqual(parseToolsField('read_file, write_file'), null);
  })) passed++; else failed++;

  if (test('returns null on non-string input', () => {
    assert.strictEqual(parseToolsField(undefined), null);
    assert.strictEqual(parseToolsField(42), null);
  })) passed++; else failed++;

  console.log('\nsuggestTool:');

  if (test('maps Claude-style names to Gemini equivalents', () => {
    assert.strictEqual(suggestTool('Read'), 'read_file');
    assert.strictEqual(suggestTool('Edit'), 'replace');
    assert.strictEqual(suggestTool('Bash'), 'run_shell_command');
  })) passed++; else failed++;

  if (test('maps legacy Gemini names from Issue #34', () => {
    assert.strictEqual(suggestTool('search_files'), 'search_file_content');
    assert.strictEqual(suggestTool('replace_in_file'), 'replace');
  })) passed++; else failed++;

  if (test('finds nearest match for typos', () => {
    assert.strictEqual(suggestTool('read_files'), 'read_file');
    assert.strictEqual(suggestTool('list_directorys'), 'list_directory');
  })) passed++; else failed++;

  if (test('returns null for far-off names', () => {
    assert.strictEqual(suggestTool('completely_unrelated_xyz'), null);
  })) passed++; else failed++;

  console.log('\nvalidateToolList:');

  if (test('passes a fully valid list', () => {
    assert.deepStrictEqual(validateToolList(['read_file', 'write_file']), []);
  })) passed++; else failed++;

  if (test('flags MCP tools with dedicated message', () => {
    const errors = validateToolList(['mcp__slack__send_message']);
    assert.strictEqual(errors.length, 1);
    assert.ok(errors[0].includes('MCP tools must not be listed'));
  })) passed++; else failed++;

  if (test('flags Claude-style names with did-you-mean hint', () => {
    const errors = validateToolList(['Read']);
    assert.strictEqual(errors.length, 1);
    assert.ok(errors[0].includes('Did you mean "read_file"?'));
  })) passed++; else failed++;

  if (test('flags legacy names with hint', () => {
    const errors = validateToolList(['search_files']);
    assert.strictEqual(errors.length, 1);
    assert.ok(errors[0].includes('Did you mean "search_file_content"?'));
  })) passed++; else failed++;

  if (test('reports each invalid tool independently', () => {
    const errors = validateToolList(['read_file', 'Edit', 'mcp__foo']);
    assert.strictEqual(errors.length, 2);
  })) passed++; else failed++;

  console.log('\nvalidateAgentFrontmatter:');

  if (test('accepts a well-formed frontmatter', () => {
    const errors = validateAgentFrontmatter({
      name: 'sample',
      description: 'A sample agent.',
      tools: '[read_file, write_file]'
    });
    assert.deepStrictEqual(errors, []);
  })) passed++; else failed++;

  if (test('reports missing required keys', () => {
    const errors = validateAgentFrontmatter({});
    const missing = errors.filter(e => e.startsWith('Missing required field'));
    assert.strictEqual(missing.length, 3);
  })) passed++; else failed++;

  if (test('distinguishes empty value from missing key', () => {
    const errors = validateAgentFrontmatter({
      name: '',
      description: '',
      tools: ''
    });
    const empty = errors.filter(e => e.startsWith('Empty required field'));
    const missing = errors.filter(e => e.startsWith('Missing required field'));
    assert.strictEqual(empty.length, 3);
    assert.strictEqual(missing.length, 0);
  })) passed++; else failed++;

  if (test('does not produce a redundant Malformed tools error when tools is empty', () => {
    const errors = validateAgentFrontmatter({
      name: 'x',
      description: 'x',
      tools: ''
    });
    assert.ok(errors.some(e => e === 'Empty required field: tools'));
    assert.ok(!errors.some(e => e.includes('Malformed tools field')));
  })) passed++; else failed++;

  if (test('rejects forbidden keys (color, model)', () => {
    const errors = validateAgentFrontmatter({
      name: 'x',
      description: 'x',
      tools: '[read_file]',
      color: 'blue',
      model: 'sonnet'
    });
    assert.ok(errors.some(e => e.includes('"color"')));
    assert.ok(errors.some(e => e.includes('"model"')));
  })) passed++; else failed++;

  if (test('rejects malformed tools field', () => {
    const errors = validateAgentFrontmatter({
      name: 'x',
      description: 'x',
      tools: 'read_file, write_file'
    });
    assert.ok(errors.some(e => e.includes('Malformed tools field')));
  })) passed++; else failed++;

  if (test('rejects empty tools array', () => {
    const errors = validateAgentFrontmatter({
      name: 'x',
      description: 'x',
      tools: '[]'
    });
    assert.ok(errors.some(e => e.includes('Empty tools array')));
  })) passed++; else failed++;

  if (test('rejects MCP tool in frontmatter', () => {
    const errors = validateAgentFrontmatter({
      name: 'x',
      description: 'x',
      tools: '[read_file, mcp__slack__post]'
    });
    assert.ok(errors.some(e => e.includes('MCP tools must not be listed')));
  })) passed++; else failed++;

  console.log('\nAllowlist sanity:');

  if (test('VALID_TOOLS contains exactly the documented 11 tools', () => {
    assert.strictEqual(VALID_TOOLS.length, 11);
    assert.ok(VALID_TOOLS.includes('read_file'));
    assert.ok(VALID_TOOLS.includes('google_web_search'));
  })) passed++; else failed++;

  if (test('FORBIDDEN_FRONTMATTER_KEYS includes color and model', () => {
    assert.ok(FORBIDDEN_FRONTMATTER_KEYS.includes('color'));
    assert.ok(FORBIDDEN_FRONTMATTER_KEYS.includes('model'));
  })) passed++; else failed++;

  if (test('CLAUDE_TO_GEMINI maps the common Claude tool names', () => {
    assert.strictEqual(CLAUDE_TO_GEMINI.Read, 'read_file');
    assert.strictEqual(CLAUDE_TO_GEMINI.Bash, 'run_shell_command');
    assert.strictEqual(CLAUDE_TO_GEMINI.Grep, 'search_file_content');
  })) passed++; else failed++;

  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
