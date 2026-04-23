#!/usr/bin/env node
/**
 * Cross-platform hook launcher.
 *
 * Invoked from hooks.json as:
 *   node "<extension-root>/scripts/hooks/run.js" <hook-name>
 *
 * Resolves the target hook file relative to this launcher (__dirname) so the
 * same hooks.json works regardless of whether the extension was installed to
 * ~/.gemini/extensions/... or copied under ~/.gemini/ directly. Avoids
 * POSIX-only shell constructs (`||`, `2>/dev/null`, `true`) that break on
 * Windows PowerShell 5.x. See issue #42.
 */

'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const hookName = process.argv[2];
if (!hookName || !/^[a-z][a-z0-9-]*$/i.test(hookName)) {
  // No hook name, or a suspicious value — exit silently.
  process.exit(0);
}

const hookPath = path.join(__dirname, `${hookName}.js`);
if (!fs.existsSync(hookPath)) {
  // Optional hook not installed — stay quiet, matches the prior `|| true` behavior.
  process.exit(0);
}

// Run the hook in its own Node process so it inherits stdin/stdout/stderr
// unchanged (hooks read JSON payloads on stdin and may write to stdout/stderr).
// Mirror the previous "fail soft" semantics: a hook error never fails the
// parent Gemini CLI action. Surface via GEMINI_HOOK_DEBUG=1 when diagnosing.
// Bound execution time so a hung hook can't stall a Gemini session. Override
// via GEMINI_HOOK_TIMEOUT_MS (e.g. set to a larger value for slow hooks, or
// to 0 to disable the bound).
const DEFAULT_HOOK_TIMEOUT_MS = 30_000;
const parsedTimeout = Number.parseInt(process.env.GEMINI_HOOK_TIMEOUT_MS || '', 10);
const timeout = Number.isFinite(parsedTimeout) && parsedTimeout >= 0
  ? parsedTimeout
  : DEFAULT_HOOK_TIMEOUT_MS;

const spawnOptions = { stdio: 'inherit' };
if (timeout > 0) spawnOptions.timeout = timeout;

const result = spawnSync(process.execPath, [hookPath], spawnOptions);
if (result.error && process.env.GEMINI_HOOK_DEBUG) {
  console.error(`[hook:${hookName}] spawn error:`, result.error);
}
process.exit(0);
