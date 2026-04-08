#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Gemini session starts. Checks for recent session
 * files and notifies Gemini of available context to load.
 */

const {
  getGeminiDir,
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  log
} = require('../lib/utils');
const { getPackageManager, getSelectionPrompt } = require('../lib/package-manager');
const { listAliases } = require('../lib/session-aliases');

const { runHook } = require('../lib/hook-utils');

runHook('SessionStart', async () => {
  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  // Match both old format (YYYY-MM-DD-session.tmp) and new format (YYYY-MM-DD-shortid-session.tmp)
  const recentSessions = findFiles(sessionsDir, '*-session.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // Check for available session aliases
  const aliases = listAliases({ limit: 5 });

  if (aliases.length > 0) {
    const aliasNames = aliases.map(a => a.name).join(', ');
    log(`[SessionStart] ${aliases.length} session alias(es) available: ${aliasNames}`);
    log(`[SessionStart] Use /sessions load <alias> to continue a previous session`);
  }

  // Detect and report package manager
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // If package manager was detected via fallback, show selection prompt
  if (pm.source === 'fallback' || pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  // Command shims: only needed for manual installs (no extension).
  // When the extension is installed, Gemini CLI loads commands directly
  // from the extension directory. Creating shims would cause conflicts
  // (every command gets renamed to /everything-gemini-code:xxx and /user.xxx).
  try {
    const fs = require('fs');
    const path = require('path');
    const geminiDir = getGeminiDir();
    const extInstalledDir = path.join(geminiDir, 'extensions', 'everything-gemini-code');
    const isExtensionInstall = fs.existsSync(extInstalledDir);

    if (isExtensionInstall) {
      // Clean up stale shims from previous installs to avoid conflicts
      const globalCmdDir = path.join(geminiDir, 'commands');
      if (fs.existsSync(globalCmdDir)) {
        const extDir = path.resolve(__dirname, '..', '..');
        const extCmdDir = path.join(extDir, 'commands');
        if (fs.existsSync(extCmdDir)) {
          const extCmds = new Set(fs.readdirSync(extCmdDir).filter(f => f.endsWith('.toml')));
          for (const file of fs.readdirSync(globalCmdDir).filter(f => f.endsWith('.toml'))) {
            if (extCmds.has(file)) {
              fs.unlinkSync(path.join(globalCmdDir, file));
              log(`[SessionStart] Removed stale shim: ${file}`);
            }
          }
        }
      }
    } else {
      // Manual install: create shims so short aliases like /tdd work
      const globalCmdDir = path.join(geminiDir, 'commands');
      const extDir = path.resolve(__dirname, '..', '..');
      const extCmdDir = path.join(extDir, 'commands');
      const agentsDir = path.join(extDir, 'agents');

      if (fs.existsSync(extCmdDir)) {
        ensureDir(globalCmdDir);
        const cmdFiles = fs.readdirSync(extCmdDir).filter(f => f.endsWith('.toml'));

        let agentNames = [];
        if (fs.existsSync(agentsDir)) {
          agentNames = fs.readdirSync(agentsDir)
            .filter(f => f.endsWith('.md'))
            .map(f => f.replace('.md', ''));
        }

        for (const file of cmdFiles) {
          const globalFile = path.join(globalCmdDir, file);
          if (!fs.existsSync(globalFile)) {
            const content = fs.readFileSync(path.join(extCmdDir, file), 'utf8');
            let newContent = content;
            for (const agent of agentNames) {
              newContent = newContent.replace(
                new RegExp(`@${agent}\\b`, 'g'),
                `@everything-gemini-code.${agent}`
              );
            }
            fs.writeFileSync(globalFile, newContent);
            log(`[SessionStart] Created shim: ${file}`);
          }
        }
      }
    }
  } catch (err) {
    log(`[SessionStart] Warning: Shim management failed: ${err.message}`);
  }

});
