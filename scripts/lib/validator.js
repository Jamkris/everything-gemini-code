#!/usr/bin/env node
/**
 * Common validation framework for CI scripts
 *
 * Provides a reusable pattern for validating project components
 * (agents, commands, skills, hooks) with consistent error handling and reporting.
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract YAML frontmatter from markdown content
 * Handles BOM and CRLF line endings
 * @param {string} content - File content
 * @returns {object|null} Parsed frontmatter key-value pairs
 */
function extractFrontmatter(content) {
  const cleanContent = content.replace(/^\uFEFF/, '');
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

/**
 * Validate a directory of files
 * @param {object} config - Validation configuration
 * @param {string} config.dir - Directory to validate (absolute path)
 * @param {string} config.label - Human-readable label (e.g., "agent", "command")
 * @param {string} config.extension - File extension filter (e.g., ".md", ".toml")
 * @param {Function} config.validate - Validation function (content, filename) => string[]|null (returns error messages or null)
 */
function validateFiles(config) {
  const { dir, label, extension, validate } = config;

  if (!fs.existsSync(dir)) {
    console.log(`No ${label}s directory found, skipping validation`);
    process.exit(0);
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith(extension));
  let hasErrors = false;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const errors = validate(content, file);

    if (errors && errors.length > 0) {
      for (const err of errors) {
        console.error(`ERROR: ${file} - ${err}`);
      }
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${files.length} ${label} files`);
}

/**
 * Validate a directory of subdirectories
 * @param {object} config - Validation configuration
 * @param {string} config.dir - Parent directory (absolute path)
 * @param {string} config.label - Human-readable label (e.g., "skill")
 * @param {Function} config.validate - Validation function (dirPath, dirName) => string[]|null
 */
function validateDirs(config) {
  const { dir, label, validate } = config;

  if (!fs.existsSync(dir)) {
    console.log(`No ${label}s directory found, skipping validation`);
    process.exit(0);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
  let hasErrors = false;
  let validCount = 0;

  for (const dirName of dirs) {
    const dirPath = path.join(dir, dirName);
    const errors = validate(dirPath, dirName);

    if (errors && errors.length > 0) {
      for (const err of errors) {
        console.error(`ERROR: ${dirName}/ - ${err}`);
      }
      hasErrors = true;
    } else {
      validCount++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${validCount} ${label} directories`);
}

/**
 * Validate a single JSON file
 * @param {object} config - Validation configuration
 * @param {string} config.file - File path (absolute)
 * @param {string} config.label - Human-readable label
 * @param {Function} config.validate - Validation function (data) => { errors: string[], count: number }
 */
function validateJsonFile(config) {
  const { file, label, validate } = config;

  if (!fs.existsSync(file)) {
    console.log(`No ${label} found, skipping validation`);
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Invalid JSON in ${path.basename(file)}: ${e.message}`);
    process.exit(1);
  }

  const result = validate(data);

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.error(`ERROR: ${err}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${result.count} ${label}`);
}

module.exports = {
  extractFrontmatter,
  validateFiles,
  validateDirs,
  validateJsonFile
};
