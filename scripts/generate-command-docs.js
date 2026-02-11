const fs = require('fs');
const path = require('path');

const cmdDir = path.resolve(__dirname, '../commands');
const files = fs.readdirSync(cmdDir).filter(f => f.endsWith('.toml'));

const commands = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(cmdDir, file), 'utf8');
  const name = file.replace('.toml', '');
  
  // Quick extract description via regex
  // description = "..."
  const descMatch = content.match(/^description\s*=\s*"([^"]*)"/m);
  let description = descMatch ? descMatch[1] : '';
  
  // Escape | for markdown table
  description = description.replace(/\|/g, '\\|');
  
  commands.push({ name, description });
}

// Sort by name
commands.sort((a, b) => a.name.localeCompare(b.name));

const header = `
# Gemini CLI Extension Commands

List of available commands provided by \`everything-gemini-code\`.

| Command | Description |
| ------- | ----------- |
`;

const rows = commands.map(cmd => `| \`/${cmd.name}\` | ${cmd.description} |`).join('\n');

const md = `${header.trim()}\n${rows}\n`;

fs.writeFileSync(path.join(__dirname, '../COMMANDS.md'), md);
console.log(`Generated COMMANDS.md with ${commands.length} commands.`);
