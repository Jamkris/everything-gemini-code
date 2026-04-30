#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const engine = require('./lib/grok-engine');

const REPO_ROOT = path.join(__dirname, '..');

function valueAfterEquals(arg) {
  return arg.slice(arg.indexOf('=') + 1);
}

function requireValue(flag, value) {
  if (typeof value !== 'string' || value.length === 0 || value.startsWith('-')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    scope: REPO_ROOT,
    format: 'text',
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (arg === '--format') {
      parsed.format = requireValue('--format', args[index + 1]).toLowerCase();
      index += 1;
      continue;
    }

    if (arg === '--scope') {
      parsed.scope = path.resolve(requireValue('--scope', args[index + 1]));
      index += 1;
      continue;
    }

    if (arg.startsWith('--format=')) {
      parsed.format = valueAfterEquals(arg).toLowerCase();
      continue;
    }

    if (arg.startsWith('--scope=')) {
      parsed.scope = path.resolve(valueAfterEquals(arg));
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    parsed.scope = path.resolve(arg);
  }

  if (!['text', 'json'].includes(parsed.format)) {
    throw new Error(`Invalid format: ${parsed.format}. Use text or json.`);
  }

  return parsed;
}

function ensureDirectory(scopePath) {
  let stat;
  try {
    stat = fs.statSync(scopePath);
  } catch (err) {
    throw new Error(`Scope path not found: ${scopePath} (${err.code || err.message})`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`Scope path is not a directory: ${scopePath}`);
  }
}

function printHelp() {
  const lines = [
    'Usage: node scripts/grok.js [scope] [--format text|json]',
    '',
    'Run a deterministic, full-repo audit and emit an architecture map,',
    'circular dependency report, and dead-file candidates.',
    '',
    'Arguments:',
    '  scope            Directory to analyze (default: repo root)',
    '  --scope <dir>    Same, as a flag',
    '  --format <fmt>   text (default) or json',
    '  --help, -h       Show this help',
  ];
  console.log(lines.join('\n'));
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  if (parsed.help) {
    printHelp();
    return;
  }

  try {
    ensureDirectory(parsed.scope);
    const report = engine.buildReport(parsed.scope);
    const output = parsed.format === 'json' ? engine.formatJson(report) : engine.formatText(report);
    console.log(output);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, ensureDirectory };
