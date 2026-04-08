/**
 * Tests for scripts/lib/session-manager.js
 *
 * Run with: node tests/lib/session-manager.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const sm = require('../../scripts/lib/session-manager');

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

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sm-test-'));
}

function runTests() {
  console.log('\n=== Testing session-manager.js ===\n');

  let passed = 0;
  let failed = 0;

  // --- parseSessionFilename ---
  console.log('parseSessionFilename:');

  if (test('parses new format with short ID', () => {
    const result = sm.parseSessionFilename('2026-02-01-a1b2c3d4-session.tmp');
    assert.ok(result);
    assert.strictEqual(result.date, '2026-02-01');
    assert.strictEqual(result.shortId, 'a1b2c3d4');
    assert.strictEqual(result.filename, '2026-02-01-a1b2c3d4-session.tmp');
  })) passed++; else failed++;

  if (test('parses old format without short ID', () => {
    const result = sm.parseSessionFilename('2026-02-01-session.tmp');
    assert.ok(result);
    assert.strictEqual(result.date, '2026-02-01');
    assert.strictEqual(result.shortId, 'no-id');
  })) passed++; else failed++;

  if (test('returns null for invalid filename', () => {
    assert.strictEqual(sm.parseSessionFilename('readme.md'), null);
    assert.strictEqual(sm.parseSessionFilename(''), null);
    assert.strictEqual(sm.parseSessionFilename('not-a-session-file'), null);
  })) passed++; else failed++;

  if (test('handles long short IDs', () => {
    const result = sm.parseSessionFilename('2026-03-15-abcdef0123456789-session.tmp');
    assert.ok(result);
    assert.strictEqual(result.shortId, 'abcdef0123456789');
  })) passed++; else failed++;

  if (test('datetime is a valid Date object', () => {
    const result = sm.parseSessionFilename('2026-06-15-abc12345-session.tmp');
    assert.ok(result.datetime instanceof Date);
    assert.strictEqual(result.datetime.getFullYear(), 2026);
  })) passed++; else failed++;

  // --- parseSessionMetadata ---
  console.log('\nparseSessionMetadata:');

  if (test('extracts title from heading', () => {
    const meta = sm.parseSessionMetadata('# Session: 2026-02-01\nsome text');
    assert.strictEqual(meta.title, 'Session: 2026-02-01');
  })) passed++; else failed++;

  if (test('extracts date, started, and lastUpdated', () => {
    const content = `# Session
**Date:** 2026-03-10
**Started:** 14:30
**Last Updated:** 16:45`;
    const meta = sm.parseSessionMetadata(content);
    assert.strictEqual(meta.date, '2026-03-10');
    assert.strictEqual(meta.started, '14:30');
    assert.strictEqual(meta.lastUpdated, '16:45');
  })) passed++; else failed++;

  if (test('extracts completed items', () => {
    const content = `# Session
### Completed
- [x] First task
- [x] Second task
### In Progress`;
    const meta = sm.parseSessionMetadata(content);
    assert.strictEqual(meta.completed.length, 2);
    assert.strictEqual(meta.completed[0], 'First task');
  })) passed++; else failed++;

  if (test('extracts in-progress items', () => {
    const content = `# Session
### In Progress
- [ ] Working on this
- [ ] And this
### Notes`;
    const meta = sm.parseSessionMetadata(content);
    assert.strictEqual(meta.inProgress.length, 2);
    assert.strictEqual(meta.inProgress[0], 'Working on this');
  })) passed++; else failed++;

  if (test('returns defaults for null content', () => {
    const meta = sm.parseSessionMetadata(null);
    assert.strictEqual(meta.title, null);
    assert.strictEqual(meta.date, null);
    assert.deepStrictEqual(meta.completed, []);
    assert.deepStrictEqual(meta.inProgress, []);
  })) passed++; else failed++;

  if (test('returns defaults for empty content', () => {
    const meta = sm.parseSessionMetadata('');
    assert.strictEqual(meta.title, null);
  })) passed++; else failed++;

  // --- getSessionPath ---
  console.log('\ngetSessionPath:');

  if (test('returns path under sessions directory', () => {
    const p = sm.getSessionPath('test-session.tmp');
    assert.ok(p.endsWith('test-session.tmp'));
    assert.ok(p.includes('sessions'));
  })) passed++; else failed++;

  // --- writeSessionContent / getSessionContent / sessionExists ---
  console.log('\nFile I/O:');

  const tmpDir = createTempDir();
  const tmpFile = path.join(tmpDir, 'test-session.tmp');

  if (test('writeSessionContent writes file', () => {
    const result = sm.writeSessionContent(tmpFile, '# Test session');
    assert.strictEqual(result, true);
    assert.ok(fs.existsSync(tmpFile));
  })) passed++; else failed++;

  if (test('getSessionContent reads written file', () => {
    const content = sm.getSessionContent(tmpFile);
    assert.strictEqual(content, '# Test session');
  })) passed++; else failed++;

  if (test('getSessionContent returns null for missing file', () => {
    const content = sm.getSessionContent(path.join(tmpDir, 'nope.tmp'));
    assert.strictEqual(content, null);
  })) passed++; else failed++;

  if (test('sessionExists returns true for existing file', () => {
    assert.strictEqual(sm.sessionExists(tmpFile), true);
  })) passed++; else failed++;

  if (test('sessionExists returns false for missing file', () => {
    assert.strictEqual(sm.sessionExists(path.join(tmpDir, 'nope.tmp')), false);
  })) passed++; else failed++;

  // --- appendSessionContent ---
  if (test('appendSessionContent appends to file', () => {
    sm.appendSessionContent(tmpFile, '\n## Appended');
    const content = sm.getSessionContent(tmpFile);
    assert.ok(content.includes('## Appended'));
  })) passed++; else failed++;

  // --- deleteSession ---
  if (test('deleteSession removes file', () => {
    const delFile = path.join(tmpDir, 'del-session.tmp');
    fs.writeFileSync(delFile, 'delete me');
    assert.strictEqual(sm.deleteSession(delFile), true);
    assert.strictEqual(fs.existsSync(delFile), false);
  })) passed++; else failed++;

  if (test('deleteSession returns false for missing file', () => {
    assert.strictEqual(sm.deleteSession(path.join(tmpDir, 'nope.tmp')), false);
  })) passed++; else failed++;

  // --- getSessionStats ---
  console.log('\ngetSessionStats:');

  if (test('calculates stats from content', () => {
    const statsFile = path.join(tmpDir, 'stats-session.tmp');
    const content = `# Session: Test
**Date:** 2026-01-01
### Completed
- [x] Done thing
### In Progress
- [ ] Doing thing
- [ ] Another thing`;
    fs.writeFileSync(statsFile, content);
    const stats = sm.getSessionStats(statsFile);
    assert.strictEqual(stats.completedItems, 1);
    assert.strictEqual(stats.inProgressItems, 2);
    assert.strictEqual(stats.totalItems, 3);
    assert.ok(stats.lineCount > 0);
  })) passed++; else failed++;

  // --- getSessionTitle ---
  console.log('\ngetSessionTitle:');

  if (test('returns title from content', () => {
    const titleFile = path.join(tmpDir, 'title-session.tmp');
    fs.writeFileSync(titleFile, '# My Great Session\nContent here');
    assert.strictEqual(sm.getSessionTitle(titleFile), 'My Great Session');
  })) passed++; else failed++;

  if (test('returns default for missing file', () => {
    assert.strictEqual(sm.getSessionTitle(path.join(tmpDir, 'nope.tmp')), 'Untitled Session');
  })) passed++; else failed++;

  // --- getSessionSize ---
  console.log('\ngetSessionSize:');

  if (test('returns human-readable size', () => {
    const sizeFile = path.join(tmpDir, 'size-session.tmp');
    fs.writeFileSync(sizeFile, 'x'.repeat(100));
    const size = sm.getSessionSize(sizeFile);
    assert.strictEqual(size, '100 B');
  })) passed++; else failed++;

  if (test('returns 0 B for missing file', () => {
    assert.strictEqual(sm.getSessionSize(path.join(tmpDir, 'nope.tmp')), '0 B');
  })) passed++; else failed++;

  if (test('formats KB correctly', () => {
    const kbFile = path.join(tmpDir, 'kb-session.tmp');
    fs.writeFileSync(kbFile, 'x'.repeat(2048));
    const size = sm.getSessionSize(kbFile);
    assert.ok(size.endsWith('KB'), `Expected KB but got: ${size}`);
  })) passed++; else failed++;

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  // Results
  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);

  if (failed > 0) process.exit(1);
}

runTests();
