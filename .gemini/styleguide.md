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

- Must have YAML frontmatter with `tools` field.
- Tool names must use Gemini format: `read_file`, `run_shell_command`, `write_file`.
- No `model` field (Gemini CLI does not support it).

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
