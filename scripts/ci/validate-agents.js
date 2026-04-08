#!/usr/bin/env node
/**
 * Validate agent markdown files have required frontmatter
 */

const path = require('path');
const { extractFrontmatter, validateFiles } = require('../lib/validator');

const REQUIRED_FIELDS = ['tools'];

validateFiles({
  dir: path.join(__dirname, '../../agents'),
  label: 'agent',
  extension: '.md',
  validate(content) {
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) return ['Missing frontmatter'];

    const errors = [];
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    return errors.length > 0 ? errors : null;
  }
});
