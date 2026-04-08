#!/usr/bin/env node
/**
 * Validate skill directories have SKILL.md with required structure
 */

const fs = require('fs');
const path = require('path');
const { validateDirs } = require('../lib/validator');

validateDirs({
  dir: path.join(__dirname, '../../skills'),
  label: 'skill',
  validate(dirPath) {
    const skillMd = path.join(dirPath, 'SKILL.md');
    if (!fs.existsSync(skillMd)) return ['Missing SKILL.md'];

    const content = fs.readFileSync(skillMd, 'utf-8');
    if (content.trim().length === 0) return ['SKILL.md is empty'];
    return null;
  }
});
