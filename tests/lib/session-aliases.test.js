/**
 * Tests for scripts/lib/session-aliases.js
 *
 * Run with: node tests/lib/session-aliases.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

// We need to mock getGeminiDir to use a temp directory
// Override the env before requiring the module
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alias-test-'));
process.env.GEMINI_HOME_OVERRIDE = tmpDir;

// Monkey-patch utils.getGeminiDir to return our temp dir
const utils = require('../../scripts/lib/utils');
const originalGetGeminiDir = utils.getGeminiDir;
utils.getGeminiDir = () => tmpDir;

const aliases = require('../../scripts/lib/session-aliases');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function cleanup() {
  // Remove the aliases file between tests for isolation
  const aliasesPath = aliases.getAliasesPath();
  if (fs.existsSync(aliasesPath)) fs.unlinkSync(aliasesPath);
  const bak = aliasesPath + '.bak';
  if (fs.existsSync(bak)) fs.unlinkSync(bak);
  const tmp = aliasesPath + '.tmp';
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
}

function runTests() {
  console.log('\n=== Testing session-aliases.js ===\n');

  let passed = 0;
  let failed = 0;

  // --- getAliasesPath ---
  console.log('getAliasesPath:');

  if (test('returns path ending with session-aliases.json', () => {
    const p = aliases.getAliasesPath();
    assert.ok(p.endsWith('session-aliases.json'));
    assert.ok(p.startsWith(tmpDir));
  })) passed++; else failed++;

  // --- loadAliases ---
  console.log('\nloadAliases:');

  cleanup();

  if (test('returns default structure when no file exists', () => {
    const data = aliases.loadAliases();
    assert.ok(data.aliases);
    assert.strictEqual(typeof data.aliases, 'object');
    assert.ok(data.version);
    assert.ok(data.metadata);
  })) passed++; else failed++;

  if (test('handles corrupted JSON gracefully', () => {
    fs.writeFileSync(aliases.getAliasesPath(), 'not json!');
    const data = aliases.loadAliases();
    assert.ok(data.aliases);
    assert.strictEqual(Object.keys(data.aliases).length, 0);
    cleanup();
  })) passed++; else failed++;

  if (test('handles invalid structure gracefully', () => {
    fs.writeFileSync(aliases.getAliasesPath(), '{"foo": "bar"}');
    const data = aliases.loadAliases();
    assert.strictEqual(Object.keys(data.aliases).length, 0);
    cleanup();
  })) passed++; else failed++;

  // --- setAlias ---
  console.log('\nsetAlias:');

  cleanup();

  if (test('creates a new alias', () => {
    const result = aliases.setAlias('my-session', 'session-file.tmp', 'Test Title');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isNew, true);
    assert.strictEqual(result.alias, 'my-session');
  })) passed++; else failed++;

  if (test('updates an existing alias', () => {
    const result = aliases.setAlias('my-session', 'updated-file.tmp');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isNew, false);
  })) passed++; else failed++;

  if (test('rejects empty alias name', () => {
    const result = aliases.setAlias('', 'file.tmp');
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes('empty'));
  })) passed++; else failed++;

  if (test('rejects invalid characters in alias', () => {
    const result = aliases.setAlias('my session!', 'file.tmp');
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes('letters'));
  })) passed++; else failed++;

  if (test('rejects reserved alias names', () => {
    for (const reserved of ['list', 'help', 'remove', 'delete', 'create', 'set']) {
      const result = aliases.setAlias(reserved, 'file.tmp');
      assert.strictEqual(result.success, false, `Should reject '${reserved}'`);
      assert.ok(result.error.includes('reserved'));
    }
  })) passed++; else failed++;

  // --- resolveAlias ---
  console.log('\nresolveAlias:');

  if (test('resolves existing alias', () => {
    const resolved = aliases.resolveAlias('my-session');
    assert.ok(resolved);
    assert.strictEqual(resolved.sessionPath, 'updated-file.tmp');
  })) passed++; else failed++;

  if (test('returns null for non-existent alias', () => {
    assert.strictEqual(aliases.resolveAlias('nope'), null);
  })) passed++; else failed++;

  if (test('returns null for invalid alias name', () => {
    assert.strictEqual(aliases.resolveAlias('bad name!'), null);
  })) passed++; else failed++;

  // --- listAliases ---
  console.log('\nlistAliases:');

  if (test('lists created aliases', () => {
    const list = aliases.listAliases();
    assert.ok(Array.isArray(list));
    assert.ok(list.length >= 1);
    assert.ok(list.some(a => a.name === 'my-session'));
  })) passed++; else failed++;

  if (test('respects limit option', () => {
    aliases.setAlias('second-alias', 'second-file.tmp');
    aliases.setAlias('third-alias', 'third-file.tmp');
    const list = aliases.listAliases({ limit: 2 });
    assert.strictEqual(list.length, 2);
  })) passed++; else failed++;

  if (test('filters by search term', () => {
    const list = aliases.listAliases({ search: 'second' });
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].name, 'second-alias');
  })) passed++; else failed++;

  // --- renameAlias ---
  console.log('\nrenameAlias:');

  if (test('renames an alias', () => {
    const result = aliases.renameAlias('third-alias', 'renamed-alias');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newAlias, 'renamed-alias');
    assert.strictEqual(aliases.resolveAlias('third-alias'), null);
    assert.ok(aliases.resolveAlias('renamed-alias'));
  })) passed++; else failed++;

  if (test('rejects rename to existing alias', () => {
    const result = aliases.renameAlias('my-session', 'renamed-alias');
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes('already exists'));
  })) passed++; else failed++;

  if (test('rejects rename of non-existent alias', () => {
    const result = aliases.renameAlias('nope', 'new-name');
    assert.strictEqual(result.success, false);
  })) passed++; else failed++;

  // --- updateAliasTitle ---
  console.log('\nupdateAliasTitle:');

  if (test('updates alias title', () => {
    const result = aliases.updateAliasTitle('my-session', 'New Title');
    assert.strictEqual(result.success, true);
    const resolved = aliases.resolveAlias('my-session');
    assert.strictEqual(resolved.title, 'New Title');
  })) passed++; else failed++;

  if (test('returns error for non-existent alias', () => {
    const result = aliases.updateAliasTitle('nope', 'Title');
    assert.strictEqual(result.success, false);
  })) passed++; else failed++;

  // --- deleteAlias ---
  console.log('\ndeleteAlias:');

  if (test('deletes an alias', () => {
    const result = aliases.deleteAlias('second-alias');
    assert.strictEqual(result.success, true);
    assert.strictEqual(aliases.resolveAlias('second-alias'), null);
  })) passed++; else failed++;

  if (test('returns error for non-existent alias', () => {
    const result = aliases.deleteAlias('nope');
    assert.strictEqual(result.success, false);
  })) passed++; else failed++;

  // --- getAliasesForSession ---
  console.log('\ngetAliasesForSession:');

  if (test('finds aliases for a session path', () => {
    const list = aliases.getAliasesForSession('updated-file.tmp');
    assert.ok(list.length >= 1);
    assert.ok(list.some(a => a.name === 'my-session'));
  })) passed++; else failed++;

  if (test('returns empty array for unknown session', () => {
    const list = aliases.getAliasesForSession('unknown-file.tmp');
    assert.strictEqual(list.length, 0);
  })) passed++; else failed++;

  // --- resolveSessionAlias ---
  console.log('\nresolveSessionAlias:');

  if (test('resolves alias to session path', () => {
    const p = aliases.resolveSessionAlias('my-session');
    assert.strictEqual(p, 'updated-file.tmp');
  })) passed++; else failed++;

  if (test('returns input as-is if not an alias', () => {
    const p = aliases.resolveSessionAlias('some-raw-id');
    assert.strictEqual(p, 'some-raw-id');
  })) passed++; else failed++;

  // --- cleanupAliases ---
  console.log('\ncleanupAliases:');

  if (test('removes aliases for non-existent sessions', () => {
    const result = aliases.cleanupAliases(() => false);
    assert.ok(result.removed > 0);
    assert.strictEqual(Object.keys(aliases.loadAliases().aliases).length, 0);
  })) passed++; else failed++;

  // Cleanup
  utils.getGeminiDir = originalGetGeminiDir;
  fs.rmSync(tmpDir, { recursive: true, force: true });

  // Results
  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);

  if (failed > 0) process.exit(1);
}

runTests();
