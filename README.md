**Language:** **English** | [한국어](README.ko.md) | [简体中文](README.zh-CN.md)

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**A comprehensive configuration suite for Gemini CLI / Antigravity.**

This extension provides production-ready agents, skills, hooks, commands, rules, and MCP configurations designed to supercharge your development workflow with Gemini.

---

## 🚀 Quick Start

npm install -g @google/gemini-cli@latest

````

### Authentication (Required)

The Gemini CLI requires an API key to function.

1.  Get your API key from [Google AI Studio](https://aistudio.google.com/).
2.  Set it as an environment variable:

```bash
export GEMINI_API_KEY="your_api_key_here"
````

Or configure it using the CLI (if supported by your version):

```bash
gemini config set apiKey "your_api_key_here"
```

### Option 1: Install via Gemini CLI (Recommended)

The easiest way to install. This will automatically set up the extension for Gemini CLI.

```bash
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

### Option 2: Install via Script (For Antigravity & Advanced Users)

Recommended if you use **Antigravity** (VS Code / Cursor) or need to customize the installation. Existing configurations will be updated.

```bash
# Install for Antigravity (Recommended)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/install.sh)" -- --antigravity

# Install All (CLI + Antigravity)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/install.sh)" -- --all
```

### Option 1: Uninstallation (Recommended)

```bash
gemini extensions uninstall https://github.com/Jamkris/everything-gemini-code
```

### Option 2: Uninstallation (Manual Script)

```bash
# Selective Uninstall (Recommended): Removes only files installed by this extension.
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/uninstall.sh)" -- --antigravity

# Full Uninstall (Caution): Deletes ALL files in the target directories.
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/uninstall.sh)" -- --antigravity --purge
```

### Option 2: Manual Installation (Advanced)

If you prefer manual control or need to customize specific components:

```bash
# Clone the repository
git clone https://github.com/Jamkris/everything-gemini-code.git

# Copy agents
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# Copy commands (Gemini CLI)
cp everything-gemini-code/commands/*.toml ~/.gemini/commands/

# Copy workflows (Antigravity)
# Note: For Antigravity, use ~/.gemini/antigravity/global_workflows/
cp everything-gemini-code/workflows/*.md ~/.gemini/antigravity/global_workflows/

# Copy skills
cp -r everything-gemini-code/skills/* ~/.gemini/skills/

# Install rules (Required for both installation methods)
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/
```

> **For Antigravity Users:**
> If you are manually installing for Antigravity, copying to `~/.gemini/antigravity/` subdirectories (`global_agents`, `global_skills`, `global_rules`) is recommended for full compatibility. The `install.sh` script handles this automatically.

````

### Option 3: Install as Gemini CLI Extension (Developer Mode)

You can link this repository directly to Gemini CLI as an extension. This allows you to develop and test changes in real-time.

```bash
# Clone the repository
git clone https://github.com/Jamkris/everything-gemini-code.git
cd everything-gemini-code

# Link the extension
gemini extensions link .
````

> ⚠️ **Note:** Rules still need to be installed manually to `~/.gemini/rules/` or `~/.gemini/antigravity/global_rules/` as extensions do not automatically distribute them.

---

## 💻 Usage

Once installed, you can access the new capabilities directly in Gemini CLI.

### Slash Commands

Use custom commands to automate workflows (see [Full Command List](COMMANDS.md)):

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
├── commands/              # Gemini CLI commands (.toml)
├── workflows/             # Antigravity workflows (.md)
├── rules/                 # Coding guidelines (TypeScript, Python, Go)
├── hooks/                 # Automation triggers (hooks.json)
└── mcp-configs/           # MCP server configurations
```

---

## ⚠️ Troubleshooting

If you see "Skill conflict detected" warnings, it means you have previously installed skills manually. You can safely remove the local versions to use the extension's managed skills:

```bash
# Remove manually installed skills and commands to avoid conflicts
rm -rf ~/.gemini/skills/* ~/.gemini/commands/*
```

## 🤝 Contributing

**Contributions are welcome!**

If you have useful agents, skills, or configurations, please submit a Pull Request.

---

## 📄 License

MIT - Use freely, modify as needed.
