**Language:** **English** | [한국어](README.ko.md) | [简体中文](README.zh-CN.md)

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**A comprehensive configuration suite for Gemini CLI / Antigravity.**

This extension provides production-ready agents, skills, hooks, commands, rules, and MCP configurations designed to supercharge your development workflow with Gemini.

---

## 🚀 Quick Start

Get up and running in under 2 minutes:

### Option 1: Install via Gemini CLI (Recommended)

```bash
# Install directly from GitHub
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

### Option 2: Manual Installation (Advanced)

If you prefer manual control or need to customize specific components:

```bash
# Clone the repository
git clone https://github.com/Jamkris/everything-gemini-code.git

# Copy agents
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# Copy commands
cp everything-gemini-code/commands/*.md ~/.gemini/commands/

# Copy skills
cp -r everything-gemini-code/skills/* ~/.gemini/skills/

# Install rules (Required for both installation methods)
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/
```

> ⚠️ **Note:** Rules must be installed manually to `~/.gemini/rules/` as they are not automatically distributed by extensions.

---

## 💻 Usage

Once installed, you can access the new capabilities directly in Gemini CLI.

### Slash Commands

Use custom commands to automate workflows:

```bash
# Plan a feature implementation
/plan "Add user authentication with JWT"

# Start Test-Driven Development workflow
/tdd "Create a user service"

# Run a code review
/code-review
```

### Agents

Delegate complex tasks to specialized agents:

```bash
# Use the architect agent for system design
@architect "Design a microservices architecture for..."

# Use the security reviewer for vulnerability checks
@security-reviewer "Audit this file for injection flaws"
```

### Skills

Gemini will automatically utilize installed skills when relevant to your request, such as "TDD Workflow" or "Backend Patterns".

---

## 📦 What's Inside

This extension packs a complete development environment config:

```
everything-gemini-code/
├── gemini-extension.json  # Extension manifest
├── agents/                # Specialized subagents (@planner, @architect, etc.)
├── skills/                # Workflow definitions (TDD, Patterns, etc.)
├── commands/              # Slash commands (/plan, /tdd, etc.)
├── rules/                 # Coding guidelines (TypeScript, Python, Go)
├── hooks/                 # Automation triggers (hooks.json)
└── mcp-configs/           # MCP server configurations
```

---

## 🤝 Contributing

**Contributions are welcome!**

If you have useful agents, skills, or configurations, please submit a Pull Request.

---

## 📄 License

MIT - Use freely, modify as needed.
