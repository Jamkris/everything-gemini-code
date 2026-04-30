#!/usr/bin/env node

const path = require('path');
const engine = require('./lib/grok-engine');

const REPO_ROOT = path.join(__dirname, '..');

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
      parsed.format = (args[index + 1] || '').toLowerCase();
      index += 1;
      continue;
    }

    if (arg === '--scope') {
      parsed.scope = path.resolve(args[index + 1] || REPO_ROOT);
      index += 1;
      continue;
    }

    if (arg.startsWith('--format=')) {
      parsed.format = arg.split('=')[1].toLowerCase();
      continue;
    }

    if (arg.startsWith('--scope=')) {
      parsed.scope = path.resolve(arg.split('=')[1]);
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

  const report = engine.buildReport(parsed.scope);
  const output = parsed.format === 'json' ? engine.formatJson(report) : engine.formatText(report);
  console.log(output);
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs };
