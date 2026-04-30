/**
 * Tests for scripts/grok.js CLI argument parsing and validation.
 *
 * Run with: node tests/lib/grok-cli.test.js
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const cli = require('../../scripts/grok');

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

console.log('\n=== Testing scripts/grok.js (CLI) ===\n');

test('parseArgs accepts --format text', () => {
  const parsed = cli.parseArgs(['node', 'grok.js', '--format', 'text']);
  assert.strictEqual(parsed.format, 'text');
});

test('parseArgs accepts --format=json', () => {
  const parsed = cli.parseArgs(['node', 'grok.js', '--format=json']);
  assert.strictEqual(parsed.format, 'json');
});

test('parseArgs rejects --format without a value', () => {
  assert.throws(() => cli.parseArgs(['node', 'grok.js', '--format']), /Missing value/);
});

test('parseArgs rejects --scope followed by another flag', () => {
  assert.throws(
    () => cli.parseArgs(['node', 'grok.js', '--scope', '--format', 'text']),
    /Missing value/,
  );
});

test('parseArgs rejects unknown flags', () => {
  assert.throws(() => cli.parseArgs(['node', 'grok.js', '--bogus']), /Unknown argument/);
});

test('parseArgs rejects invalid format value', () => {
  assert.throws(() => cli.parseArgs(['node', 'grok.js', '--format', 'xml']), /Invalid format/);
});

test('parseArgs preserves = in --scope= values', () => {
  // A directory name containing `=` (rare but valid). split('=')[1] would
  // truncate; slice from the first `=` should preserve the full value.
  const parsed = cli.parseArgs(['node', 'grok.js', '--scope=/tmp/odd=name']);
  assert.ok(parsed.scope.endsWith('odd=name'), `scope: ${parsed.scope}`);
});

test('ensureDirectory throws on non-existent path', () => {
  const missing = path.join(os.tmpdir(), `grok-missing-${Date.now()}`);
  assert.throws(() => cli.ensureDirectory(missing), /not found/i);
});

test('ensureDirectory throws when path is a file', () => {
  const tmpFile = path.join(os.tmpdir(), `grok-file-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, 'x');
  try {
    assert.throws(() => cli.ensureDirectory(tmpFile), /not a directory/i);
  } finally {
    fs.rmSync(tmpFile, { force: true });
  }
});

test('ensureDirectory accepts an existing directory', () => {
  cli.ensureDirectory(os.tmpdir());
});

console.log('\n=== Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}\n`);

process.exit(failed === 0 ? 0 : 1);
