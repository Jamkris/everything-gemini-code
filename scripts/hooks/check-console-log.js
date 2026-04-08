#!/usr/bin/env node

/**
 * Stop Hook: Check for console.log statements in modified files
 *
 * This hook runs after each response and checks if any modified
 * JavaScript/TypeScript files contain console.log statements.
 * It provides warnings to help developers remember to remove
 * debug statements before committing.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const { runStdinHook } = require('../lib/hook-utils');

runStdinHook('CheckConsoleLog', (data) => {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
  } catch {
    console.log(data);
    return;
  }

  const files = execSync('git diff --name-only HEAD', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  })
    .split('\n')
    .filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && fs.existsSync(f));

  let hasConsole = false;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('console.log')) {
      console.error(`[Hook] WARNING: console.log found in ${file}`);
      hasConsole = true;
    }
  }

  if (hasConsole) {
    console.error('[Hook] Remove console.log statements before committing');
  }

  console.log(data);
});
