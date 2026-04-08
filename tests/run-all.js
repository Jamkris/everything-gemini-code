#!/usr/bin/env node
/**
 * Run all tests
 *
 * Usage: node tests/run-all.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testsDir = __dirname;
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/session-manager.test.js',
  'lib/session-aliases.test.js',
  'hooks/hooks.test.js'
];

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║           Everything Gemini CLI - Test Suite            ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log();

let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

for (const testFile of testFiles) {
  const testPath = path.join(testsDir, testFile);

  if (!fs.existsSync(testPath)) {
    console.log(`⚠ Skipping ${testFile} (file not found)`);
    continue;
  }

  console.log(`\n━━━ Running ${testFile} ━━━`);

  try {
    const output = execSync(`node "${testPath}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(output);

    // Parse results from output
    const passedMatch = output.match(/Passed:\s*(\d+)/);
    const failedMatch = output.match(/Failed:\s*(\d+)/);

    if (passedMatch) totalPassed += parseInt(passedMatch[1], 10);
    if (failedMatch) totalFailed += parseInt(failedMatch[1], 10);

  } catch (err) {
    console.log(err.stdout || '');
    console.log(err.stderr || '');

    // Parse results even on failure
    const output = (err.stdout || '') + (err.stderr || '');
    const passedMatch = output.match(/Passed:\s*(\d+)/);
    const failedMatch = output.match(/Failed:\s*(\d+)/);

    if (passedMatch) totalPassed += parseInt(passedMatch[1], 10);
    if (failedMatch) totalFailed += parseInt(failedMatch[1], 10);
  }
}

totalTests = totalPassed + totalFailed;

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║                     Final Results                        ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log(`║  Total Tests: ${String(totalTests).padStart(4)}                                      ║`);
console.log(`║  Passed:      ${String(totalPassed).padStart(4)}  ✓                                   ║`);
console.log(`║  Failed:      ${String(totalFailed).padStart(4)}  ${totalFailed > 0 ? '✗' : ' '}                                   ║`);
console.log('╚══════════════════════════════════════════════════════════╝');

process.exit(totalFailed > 0 ? 1 : 0);
