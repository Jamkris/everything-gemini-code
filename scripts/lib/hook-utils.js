/**
 * Common utilities for Gemini CLI hook scripts
 *
 * Provides the shared async-main wrapper, logging, and
 * stdin reading patterns used across all hooks.
 */

/**
 * Run a hook's main function with standard error handling.
 * Errors are logged but never block the CLI (always exits 0).
 *
 * @param {string} name - Hook name for log prefix (e.g., "SessionStart")
 * @param {Function} fn - Async function containing hook logic
 */
function runHook(name, fn) {
  Promise.resolve(fn()).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(`[${name}] Error:`, err.message);
    process.exit(0);
  });
}

/**
 * Run a stdin-piping hook (reads from stdin, must output to stdout).
 * Used by hooks that sit in the tool I/O pipeline (e.g., check-console-log).
 *
 * @param {string} name - Hook name for log prefix
 * @param {Function} fn - Function receiving stdin data string, must call console.log(data) when done
 */
function runStdinHook(name, fn) {
  const chunks = [];
  process.stdin.on('data', chunk => { chunks.push(chunk); });
  process.stdin.on('end', () => {
    const data = Buffer.concat(chunks).toString();
    try {
      fn(data);
    } catch (error) {
      console.error(`[${name}] Hook failed:`, error.message);
      console.log(data);
    }
  });
}

module.exports = { runHook, runStdinHook };
