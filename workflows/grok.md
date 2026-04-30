---
description: Full-repo audit using Gemini's 1M context — architecture, circular deps, dead files.
---

# Grok

Run a deterministic, full-repo audit using Gemini's 1M context window.
Produces:

- File inventory and language breakdown
- JS/TS module dependency graph (relative imports)
- Circular dependency detection (Tarjan SCC)
- Dead-file candidates (no incoming imports, not entry points)
- Synthesized architectural narrative + Top 3 actions

## Usage

`/egc-grok [scope] [--format text|json]`

- `scope` (optional): path to analyze (defaults to repo root)
- `--format`: `text` (default) or `json`

## Deterministic Engine

Always run:

```bash
node scripts/grok.js [scope] --format <text|json>
```

This script is the single source of truth for the inventory, graph,
cycles, and dead-file analysis. Do not re-derive these dimensions in
prose and do not invent file paths, counts, or cycles that the script
did not emit.

## Synthesis Contract

After running the script, produce a synthesis section ABOVE the raw
report:

1. **Architecture map** — 2-3 sentence narrative of the repo's
   structure, anchored in the script's directory and language stats.
2. **Hotspots** — concrete findings keyed to script output:
   - Each circular dependency (cite the files exactly)
   - Up to 10 dead-file candidates (cite paths exactly)
3. **Top 3 actions** — prioritized, each with: (a) what to do,
   (b) which files, (c) why this beats the alternatives.

## Rules

- Use script output verbatim for all file paths and counts.
- If `--format json` was requested, return the script JSON unchanged
  with no synthesis layer.
- If text was requested, prepend the synthesis above the raw report.
- Do not score or assign severity beyond what the script emits.
- Do not propose fixes that touch files outside the dead-file or
  cycle lists unless the user asks.
