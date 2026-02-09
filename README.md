**Language:** **English** | [한국어](README.ko.md) | [简体中文](README.zh-CN.md)

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**A complete collection of Gemini CLI configurations for productivity.**

Production-ready agents, skills, hooks, commands, rules, and MCP configurations for building real products.

---

## 🚀 Quick Start

Get up and running in under 2 minutes:

### Step 1: Install the Plugin (Recommended)

```bash
# Add marketplace
/plugin marketplace add Jamkris/everything-gemini-code

# Install plugin
/plugin install everything-gemini-code@everything-gemini-code
```

### Step 2: Install Rules (Required)

> ⚠️ **Important:** Gemini CLI plugins cannot distribute `rules` automatically. Install them manually:

```bash
# Clone the repo first
git clone https://github.com/Jamkris/everything-gemini-code.git

# Install common rules (required)
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/

# Install language-specific rules (pick your stack)
cp -r everything-gemini-code/rules/typescript/* ~/.gemini/rules/
cp -r everything-gemini-code/rules/python/* ~/.gemini/rules/
cp -r everything-gemini-code/rules/golang/* ~/.gemini/rules/
```

### Step 3: Start Using

```bash
# Try a command
/plan "Add user authentication"

# Check available commands
/plugin list everything-gemini-code@everything-gemini-code
```

---

## 📦 What's Inside

This repo is a **Gemini CLI extension** - install it directly or copy components manually.

```
everything-gemini-code/
├── gemini-extension.json  # Extension manifest
├── agents/                # Specialized subagents for delegation
│   ├── planner.md         # Feature implementation planning
│   ├── architect.md       # System design decisions
│   ├── code-reviewer.md   # Quality and security review
│   ├── security-reviewer.md
│   ├── build-error-resolver.md
│   ├── e2e-runner.md      # Playwright E2E testing
│   └── ...
├── skills/                # Workflow definitions and domain knowledge
│   ├── coding-standards/  # Language best practices
│   ├── backend-patterns/  # API, database, caching patterns
│   ├── tdd-workflow/      # TDD methodology
│   └── ...
├── commands/              # Slash commands (/plan, /tdd, /code-review, etc.)
├── rules/                 # Always-follow guidelines
│   ├── common/            # Language-agnostic principles
│   ├── typescript/        # TypeScript specific
│   ├── python/            # Python specific
│   └── golang/            # Go specific
├── hooks/                 # Trigger-based automations (hooks.json)
└── mcp-configs/           # MCP server configurations (GitHub, Supabase, etc.)
```

---

## 🎯 Key Concepts

### Agents

Subagents handle delegated tasks with limited scope. Example: `code-reviewer`, `security-reviewer`.

### Skills

Workflow definitions invoked by commands or agents. Example: `TDD Workflow`, `Security Review`.

### Hooks

Fire on tool events. Example: Warn about `console.log` usage.

### Rules

Always-follow guidelines, organized into `common/` (language-agnostic) + language-specific directories.

---

## 🔧 Manual Installation

If you prefer manual control:

```bash
# Clone the repo
git clone https://github.com/Jamkris/everything-gemini-code.git

# Copy agents
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# Copy rules
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/

# Copy commands
cp everything-gemini-code/commands/*.md ~/.gemini/commands/

# Copy skills
cp -r everything-gemini-code/skills/* ~/.gemini/skills/
```

---

## 🤝 Contributing

**Contributions are welcome and encouraged.**

If you have useful agents, skills, hooks, or MCP configurations, please contribute! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT - Use freely, modify as needed, contribute back if you can.

---

**Star this repo if it helps. Build something great.**
