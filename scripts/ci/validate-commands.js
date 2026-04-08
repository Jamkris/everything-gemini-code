#!/usr/bin/env node
/**
 * Validate command files are non-empty and readable
 */

const path = require('path');
const { validateFiles } = require('../lib/validator');

validateFiles({
  dir: path.join(__dirname, '../../commands'),
  label: 'command',
  extension: '.toml',
  validate(content) {
    if (content.trim().length === 0) return ['Empty command file'];
    return null;
  }
});
