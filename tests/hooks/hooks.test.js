/**
 * Tests for hook scripts
 *
 * Run with: node tests/hooks/hooks.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

// Test helper
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

// Async test helper
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// Run a script and capture output
function runScript(scriptPath, input = '', env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [scriptPath], {
      env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', data => stdout += data);
    proc.stderr.on('data', data => stderr += data);

    if (input) {
      proc.stdin.write(input);
    }
    proc.stdin.end();

    proc.on('close', code => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', reject);
  });
}

// Create a temporary test directory
function createTestDir() {
  const testDir = path.join(os.tmpdir(), `hooks-test-${Date.now()}`);
  fs.mkdirSync(testDir, { recursive: true });
  return testDir;
}

// Clean up test directory
function cleanupTestDir(testDir) {
  fs.rmSync(testDir, { recursive: true, force: true });
}

// Test suite
async function runTests() {
  console.log('\n=== Testing Hook Scripts ===\n');

  let passed = 0;
  let failed = 0;

  const scriptsDir = path.join(__dirname, '..', '..', 'scripts', 'hooks');

  // session-start.js tests
  console.log('session-start.js:');

  if (await asyncTest('runs without error', async () => {
    const result = await runScript(path.join(scriptsDir, 'session-start.js'));
    assert.strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`);
  })) passed++; else failed++;

  if (await asyncTest('runs silently on success', async () => {
    const result = await runScript(path.join(scriptsDir, 'session-start.js'));
    // Normal operation should produce minimal or no stderr output
    // Only warnings/errors should appear
    assert.ok(
      !result.stderr.includes('[SessionStart] Found') &&
      !result.stderr.includes('[SessionStart] Package manager'),
      'Should not output verbose info on success'
    );
  })) passed++; else failed++;

  // session-end.js tests
  console.log('\nsession-end.js:');

  if (await asyncTest('runs without error', async () => {
    const result = await runScript(path.join(scriptsDir, 'session-end.js'));
    assert.strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`);
  })) passed++; else failed++;

  if (await asyncTest('creates or updates session file', async () => {
    // Run the script
    await runScript(path.join(scriptsDir, 'session-end.js'));

    // Check if session file was created
    // Note: Without GEMINI_SESSION_ID, falls back to project name (not 'default')
    // Use local time to match the script's getDateString() function
    const sessionsDir = path.join(os.homedir(), '.gemini', 'sessions');
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Get the expected session ID (project name fallback)
    const utils = require('../../scripts/lib/utils');
    const expectedId = utils.getSessionIdShort();
    const sessionFile = path.join(sessionsDir, `${today}-${expectedId}-session.tmp`);

    assert.ok(fs.existsSync(sessionFile), `Session file should exist: ${sessionFile}`);
  })) passed++; else failed++;

  if (await asyncTest('includes session ID in filename', async () => {
    const testSessionId = 'test-session-abc12345';
    const expectedShortId = 'abc12345'; // Last 8 chars

    // Run with custom session ID
    await runScript(path.join(scriptsDir, 'session-end.js'), '', {
      GEMINI_SESSION_ID: testSessionId
    });

    // Check if session file was created with session ID
    // Use local time to match the script's getDateString() function
    const sessionsDir = path.join(os.homedir(), '.gemini', 'sessions');
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const sessionFile = path.join(sessionsDir, `${today}-${expectedShortId}-session.tmp`);

    assert.ok(fs.existsSync(sessionFile), `Session file should exist: ${sessionFile}`);
  })) passed++; else failed++;

  // pre-compact.js tests
  console.log('\npre-compact.js:');

  if (await asyncTest('runs without error', async () => {
    const result = await runScript(path.join(scriptsDir, 'pre-compact.js'));
    assert.strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`);
  })) passed++; else failed++;

  if (await asyncTest('runs silently on success', async () => {
    const result = await runScript(path.join(scriptsDir, 'pre-compact.js'));
    assert.ok(!result.stderr.includes('[PreCompact]'), 'Should not output verbose info on success');
  })) passed++; else failed++;

  if (await asyncTest('creates compaction log', async () => {
    await runScript(path.join(scriptsDir, 'pre-compact.js'));
    const logFile = path.join(os.homedir(), '.gemini', 'sessions', 'compaction-log.txt');
    assert.ok(fs.existsSync(logFile), 'Compaction log should exist');
  })) passed++; else failed++;

  // suggest-compact.js tests
  console.log('\nsuggest-compact.js:');

  if (await asyncTest('runs without error', async () => {
    const result = await runScript(path.join(scriptsDir, 'suggest-compact.js'), '', {
      GEMINI_SESSION_ID: 'test-session-' + Date.now()
    });
    assert.strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`);
  })) passed++; else failed++;

  if (await asyncTest('increments counter on each call', async () => {
    const sessionId = 'test-counter-' + Date.now();

    // Run multiple times
    for (let i = 0; i < 3; i++) {
      await runScript(path.join(scriptsDir, 'suggest-compact.js'), '', {
        GEMINI_SESSION_ID: sessionId
      });
    }

    // Check counter file
    const counterFile = path.join(os.tmpdir(), `gemini-tool-count-${sessionId}`);
    const count = parseInt(fs.readFileSync(counterFile, 'utf8').trim(), 10);
    assert.strictEqual(count, 3, `Counter should be 3, got ${count}`);

    // Cleanup
    fs.unlinkSync(counterFile);
  })) passed++; else failed++;

  if (await asyncTest('runs silently at threshold', async () => {
    const sessionId = 'test-threshold-' + Date.now();
    const counterFile = path.join(os.tmpdir(), `gemini-tool-count-${sessionId}`);

    // Set counter to threshold - 1
    fs.writeFileSync(counterFile, '49');

    const result = await runScript(path.join(scriptsDir, 'suggest-compact.js'), '', {
      GEMINI_SESSION_ID: sessionId,
      COMPACT_THRESHOLD: '50'
    });

    assert.strictEqual(result.code, 0, 'Should exit cleanly');
    assert.strictEqual(result.stderr, '', 'Should produce no output at threshold');

    // Cleanup
    fs.unlinkSync(counterFile);
  })) passed++; else failed++;

  // evaluate-session.js tests
  console.log('\nevaluate-session.js:');

  if (await asyncTest('runs without error when no transcript', async () => {
    const result = await runScript(path.join(scriptsDir, 'evaluate-session.js'));
    assert.strictEqual(result.code, 0, `Exit code should be 0, got ${result.code}`);
  })) passed++; else failed++;

  if (await asyncTest('skips short sessions silently', async () => {
    const testDir = createTestDir();
    const transcriptPath = path.join(testDir, 'transcript.jsonl');

    const transcript = Array(5).fill('{"type":"user","content":"test"}\n').join('');
    fs.writeFileSync(transcriptPath, transcript);

    const result = await runScript(path.join(scriptsDir, 'evaluate-session.js'), '', {
      GEMINI_TRANSCRIPT_PATH: transcriptPath
    });

    assert.strictEqual(result.code, 0, 'Should exit cleanly');
    assert.ok(!result.stderr.includes('Session too short'), 'Should skip silently');

    cleanupTestDir(testDir);
  })) passed++; else failed++;

  if (await asyncTest('processes long sessions silently', async () => {
    const testDir = createTestDir();
    const transcriptPath = path.join(testDir, 'transcript.jsonl');

    const transcript = Array(15).fill('{"type":"user","content":"test"}\n').join('');
    fs.writeFileSync(transcriptPath, transcript);

    const result = await runScript(path.join(scriptsDir, 'evaluate-session.js'), '', {
      GEMINI_TRANSCRIPT_PATH: transcriptPath
    });

    assert.strictEqual(result.code, 0, 'Should exit cleanly');
    assert.ok(!result.stderr.includes('15 messages'), 'Should process silently');

    cleanupTestDir(testDir);
  })) passed++; else failed++;

  // hooks.json validation
  console.log('\nhooks.json Validation:');

  if (test('hooks.json is valid JSON', () => {
    const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
    const content = fs.readFileSync(hooksPath, 'utf8');
    JSON.parse(content); // Will throw if invalid
  })) passed++; else failed++;

  if (test('hooks.json has required event types', () => {
    const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
    const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

    // Support both object and array format (new format uses object)
    const hooksObj = hooks.hooks || hooks;

    if (Array.isArray(hooksObj)) {
         // Legacy array format
         console.log('    Note: Using legacy array format');
    } else {
         // Object format
         assert.ok(hooksObj.BeforeTool || hooksObj.PreToolUse, 'Should have BeforeTool (or PreToolUse) hooks');
         assert.ok(hooksObj.AfterTool || hooksObj.PostToolUse, 'Should have AfterTool (or PostToolUse) hooks');
         assert.ok(hooksObj.SessionStart, 'Should have SessionStart hooks');
         assert.ok(hooksObj.SessionEnd, 'Should have SessionEnd hooks');
         // PreCompress is optional but good to check if it's there instead of PreCompact
         if (hooksObj.PreCompact) {
            console.log('    Warning: using deprecated PreCompact event');
         }
         if (hooksObj.PreCompress) {
             assert.ok(hooksObj.PreCompress, 'Should have PreCompress hooks');
         }
    }
  })) passed++; else failed++;

  if (test('all hook commands use node', () => {
    const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
    const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    const hooksObj = hooks.hooks || hooks;

    const checkHooks = (hookArray) => {
      if (!hookArray) return;
      for (const entry of hookArray) {
        for (const hook of entry.hooks) {
          if (hook.type === 'command') {
            assert.ok(
              hook.command.startsWith('node'),
              `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
            );
          }
        }
      }
    };

    if (Array.isArray(hooksObj)) {
        checkHooks(hooksObj);
    } else {
        for (const [, hookArray] of Object.entries(hooksObj)) {
            checkHooks(hookArray);
        }
    }
  })) passed++; else failed++;

  if (test('script references use relative paths (no env vars)', () => {
    const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
    const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    const hooksObj = hooks.hooks || hooks;

    const checkHooks = (hookArray) => {
      if (!hookArray) return;
      for (const entry of hookArray) {
        for (const hook of entry.hooks) {
          if (hook.type === 'command' && (hook.command.includes('scripts/hooks/') || hook.command.match(/\.js"?$/))) {
            // Should NOT use ${GEMINI_PLUGIN_ROOT} or ${GEMINI_EXTENSION_ROOT} as they are unreliable
            const hasEnvVar = hook.command.includes('${GEMINI_PLUGIN_ROOT}') || hook.command.includes('${GEMINI_EXTENSION_ROOT}');
            assert.ok(
              !hasEnvVar,
              `Script paths should be relative (no env vars): ${hook.command.substring(0, 80)}...`
            );
          }
        }
      }
    };

    if (Array.isArray(hooksObj)) {
        checkHooks(hooksObj);
    } else {
        for (const [, hookArray] of Object.entries(hooksObj)) {
            checkHooks(hookArray);
        }
    }
  })) passed++; else failed++;

  if (test('hook script commands avoid POSIX-only shell syntax (Windows PS compat)', () => {
    // Regression guard for #42. Hook commands that invoke a script file must
    // not chain with `||`, redirect with `2>/dev/null`, or rely on `true` —
    // Windows PowerShell 5.x parses `||` as an error and has no /dev/null.
    // Inline `node -e "..."` payloads are exempt because the JS string is
    // consumed by Node, not the shell.
    const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
    const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    const hooksObj = hooks.hooks || hooks;

    const checkHooks = (hookArray) => {
      if (!hookArray) return;
      for (const entry of hookArray) {
        for (const hook of entry.hooks) {
          if (hook.type !== 'command') continue;
          if (hook.command.startsWith('node -e ')) continue;
          // Regex guards catch variants like `||true`, `cmd|| true`, `2> /dev/null`.
          const bad = [
            { pattern: /\|\|/, label: '||' },
            { pattern: /2>\s*\/dev\/null\b/, label: '2>/dev/null' },
            { pattern: /(^|\s)true(\s|$)/, label: 'trailing `true`' },
          ];
          for (const { pattern, label } of bad) {
            assert.ok(
              !pattern.test(hook.command),
              `Hook command must not use POSIX-only "${label}" (breaks on Windows PowerShell): ${hook.command.substring(0, 80)}...`
            );
          }
        }
      }
    };

    if (Array.isArray(hooksObj)) {
        checkHooks(hooksObj);
    } else {
        for (const [, hookArray] of Object.entries(hooksObj)) {
            checkHooks(hookArray);
        }
    }
  })) passed++; else failed++;

  if (test('run.js launcher resolves hook files from its own directory', () => {
    const launcher = path.join(__dirname, '..', '..', 'scripts', 'hooks', 'run.js');
    assert.ok(fs.existsSync(launcher), 'scripts/hooks/run.js must exist');
    const src = fs.readFileSync(launcher, 'utf8');
    // Strip block + line comments so header doc can't satisfy the assertions.
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    assert.ok(
      /path\.join\(\s*__dirname/.test(code),
      'launcher should resolve hooks via path.join(__dirname, ...)'
    );
    assert.ok(
      /process\.argv\[2\]/.test(code),
      'launcher should read hook name from process.argv[2]'
    );
  })) passed++; else failed++;

  // plugin.json validation
  console.log('\nplugin.json Validation:');

  if (test('plugin.json does NOT have explicit hooks declaration', () => {
    // Gemini CLI automatically loads hooks/hooks.json by convention.
    // Explicitly declaring it in plugin.json causes a duplicate detection error.
    // See: https://github.com/Jamkris/everything-gemini-code/issues/103
    const pluginPath = path.join(__dirname, '..', '..', '.gemini-plugin', 'plugin.json');
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));

    assert.ok(
      !plugin.hooks,
      'plugin.json should NOT have "hooks" field - Gemini CLI auto-loads hooks/hooks.json'
    );
  })) passed++; else failed++;

  // Summary
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
