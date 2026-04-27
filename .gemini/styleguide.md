# Code Review Style Guide

## Project Context

This is a **Gemini CLI extension** (`everything-gemini-code`) — not a typical application.
The codebase consists of:

- **Shell scripts** (`scripts/`) — Node.js utilities and bash installers
- **TOML commands** (`commands/`) — Gemini CLI slash commands
- **Markdown skills** (`skills/`) — AI workflow definitions (SKILL.md)
- **Markdown agents** (`agents/`) — Subagent definitions with frontmatter
- **Markdown docs** (`docs/`) — Multilingual documentation (en, ko-KR, zh-CN)
- **JSON hooks** (`hooks/`) — Gemini CLI automation triggers

## JavaScript / Node.js

- Target Node.js 20+. Use CommonJS (`require`), not ESM.
- No `console.log` in hook scripts — hooks must run silently on success.
- Use `process.exit(0)` on hook errors to avoid blocking the CLI.
- Prefer `const` over `let`. Never use `var`.
- Functions should be under 50 lines. Files should be under 400 lines.
- Use `assert` module for tests (custom test runner, not Jest/Mocha).

## Shell Scripts

- Use `set -e` at the top of all bash scripts.
- Quote all variables: `"$VAR"` not `$VAR`.
- Check file/directory existence before operations.
- Support both macOS and Linux (no GNU-only flags).

## TOML Commands

- Every command must have a non-empty `description` field.
- The `prompt` field should include usage examples and related commands.
- Agent references use `@agent-name` format.

## Markdown Skills (SKILL.md)

- Must start with YAML frontmatter (`---` block) containing `name` and `description`.
- Must have a `## When to Use` section (not "When to Activate" or "When to Apply").
- Keep under 800 lines.

## Markdown Agents

- Must have YAML frontmatter with `name`, `description`, and `tools` fields.
- `tools` entries must be valid Gemini CLI built-ins only: `read_file`,
  `read_many_files`, `write_file`, `replace`, `glob`, `search_file_content`,
  `list_directory`, `run_shell_command`, `save_memory`, `web_fetch`,
  `google_web_search`.
- Do NOT include MCP tools (e.g. `mcp__slack__...`, `mcp__context7__...`) in
  the `tools` array — Gemini CLI rejects them at load time. MCP tools are
  auto-discovered from the configured MCP server at runtime.
- Do NOT include Claude-style names (`search_files`, `replace_in_file`,
  `Read`, `Edit`) — those are not valid in Gemini CLI.
- No `model` or `color` field (Gemini CLI schema does not support them).
- The authoritative allowlist lives in `scripts/lib/gemini-tools.js` and is
  enforced by `scripts/ci/validate-agents.js` (run on every PR). Update the
  lib first if the Gemini CLI tool surface changes; this file is the
  human-facing mirror.

## Documentation

- Main README.md (English) stays at root. All other docs live under `docs/{lang}/`.
- Every doc file must have a language switcher line at the top.
- Supported languages: English (`docs/en/`), Korean (`docs/ko-KR/`), Chinese (`docs/zh-CN/`).
- Internal links must use relative paths. No absolute GitHub URLs for internal docs.

## Testing

- Tests use a custom runner (`tests/run-all.js`). Output must include `Passed: N` and `Failed: N`.
- New library modules in `scripts/lib/` must have corresponding test files in `tests/lib/`.
- Hook integration tests live in `tests/hooks/`.

## CI / GitHub Actions

- Pin third-party actions to commit SHA (e.g., `uses: action@<sha> # v2`).
- First-party GitHub actions (`actions/*`) can use version tags (`@v4`).
- Reusable workflows in `.github/workflows/reusable-*.yml` must be called by `ci.yml`.

## What NOT to Flag

- Emoji usage in markdown docs is intentional — do not flag.
- Long TOML `prompt` fields are expected — do not flag line length.
- Skills referencing `~/.gemini/` paths are correct — do not suggest `~/.claude/`.
