/**
 * Integration tests for the agent and command validators.
 *
 * These tests pair `extractFrontmatter` (the actual frontmatter parser used
 * by the validator scripts) with `validateAgentFrontmatter` against real
 * fixture files in tests/lint/fixtures/. They guard against the regressions
 * tracked in Issue #34 and PR #38.
 *
 * Run with: node tests/lint/validators.test.js
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { extractFrontmatter } = require('../../scripts/lib/validator');
const { validateAgentFrontmatter } = require('../../scripts/lib/gemini-tools');
const { validateCommandContent } = require('../../scripts/ci/validate-commands');

const AGENT_FIXTURES = path.join(__dirname, 'fixtures/agents');
const COMMAND_FIXTURES = path.join(__dirname, 'fixtures/commands');

function readFixture(dir, name) {
  return fs.readFileSync(path.join(dir, name), 'utf-8');
}

function validateAgentFile(filename) {
  const content = readFixture(AGENT_FIXTURES, filename);
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) return ['Missing frontmatter'];
  return validateAgentFrontmatter(frontmatter);
}

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
  console.log('\n=== Testing validators (integration) ===\n');

  let passed = 0;
  let failed = 0;

  console.log('Agent validator:');

  if (test('good fixture passes with no errors', () => {
    assert.deepStrictEqual(validateAgentFile('good.md'), []);
  })) passed++; else failed++;

  if (test('claude-style-tools fixture flags Read/Edit/Bash', () => {
    const errors = validateAgentFile('claude-style-tools.md');
    assert.strictEqual(errors.length, 3);
    assert.ok(errors.some(e => e.includes('"Read"') && e.includes('read_file')));
    assert.ok(errors.some(e => e.includes('"Edit"') && e.includes('replace')));
    assert.ok(errors.some(e => e.includes('"Bash"') && e.includes('run_shell_command')));
  })) passed++; else failed++;

  if (test('mcp-in-tools fixture flags MCP entry only', () => {
    const errors = validateAgentFile('mcp-in-tools.md');
    assert.strictEqual(errors.length, 1);
    assert.ok(errors[0].includes('MCP tools must not be listed'));
  })) passed++; else failed++;

  if (test('forbidden-keys fixture flags both color and model', () => {
    const errors = validateAgentFile('forbidden-keys.md');
    assert.ok(errors.some(e => e.includes('"color"')));
    assert.ok(errors.some(e => e.includes('"model"')));
  })) passed++; else failed++;

  if (test('legacy-names fixture flags both Issue #34 names', () => {
    const errors = validateAgentFile('legacy-names.md');
    assert.strictEqual(errors.length, 2);
    assert.ok(errors.some(e => e.includes('search_files') && e.includes('search_file_content')));
    assert.ok(errors.some(e => e.includes('replace_in_file') && e.includes('replace')));
  })) passed++; else failed++;

  if (test('missing-frontmatter fixture is rejected', () => {
    const errors = validateAgentFile('missing-frontmatter.md');
    assert.deepStrictEqual(errors, ['Missing frontmatter']);
  })) passed++; else failed++;

  console.log('\nReal agents/ directory:');

  if (test('all real agent files pass validation', () => {
    const realDir = path.join(__dirname, '../../agents');
    const files = fs.readdirSync(realDir).filter(f => f.endsWith('.md'));
    assert.ok(files.length > 0, 'Expected at least one agent file');

    const failures = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(realDir, file), 'utf-8');
      const frontmatter = extractFrontmatter(content);
      const errors = frontmatter
        ? validateAgentFrontmatter(frontmatter)
        : ['Missing frontmatter'];
      if (errors.length > 0) failures.push({ file, errors });
    }

    if (failures.length > 0) {
      const summary = failures
        .map(f => `${f.file}: ${f.errors.join('; ')}`)
        .join('\n  ');
      throw new Error(`Real agents failed validation:\n  ${summary}`);
    }
  })) passed++; else failed++;

  console.log('\nCommand validator:');

  if (test('good fixture passes with no errors', () => {
    const content = readFixture(COMMAND_FIXTURES, 'egc-good.toml');
    assert.deepStrictEqual(validateCommandContent(content, 'egc-good.toml'), []);
  })) passed++; else failed++;

  if (test('missing-prefix fixture is rejected', () => {
    const content = readFixture(COMMAND_FIXTURES, 'missing-prefix.toml');
    const errors = validateCommandContent(content, 'missing-prefix.toml');
    assert.strictEqual(errors.length, 1);
    assert.ok(errors[0].includes('egc-'));
  })) passed++; else failed++;

  if (test('no-description fixture is rejected', () => {
    const content = readFixture(COMMAND_FIXTURES, 'egc-no-description.toml');
    const errors = validateCommandContent(content, 'egc-no-description.toml');
    assert.ok(errors.some(e => e.includes('description')));
  })) passed++; else failed++;

  if (test('empty-description fixture is rejected', () => {
    const content = readFixture(COMMAND_FIXTURES, 'egc-empty-description.toml');
    const errors = validateCommandContent(content, 'egc-empty-description.toml');
    assert.ok(errors.some(e => e.includes('Empty description')));
  })) passed++; else failed++;

  if (test('empty file fixture is rejected', () => {
    const content = readFixture(COMMAND_FIXTURES, 'egc-empty-file.toml');
    const errors = validateCommandContent(content, 'egc-empty-file.toml');
    assert.deepStrictEqual(errors, ['Empty command file']);
  })) passed++; else failed++;

  console.log('\nReal commands/ directory:');

  if (test('all real command files pass validation', () => {
    const realDir = path.join(__dirname, '../../commands');
    const files = fs.readdirSync(realDir).filter(f => f.endsWith('.toml'));
    assert.ok(files.length > 0, 'Expected at least one command file');

    const failures = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(realDir, file), 'utf-8');
      const errors = validateCommandContent(content, file);
      if (errors.length > 0) failures.push({ file, errors });
    }

    if (failures.length > 0) {
      const summary = failures
        .map(f => `${f.file}: ${f.errors.join('; ')}`)
        .join('\n  ');
      throw new Error(`Real commands failed validation:\n  ${summary}`);
    }
  })) passed++; else failed++;

  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
