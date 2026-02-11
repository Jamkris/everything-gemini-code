const fs = require('fs');
const path = require('path');

// Determine paths relative to this script
const scriptDir = __dirname;
const projectRoot = path.resolve(scriptDir, '../..');
const srcDir = path.join(projectRoot, 'claude', 'commands');
const destDir = path.join(projectRoot, 'gemini', 'commands');

console.log(`Migration Source: ${srcDir}`);
console.log(`Migration Target: ${destDir}`);

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Read all .md files
try {
  const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.md'));
  console.log(`Found ${files.length} commands to migrate.`);

  let count = 0;
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destFile = file.replace('.md', '.toml');
    const destPath = path.join(destDir, destFile);

    const content = fs.readFileSync(srcPath, 'utf8');
    
    // Extract description from frontmatter
    // Format:
    // ---
    // description: ...
    // ---
    let description = '';
    let promptContent = content;

    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const descMatch = frontmatter.match(/^description:\s*(.*)$/m);
      if (descMatch) {
        description = descMatch[1].trim();
      }
      // Remove frontmatter from content to get the prompt
      promptContent = content.substring(frontmatterMatch[0].length).trim();
    } else {
      // Fallback: try to find description in first lines if no frontmatter
      const lines = content.split('\n');
      if (lines.length > 0 && lines[0].startsWith('description:')) {
        description = lines[0].replace('description:', '').trim();
        promptContent = lines.slice(1).join('\n').trim();
      }
    }

    // Escape logical triple quotes in content if any
    // (TOML multiline string uses """, so we need to escape it)
    // Actually TOML spec says basic strings can contain " if not 3 in a row.
    // If prompt contains """, we should assume it might break.
    // But typically markdown code blocks use ```, so """ is rare.
    // We'll escape """ as \""" just in case, or use literal string '''?
    // Gemini CLI supports TOML. Let's stick to """ and hope for best.
    // If content has """, we might need to escape one quote.
    const safePrompt = promptContent.replace(/"""/g, '\\"\\"\\"');

    // Create TOML content
    const tomlContent = `description = "${description.replace(/"/g, '\\"')}"
prompt = """
${safePrompt}
"""
`;

    fs.writeFileSync(destPath, tomlContent);
    console.log(`Migrated: ${file} -> ${destFile}`);
    count++;
  }

  console.log(`\nMigration complete. ${count} commands migrated.`);
  console.log(`Run 'node scripts/hooks/session-start.js' or restart session to generate shims.`);

} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}
