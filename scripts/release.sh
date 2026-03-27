#!/bin/bash

# ECC Release Helper Script
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.1.2

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.1.2"
    exit 1
fi

# Remove 'v' prefix if provided
VERSION="${VERSION#v}"

echo "Preparing release v$VERSION..."

# 1. Update package.json
echo "Updating package.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json

# 2. Update gemini-extension.json
echo "Updating gemini-extension.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" gemini-extension.json

# 3. Update .gemini-plugin/plugin.json
echo "Updating .gemini-plugin/plugin.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" .gemini-plugin/plugin.json

echo "Versions updated to $VERSION in all configuration files."

# 4. Git commit and tag
git add package.json gemini-extension.json .gemini-plugin/plugin.json

echo "Committing version bump..."
git commit -m "chore: bump version to $VERSION"

echo "Creating tag v$VERSION..."
git tag "v$VERSION"

echo "Done!"
echo "Next steps:"
echo "1. git push origin main"
echo "2. git push origin v$VERSION"
echo "3. Check GitHub Actions for the Release process."
