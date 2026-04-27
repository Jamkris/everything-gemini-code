#!/usr/bin/env bash
# Sync GitHub labels from .github/labels.yml.
#
# Idempotent: re-running updates color/description on existing labels.
# Requires `gh` CLI and `python3` (used to parse the YAML).

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABELS_FILE="$ROOT/.github/labels.yml"

if [ ! -f "$LABELS_FILE" ]; then
  echo "Labels manifest not found at $LABELS_FILE" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not installed. See https://cli.github.com/" >&2
  exit 1
fi

# Parse YAML into TSV rows (name<TAB>color<TAB>description) via python.
python3 - "$LABELS_FILE" <<'PY' | while IFS=$'\t' read -r name color description; do
import sys, re

path = sys.argv[1]
with open(path, encoding='utf-8') as f:
    src = f.read()

entries = []
current = None
for line in src.splitlines():
    if line.startswith('#') or not line.strip():
        continue
    m = re.match(r'^- name:\s*(.+?)\s*$', line)
    if m:
        if current:
            entries.append(current)
        current = {'name': m.group(1), 'color': '', 'description': ''}
        continue
    m = re.match(r'^\s+color:\s*(.+?)\s*$', line)
    if m and current is not None:
        current['color'] = m.group(1)
        continue
    m = re.match(r'^\s+description:\s*(.+?)\s*$', line)
    if m and current is not None:
        current['description'] = m.group(1)
if current:
    entries.append(current)

for e in entries:
    print(f"{e['name']}\t{e['color']}\t{e['description']}")
PY
  echo "Syncing label: $name"
  gh label create "$name" --color "$color" --description "$description" --force >/dev/null
done

echo "Done."
