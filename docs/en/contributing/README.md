# Contributing Guide

**Language:** **English** | [한국어](../../ko-KR/contributing/README.md)

Thank you for your interest in contributing to Everything Gemini Code!

## Related Documents

- [Command-Agent Map](COMMAND-AGENT-MAP.md) — Which agents are invoked by each command
- [Skill Placement Policy](SKILL-PLACEMENT-POLICY.md) — Where skills belong and how they are identified
- [Token Optimization](token-optimization.md) — Managing token consumption
- [Verification Guide](VERIFICATION_GUIDE.md) — Verifying extension installation
- [Terminology](TERMINOLOGY.md) — Core project terminology

---

## How to Contribute

### Adding a New Agent

1. Create a file at `agents/your-agent.md`.
2. Use the Gemini CLI frontmatter format:

```markdown
---
name: your-agent
description: Agent description. Specify when to use it.
tools: ["read_file", "run_shell_command"]
---

Agent content...
```

**Important:** Gemini CLI does not support the `model` field, and tool names use the Gemini format (e.g., `read_file`, `run_shell_command`).

### Adding a New Skill

1. Create a directory at `skills/your-skill-name/`.
2. Create a `SKILL.md` file inside:

```markdown
---
name: your-skill
description: Skill description
---

# Skill Title

Skill content...
```

### Adding a New Command

Gemini CLI commands use the `.toml` format:

1. Create a file at `commands/your-command.toml`:

```toml
description = "Command description"
prompt = '''
# Command Title

Command instructions...
'''
```

---

## Quality Standards

### Agent Checklist

- [ ] Clear `description` (including when to use it).
- [ ] Correct Gemini tool names used.
- [ ] No `model` field present.
- [ ] Includes actionable instructions.

### Skill Checklist

- [ ] Clear frontmatter in `SKILL.md`.
- [ ] Specific and actionable workflows.
- [ ] Includes examples where applicable.
- [ ] Under 800 lines.

### Command Checklist

- [ ] Uses `.toml` format.
- [ ] Clear `description`.
- [ ] Complete instructions in the `prompt` field.

---

## Submitting a PR

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes: `git commit -m "feat: add your-feature"`.
4. Push the branch: `git push origin feat/your-feature`.
5. Submit a Pull Request.

---

## Tool Name Conversion (Claude → Gemini)

If you are migrating agents from Claude Code:

| Claude Code | Gemini CLI |
|-------------|------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace_in_file` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_files` |
| `Glob` | `list_directory` |
| `WebSearch` | `google_web_search` |

Also, be sure to remove any `model: opus/sonnet` fields and change references from "Claude" to "Gemini".
