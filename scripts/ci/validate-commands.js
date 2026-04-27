#!/usr/bin/env node
/**
 * Validate command TOML files.
 *
 * Beyond the original "non-empty file" check this enforces:
 *   - filename uses the `egc-` prefix (PR #38 — avoids collisions with
 *     Gemini CLI built-in commands like `/plan` and `/docs`)
 *   - a non-empty `description = "..."` field exists
 *
 * `EGC_PREFIX_EXEMPT` lists filenames that are intentionally allowed to
 * skip the prefix (none today; kept as an explicit allowlist so future
 * exceptions are reviewed instead of slipping through).
 */

'use strict';

const path = require('path');
const { validateFiles } = require('../lib/validator');

const EGC_PREFIX_EXEMPT = new Set([]);

const DESCRIPTION_RE = /^\s*description\s*=\s*(['"])([^]*?)\1/m;

function validateCommandContent(content, filename) {
  const errors = [];

  if (content.trim().length === 0) {
    errors.push('Empty command file');
    return errors;
  }

  if (!EGC_PREFIX_EXEMPT.has(filename) && !filename.startsWith('egc-')) {
    errors.push(
      `Filename must start with "egc-" prefix (collides with Gemini CLI ` +
      `built-ins otherwise — see PR #38).`
    );
  }

  const match = DESCRIPTION_RE.exec(content);
  if (!match) {
    errors.push('Missing required field: description');
  } else if (match[2].trim().length === 0) {
    errors.push('Empty description field');
  }

  return errors;
}

if (require.main === module) {
  validateFiles({
    dir: path.join(__dirname, '../../commands'),
    label: 'command',
    extension: '.toml',
    validate(content, filename) {
      const errors = validateCommandContent(content, filename);
      return errors.length > 0 ? errors : null;
    }
  });
}

module.exports = { validateCommandContent };
