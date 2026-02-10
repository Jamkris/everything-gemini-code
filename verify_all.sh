#!/bin/bash
set -e

echo "🔍 Starting local verification..."

echo -e "\n📦 1. Checking dependencies..."
npm install --quiet

echo -e "\n🎨 2. Running Lint..."
npm run lint

echo -e "\n🔒 3. Running Security Audit..."
npm audit --audit-level=high

echo -e "\n✅ 4. Validating Components..."
echo "  - Agents..."
node scripts/ci/validate-agents.js
echo "  - Hooks..."
node scripts/ci/validate-hooks.js
echo "  - Commands..."
node scripts/ci/validate-commands.js
echo "  - Skills..."
node scripts/ci/validate-skills.js
echo "  - Rules..."
node scripts/ci/validate-rules.js

echo -e "\n🧪 5. Running Tests..."
npm test

echo -e "\n🎉 All verification checks passed!"
