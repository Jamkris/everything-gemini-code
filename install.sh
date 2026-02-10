#!/bin/bash

# Gemini CLI Extension Installer
# Installs agents, skills, commands, and rules to ~/.gemini/

set -e

GEMINI_DIR="$HOME/.gemini"

echo "Installing Gemini CLI Extensions..."

# Ensure directories exist
mkdir -p "$GEMINI_DIR/agents"
mkdir -p "$GEMINI_DIR/commands"
mkdir -p "$GEMINI_DIR/skills"
mkdir -p "$GEMINI_DIR/rules"

# Copy agents
if [ -d "agents" ]; then
    echo "Copying agents..."
    cp agents/*.md "$GEMINI_DIR/agents/"
fi

# Copy commands
if [ -d "commands" ]; then
    echo "Copying commands..."
    cp commands/*.md "$GEMINI_DIR/commands/"
fi

# Copy skills
if [ -d "skills" ]; then
    echo "Copying skills..."
    cp -r skills/* "$GEMINI_DIR/skills/"
fi

# Copy rules
# Note: Rules are usually project-specific but we install common ones here
if [ -d "rules/common" ]; then
    echo "Copying common rules..."
    cp -r rules/common/* "$GEMINI_DIR/rules/"
fi

echo "Installation complete! 🚀"
echo "You can now use the installed extensions with Gemini CLI."
