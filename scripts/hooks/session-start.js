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
        const globalFile = path.join(globalCmdDir, file);
        let needsUpdate = !fs.existsSync(globalFile);
        
        // If it exists, check if it's the updated version (namespaced)
        if (!needsUpdate) {
          try {
            const content = fs.readFileSync(globalFile, 'utf8');
            // Check if it contains at least one namespaced agent reference
            // ONLY if the command actually references an agent. 
            // Simple heuristic: if source has @agent, target must have @everything-gemini-code.agent
            // But reading source is expensive?
            // Let's just check if content lacks namespace.
            // But some commands might NOT use agents.
            // However, most do.
            // Safe check: if it contains ANY @agent that is IN our agent list, it must be namespaced.
            
            // For simplicity, we can just check if it contains ANY @everything-gemini-code. 
            // OR we can just overwrite always? No, unnecessary IO.
            // Let's stick to the previous check: if missing namespace, update.
            if (!content.includes('@everything-gemini-code.') && agentNames.length > 0) {
              // But what if command doesn't use agents?
              // Then it doesn't need update.
              // Let's read source content to check if it needs update.
              const srcContent = fs.readFileSync(path.join(extCmdDir, file), 'utf8');
              if (srcContent.includes('@') && !content.includes('@everything-gemini-code.')) {
                 needsUpdate = true;
              }
            }
          } catch (_e) {
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          const content = fs.readFileSync(path.join(extCmdDir, file), 'utf8');
          let newContent = content;
          
          // Replace @agent-name with @everything-gemini-code.agent-name
          for (const agent of agentNames) {
            newContent = newContent.replace(
              new RegExp(`@${agent}\\b`, 'g'), // Add word boundary to avoid partial matches
              `@everything-gemini-code.${agent}`
            );
          }
          
          fs.writeFileSync(globalFile, newContent);
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
