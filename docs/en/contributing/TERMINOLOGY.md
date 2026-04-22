# Gemini CLI & Everything Gemini Code — Terminology

This document defines core terminology used throughout the project.

---

## Core Terms

### Agent

A specialized subagent that handles delegated tasks within a constrained scope. Invoked using the `@agent-name` syntax in Gemini CLI.

- **frontmatter**: Defined with `name`, `description`, and `tools` fields.
- **Tools**: Uses Gemini tools like `read_file`, `run_shell_command`, `write_file`, etc.
- **Location**: `agents/*.md` (in repo), `~/.gemini/agents/` (when installed).

### Skill

A collection of workflow definitions and domain knowledge. Referenced by agents or commands.

- **Curated Skills**: Located in `skills/<skill-name>/SKILL.md` (shipped in repo).
- **Learned Skills**: Located in `~/.gemini/skills/learned/` (not shipped).
- **Imported Skills**: Located in `~/.gemini/skills/imported/` (not shipped).

### Command

Slash commands for quick execution. Gemini CLI uses `.toml` format for commands.

```toml
description = "Command description"
prompt = '''
# Command Content
...
'''
```

- **Gemini CLI**: `.toml` files, located in `~/.gemini/commands/`.
- **Antigravity**: `.md` files, used as workflows.

### Hook

Triggers that execute automatically in response to tool events. Defined in `hooks/hooks.json`.

### Rule

Always-follow coding guidelines that the AI must adhere to. Located in `GEMINI.md` or `~/.gemini/rules/`.

---

## Tool Name Mapping

Gemini CLI and Claude Code use different tool names:

| Claude Code | Gemini CLI |
|-------------|------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_file_content` |
| `Glob` | `list_directory` |
| `WebSearch` | `google_web_search` |

---

## Installation Paths

| Component | Gemini CLI | Antigravity |
|-----------|-----------|------------|
| Agents | `~/.gemini/agents/` | `~/.gemini/antigravity/global_agents/` |
| Skills | `~/.gemini/skills/` | `~/.gemini/antigravity/global_skills/` |
| Commands | `~/.gemini/commands/` | (Used as workflows) |
| Rules | `~/.gemini/rules/` | `~/.gemini/antigravity/global_rules/` |

---

## Harness

The environment or platform running the AI agents:
- **Gemini CLI**: Terminal-based.
- **Antigravity**: IDE-integrated (e.g., VS Code, Cursor).

---

## Provenance

Origin information for learned or imported skills. Recorded in `.provenance.json`.

Required fields:
- `source`: Origin (URL, path, or identifier).
- `created_at`: ISO 8601 timestamp.
- `confidence`: 0–1 confidence score.
- `author`: Entity that produced the skill.
