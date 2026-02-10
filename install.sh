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
    # Antigravity paths (verified: ~/.gemini/antigravity/global_workflows)
    # Agents often go to a global agents dir or project specific, but let's try global if exists
    # If not, we put them in ~/.gemini/antigravity/agents assuming it supports it or user manually moves them
    
    mkdir -p "$ANTIGRAVITY_DIR/global_workflows"
    
    # Workflows go to global_workflows
    [ -d "workflows" ] && cp workflows/*.md "$ANTIGRAVITY_DIR/global_workflows/"
    
    # For agents/skills in Antigravity, the structure can vary. 
    # Current best practice is often project-level or explicit import.
    # However, let's copy to a shared location if Antigravity looks for it
    # We'll use the same structure as Gemini CLI for consistency in ~/.gemini root 
    # as Antigravity might fallback to looking there (it shares ~/.gemini root)
    
    # BUT, if user specifically asked for Antigravity, they might expect things in specific places.
    # The user only mentioned `global_workflows`.
    # Let's effectively replicate the workflow install to the specialized path.
    
    echo "Antigravity workflows installed to $ANTIGRAVITY_DIR/global_workflows"
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
