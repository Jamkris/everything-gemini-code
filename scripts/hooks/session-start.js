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

async function main() {
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

  // Ensure command shims exist (for short aliases like /tdd)
  try {
    const fs = require('fs');
    const path = require('path');
    const geminiDir = getGeminiDir();
    const globalCmdDir = path.join(geminiDir, 'commands');
    
    // Check if the primary shim exists and is valid
    let needsGeneration = !fs.existsSync(path.join(globalCmdDir, 'tdd.toml'));
    
    // If it exists, check if it's the updated version (namespaced)
    if (!needsGeneration) {
      try {
        const content = fs.readFileSync(path.join(globalCmdDir, 'tdd.toml'), 'utf8');
        if (!content.includes('@everything-gemini-code.')) {
          needsGeneration = true; // Force update if legacy format
        }
      } catch (_e) {
        needsGeneration = true;
      }
    }

    if (needsGeneration) {
      log('[SessionStart] Generating/Updating command shims for short aliases...');
      
      // Extension root is ../.. from this script
      const extDir = path.resolve(__dirname, '..', '..');
      const extCmdDir = path.join(extDir, 'commands');
      const agentsDir = path.join(extDir, 'agents');
      
      if (fs.existsSync(extCmdDir)) {
        ensureDir(globalCmdDir);
        
        const cmdFiles = fs.readdirSync(extCmdDir).filter(f => f.endsWith('.toml'));
        
        // Get list of agents to replace references
        let agentNames = [];
        if (fs.existsSync(agentsDir)) {
          agentNames = fs.readdirSync(agentsDir)
            .filter(f => f.endsWith('.md'))
            .map(f => f.replace('.md', ''));
        }
        
        for (const file of cmdFiles) {
          const content = fs.readFileSync(path.join(extCmdDir, file), 'utf8');
          let newContent = content;
          
          // Replace @agent-name with @everything-gemini-code.agent-name
          for (const agent of agentNames) {
            newContent = newContent.replace(
              new RegExp(`@${agent}`, 'g'), 
              `@everything-gemini-code.${agent}`
            );
          }
          
          fs.writeFileSync(path.join(globalCmdDir, file), newContent);
          log(`[SessionStart] Created/Updated shim: ${file}`);
        }
      }
    }
  } catch (err) {
    log(`[SessionStart] Warning: Failed to generate shims: ${err.message}`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});
