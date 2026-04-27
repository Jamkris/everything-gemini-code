#!/usr/bin/env node
/**
 * Validate agent markdown files against the Gemini CLI agent loader rules.
 *
 * Catches Issue #34-class regressions: invalid tool names, MCP tools listed
 * in frontmatter, Claude-style names, and unsupported keys (color/model).
 *
 * The validation rules live in scripts/lib/gemini-tools.js so they stay in
 * sync with .gemini/styleguide.md.
 */

'use strict';

const path = require('path');
const { extractFrontmatter, validateFiles } = require('../lib/validator');
const { validateAgentFrontmatter } = require('../lib/gemini-tools');

validateFiles({
  dir: path.join(__dirname, '../../agents'),
  label: 'agent',
  extension: '.md',
  validate(content) {
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) return ['Missing frontmatter'];
    const errors = validateAgentFrontmatter(frontmatter);
    return errors.length > 0 ? errors : null;
  }
});
