# Scripts Reference

**Language:** **English** | [한국어](../../ko-KR/scripts/README.md)

This directory contains utility scripts for maintaining the Everything Gemini Code repository.

> **Note:**
> Many legacy installation scripts (`ecc.js`, `claw.js`, `install-plan.js`, etc.) from the previous Claude Code era have been completely removed. Gemini CLI handles environments, context, and installations natively through its Extension architecture (`gemini extensions`).

---

## Available Scripts

### Governance & Quality

| Script | Description |
|--------|-------------|
| `harness-audit.js` | Audits the repository against core Gemini CLI harness rules. Checks for the presence of required context optimization documents, eval coverage, required hooks, and security guards. <br><br> **Usage:** `node scripts/harness-audit.js --scope repo` |
| `release.sh` | Synchronizes version numbers in `package.json`, `gemini-extension.json`, and `.gemini-plugin/plugin.json`, creates a git commit, and generates a version tag. <br><br> **Usage:** `./scripts/release.sh <version>` |

### Documentation Generation

| Script | Description |
|--------|-------------|
| `generate-docs.js` | Scans the `skills/` directory and updates the main `README.md` to list available skills and commands automatically. <br><br> **Usage:** `node scripts/generate-docs.js` |
| `generate-command-docs.js` | Scans `.toml` files in the `commands/` directory and creates or updates a Markdown reference index. <br><br> **Usage:** `node scripts/generate-command-docs.js` |

### Migrations & Formatting

| Script | Description |
|--------|-------------|
| `migrate-commands.js` | A migration tool to assist converting legacy `.md` commands into `.toml` commands required by Gemini CLI. <br><br> **Usage:** `node scripts/migrate-commands.js <source-dir> <dest-dir>` |
| `setup-package-manager.js` | Ensures that the correct package manager (e.g., `npm`) and engines are used for the repository to maintain lockfile stability. <br><br> **Usage:** `node scripts/setup-package-manager.js` |
| `skill-create-output.js` | Validates and formats LLM outputs when auto-generating new `SKILL.md` contents from git diffs. |

---

## Contributing a Script

If you add a new script to this directory:
1. Ensure it does not attempt to duplicate Gemini CLI features (like replacing file states or creating custom REPLs).
2. It must be a standalone Node.js script.
3. Update this `README.md` and the Korean counterpart `ko-KR/README.md` with its usage instructions.
