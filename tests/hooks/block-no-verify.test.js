/**
 * Tests for scripts/hooks/block-no-verify.js
 *
 * Invokes the hook script directly via stdin (Gemini CLI BeforeTool runs
 * hooks as standalone Node processes). Upstream's test harness goes through
 * a `run-with-flags.js` indirection that this project does not have.
 */

'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, '..', '..', 'scripts', 'hooks', 'block-no-verify.js');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function runHook(input) {
  const rawInput = typeof input === 'string' ? input : JSON.stringify(input);
  const result = spawnSync('node', [HOOK], {
    input: rawInput,
    encoding: 'utf8',
    timeout: 15000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  return {
    code: Number.isInteger(result.status) ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

let passed = 0;
let failed = 0;

console.log('\nblock-no-verify hook tests');
console.log('─'.repeat(50));

if (test('allows plain git commit', () => {
  const r = runHook({ tool_input: { command: 'git commit -m "hello"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('blocks --no-verify on git commit', () => {
  const r = runHook({ tool_input: { command: 'git commit --no-verify -m "msg"' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
  assert.ok(r.stderr.includes('BLOCKED'), `stderr should contain BLOCKED: ${r.stderr}`);
})) passed++; else failed++;

if (test('blocks -n shorthand on git commit', () => {
  const r = runHook({ tool_input: { command: 'git commit -n -m "msg"' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
  assert.ok(r.stderr.includes('BLOCKED'), `stderr should contain BLOCKED: ${r.stderr}`);
})) passed++; else failed++;

if (test('blocks core.hooksPath override', () => {
  const r = runHook({ tool_input: { command: 'git -c core.hooksPath=/dev/null commit -m "msg"' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
  assert.ok(r.stderr.includes('core.hooksPath'), `stderr should mention core.hooksPath: ${r.stderr}`);
})) passed++; else failed++;

// Chained-command false-positive prevention
if (test('does not false-positive on -n belonging to git log in a chain', () => {
  const r = runHook({ tool_input: { command: 'git log -n 10 && git commit -m "msg"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('does not false-positive on --no-verify in a prior non-git command', () => {
  const r = runHook({ tool_input: { command: 'echo --no-verify && git commit -m "msg"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('still blocks --no-verify on the git commit part of a chain', () => {
  const r = runHook({ tool_input: { command: 'git log -n 5 && git commit --no-verify -m "msg"' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
})) passed++; else failed++;

// Subcommand detection
if (test('does not misclassify "commit" as subcommand when it is a refspec arg to push', () => {
  const r = runHook({ tool_input: { command: 'git push origin commit' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('blocks --no-verify on git push', () => {
  const r = runHook({ tool_input: { command: 'git push --no-verify' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
  assert.ok(r.stderr.includes('git push'), `stderr should mention git push: ${r.stderr}`);
})) passed++; else failed++;

// Pass-through
if (test('allows non-git commands', () => {
  const r = runHook({ tool_input: { command: 'npm test' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('handles plain text input (no tool_input wrapper)', () => {
  const r = runHook('git commit -m "hello"');
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('blocks plain text input with --no-verify', () => {
  const r = runHook('git commit --no-verify -m "msg"');
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
})) passed++; else failed++;

// False-positive prevention: flag-like text inside quoted commit messages
// must not trigger a block (gemini-code-assist review on PR #47).
if (test('does not false-positive on --no-verify inside double-quoted message', () => {
  const r = runHook({ tool_input: { command: 'git commit -m "fix: --no-verify edge case"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('does not false-positive on --no-verify inside single-quoted message', () => {
  const r = runHook({ tool_input: { command: "git commit -m 'fix: --no-verify edge case'" } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('does not false-positive on -n inside quoted commit message', () => {
  const r = runHook({ tool_input: { command: 'git commit -m "Fixed -n bug in module"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('does not false-positive on core.hooksPath= inside quoted message', () => {
  const r = runHook({ tool_input: { command: 'git commit -m "doc: explain core.hooksPath= setting"' } });
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}: ${r.stderr}`);
})) passed++; else failed++;

if (test('still blocks --no-verify when both quoted message and real flag are present', () => {
  const r = runHook({ tool_input: { command: 'git commit --no-verify -m "fix: -n edge case"' } });
  assert.strictEqual(r.code, 2, `expected exit 2, got ${r.code}`);
})) passed++; else failed++;

console.log('─'.repeat(50));
console.log(`Passed: ${passed}  Failed: ${failed}`);

process.exit(failed > 0 ? 1 : 0);
