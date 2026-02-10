#!/bin/bash

# Gemini CLI Extension Installer
# Installs agents, skills, commands, and rules to ~/.gemini/

set -e

# Define paths
GEMINI_CLI_DIR="$HOME/.gemini"
ANTIGRAVITY_DIR="$HOME/.gemini/antigravity"

echo "Select installation target:"
echo "1) Gemini CLI (Standard)"
echo "2) Antigravity (VS Code / Cursor)"
echo "3) Both"
read -p "Enter choice [1-3]: " choice

install_gemini_cli() {
    echo "Installing for Gemini CLI..."
    mkdir -p "$GEMINI_CLI_DIR/agents"
    mkdir -p "$GEMINI_CLI_DIR/workflows"
    mkdir -p "$GEMINI_CLI_DIR/skills"
    mkdir -p "$GEMINI_CLI_DIR/rules"

    [ -d "agents" ] && cp agents/*.md "$GEMINI_CLI_DIR/agents/"
    [ -d "workflows" ] && cp workflows/*.md "$GEMINI_CLI_DIR/workflows/"
    [ -d "skills" ] && cp -r skills/* "$GEMINI_CLI_DIR/skills/"
    [ -d "rules/common" ] && cp -r rules/common/* "$GEMINI_CLI_DIR/rules/"
    echo "Gemini CLI installation complete."
}

install_antigravity() {
    echo "Installing for Antigravity..."
    # Antigravity paths
    # We follow the convention: ~/.gemini/antigravity/global_{component}
    
    mkdir -p "$ANTIGRAVITY_DIR/global_workflows"
    mkdir -p "$ANTIGRAVITY_DIR/global_agents"
    mkdir -p "$ANTIGRAVITY_DIR/global_skills"
    mkdir -p "$ANTIGRAVITY_DIR/global_rules"
    
    # Workflows -> global_workflows
    [ -d "workflows" ] && cp workflows/*.md "$ANTIGRAVITY_DIR/global_workflows/"
    
    # Agents -> global_agents
    [ -d "agents" ] && cp agents/*.md "$ANTIGRAVITY_DIR/global_agents/"

    # Skills -> global_skills
    [ -d "skills" ] && cp -r skills/* "$ANTIGRAVITY_DIR/global_skills/"

    # Rules -> global_rules
    [ -d "rules/common" ] && cp -r rules/common/* "$ANTIGRAVITY_DIR/global_rules/"
    
    echo "Antigravity components installed to $ANTIGRAVITY_DIR/global_*"
}

case $choice in
    1)
        install_gemini_cli
        ;;
    2)
        install_antigravity
        ;;
    3)
        install_gemini_cli
        install_antigravity
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "Installation process finished! 🚀"
