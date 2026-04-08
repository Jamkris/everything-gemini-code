#!/usr/bin/env node
/**
 * Strategic Compact Suggester
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs on PreToolUse or periodically to suggest manual compaction at logical intervals
 *
 * Why manual over auto-compact:
 * - Auto-compact happens at arbitrary points, often mid-task
 * - Strategic compacting preserves context through logical phases
 * - Compact after exploration, before execution
 * - Compact after completing a milestone, before starting next
 */

const path = require('path');
const {
  getTempDir,
  readFile,
  writeFile
} = require('../lib/utils');

const { runHook } = require('../lib/hook-utils');

runHook('StrategicCompact', async () => {
  // Track tool call count (increment in a temp file)
  // Use a session-specific counter file based on PID from parent process
  // or session ID from environment
  const sessionId = process.env.GEMINI_SESSION_ID || process.ppid || 'default';
  const counterFile = path.join(getTempDir(), `gemini-tool-count-${sessionId}`);
  const threshold = parseInt(process.env.COMPACT_THRESHOLD || '50', 10);

  let count = 1;

  // Read existing count or start at 1
  const existing = readFile(counterFile);
  if (existing) {
    count = parseInt(existing.trim(), 10) + 1;
  }

  // Save updated count
  writeFile(counterFile, String(count));

  // Suggest compact only at key milestones (threshold and intervals)
  if (count === threshold) {
    console.error(`[Hint] ${threshold} tool calls reached - consider /compact if transitioning phases`);
  } else if (count > threshold && count % 25 === 0) {
    console.error(`[Hint] ${count} tool calls - good checkpoint for /compact if context is stale`);
  }

});
