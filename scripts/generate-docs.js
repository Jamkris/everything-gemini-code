const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '../../gemini/commands');
const DOCS_DIR = path.join(__dirname, '../docs/commands');

if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const CATEGORIES = {
    'Core': ['plan', 'tdd', 'code-review', 'build-fix', 'refactor-clean', 'e2e'],
    'Multi-Agent': ['multi-plan', 'multi-execute', 'multi-backend', 'multi-frontend', 'multi-workflow', 'orchestrate', 'pm2'],
    'Language-Specific': ['go-build', 'go-review', 'go-test', 'python-review'],
    'Learning & Evolution': ['learn', 'skill-create', 'evolve', 'instinct-import', 'instinct-export', 'instinct-status'],
    'Utilities': ['setup-pm', 'update-docs', 'update-codemaps', 'verify', 'checkpoint', 'eval', 'sessions']
};

const COMMAND_DESCRIPTIONS = {};

function extractDescription(content) {
    // Try to find description in frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        const descMatch = frontmatterMatch[1].match(/description:\s*(.*)/);
        if (descMatch) return descMatch[1].trim();
    }
    
    // Fallback: finding first paragraph after header
    const body = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
    const lines = body.split('\n');
    for (let line of lines) {
        if (line.trim().length > 0 && !line.startsWith('#')) {
            return line.trim();
        }
    }
    return "No description available.";
}

function generateDocs() {
    const files = fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.md'));
    
    // Map commands to descriptions
    files.forEach(file => {
        const name = path.basename(file, '.md');
        const content = fs.readFileSync(path.join(COMMANDS_DIR, file), 'utf8');
        COMMAND_DESCRIPTIONS[name] = extractDescription(content);
    });

    // Generate Category Files
    for (const [category, commands] of Object.entries(CATEGORIES)) {
        let content = `# ${category} Commands\n\n`;
        
        commands.forEach(cmd => {
            const desc = COMMAND_DESCRIPTIONS[cmd] || "No description available.";
            content += `## /${cmd}\n\n${desc}\n\n[Source Definition](../../gemini/commands/${cmd}.md)\n\n---\n\n`;
        });
        
        const filename = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') + '.md';
        fs.writeFileSync(path.join(DOCS_DIR, filename), content);
        console.log(`Generated ${filename}`);
    }

    // Generate README.md Index
    let indexContent = `# Command Reference\n\nOverview of all available Gemini CLI commands.\n\n`;
    for (const category of Object.keys(CATEGORIES)) {
        const filename = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') + '.md';
        indexContent += `- [${category}](${filename})\n`;
    }
    fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), indexContent);
    console.log('Generated index README.md');
}

generateDocs();
