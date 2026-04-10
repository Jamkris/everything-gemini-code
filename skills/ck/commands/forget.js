#!/usr/bin/env node
/**
 * ck — Context Keeper v2
 * forget.js — remove a project's context and registry entry
 *
 * Usage: node forget.js [name|number]
 * stdout: confirmation or error
 * exit 0: success  exit 1: not found
 *
 * Note: SKILL.md instructs Claude to ask "Are you sure?" before calling this script.
 * This script is the "do it" step — no confirmation prompt here.
 */

const { rmSync } = require('fs');
const { resolve } = require('path');
const { resolveContext, readProjects, writeProjects, CONTEXTS_DIR } = require('./shared.js');

const arg = process.argv[2];
const cwd = process.env.PWD || process.cwd();

const resolved = resolveContext(arg, cwd);
if (!resolved) {
  const hint = arg ? `No project matching "${arg}".` : 'This directory is not registered.';
  console.log(`${hint}`);
  process.exit(1);
}

const { name, contextDir, projectPath } = resolved;

// Remove context directory
const contextDirPath = resolve(CONTEXTS_DIR, contextDir);
try {
  rmSync(contextDirPath, { recursive: true, force: true });
} catch (e) {
  console.log(`ck: could not remove context directory — ${e.message}`);
  process.exit(1);
}

// Remove from projects.json
const projects = readProjects();
delete projects[projectPath];
writeProjects(projects);

console.log(`✓ Context for '${name}' removed.`);
