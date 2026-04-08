# Token Optimization Guide

## Overview

Managing token consumption in Gemini CLI is important for both cost and performance.

## Model Selection

### Recommended Models

| Task | Model | Reason |
|------|-------|--------|
| Most coding tasks | `gemini-2.0-flash` | Fast, cost-effective |
| Complex architecture | `gemini-2.5-pro` | Deep reasoning |
| Simple queries | `gemini-2.0-flash-lite` | Minimal cost |

### Configuration

Set your default model in `~/.gemini/settings.json`:

```json
{
  "model": "gemini-2.0-flash"
}
```

Or per-session via environment variable:

```bash
export GEMINI_MODEL=gemini-2.5-pro
```

## Context Window Management

### MCP Server Optimization

Each active MCP server consumes context tokens. Best practices:

- Enable fewer than 10 MCP servers per project
- Disable unused servers in project settings
- Use project-specific MCP configurations in `mcp-configs/`

### Session Management

- Start fresh sessions for unrelated tasks
- Use `/checkpoint` to save state before context-intensive operations
- Use `/sessions` to review and resume past sessions

## Skill Loading Optimization

Skills are loaded on-demand when referenced. To optimize:

1. **Be specific**: Reference only the skills you need
2. **Use core skills**: `coding-standards`, `backend-patterns`, `tdd-workflow` cover most cases
3. **Defer niche skills**: Load language-specific skills only when working in that language

## Hook Runtime Controls

Control which hooks run to reduce overhead:

```bash
# Minimal hooks (fastest)
export ECC_HOOK_PROFILE=minimal

# Standard hooks (recommended)
export ECC_HOOK_PROFILE=standard

# Disable specific hooks
export ECC_DISABLED_HOOKS="hook-id-1,hook-id-2"
```

## Practical Tips

| Situation | Action |
|-----------|--------|
| Large codebase review | Use targeted agents (`@go-reviewer` not full review) |
| Repeated build fixes | Use language-specific resolver (`/go-build` vs generic) |
| Documentation updates | Use `/update-docs` instead of manual prompting |
| Architecture decisions | Use `@architect` with clear scope boundaries |

## Continuous Learning for Token Efficiency

The `/learn` command extracts patterns from your sessions into reusable skills, reducing the need to re-explain context in future sessions:

```bash
/learn          # Extract patterns from current session
/evolve         # Cluster instincts into efficient skills
```
