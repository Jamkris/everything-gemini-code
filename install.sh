#!/bin/bash

# Gemini CLI Extension Installer
# Installs agents, skills, commands, and rules to ~/.gemini/

set -e

# Define paths
GEMINI_CLI_DIR="$HOME/.gemini"
ANTIGRAVITY_DIR="$HOME/.gemini/antigravity"
REPO_URL="https://github.com/Jamkris/everything-gemini-code.git"
TEMP_DIR=""

# Parse arguments
INSTALL_TARGET=""
CLEANUP=true

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --cli) INSTALL_TARGET="cli" ;;
        --antigravity) INSTALL_TARGET="antigravity" ;;
        --all) INSTALL_TARGET="all" ;;
        --no-cleanup) CLEANUP=false ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Cleanup function
cleanup_temp() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup_temp EXIT

# Ensure we have the files (Clone if running remotely or missing)
if [ ! -d "agents" ] || [ ! -d "skills" ]; then
    echo "Files not found locally. Cloning repository to temporary directory..."
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR"
    cd "$TEMP_DIR"
fi

install_gemini_cli() {
    echo "Installing for Gemini CLI..."
    mkdir -p "$GEMINI_CLI_DIR/agents"
    mkdir -p "$GEMINI_CLI_DIR/commands"
    mkdir -p "$GEMINI_CLI_DIR/skills"
    mkdir -p "$GEMINI_CLI_DIR/rules"

    [ -d "agents" ] && cp agents/*.md "$GEMINI_CLI_DIR/agents/"
    
    # Gemini CLI uses TOML commands
    [ -d "commands" ] && cp commands/*.toml "$GEMINI_CLI_DIR/commands/"
    
    [ -d "skills" ] && cp -r skills/* "$GEMINI_CLI_DIR/skills/"
    
    # Copy hook scripts
    mkdir -p "$GEMINI_CLI_DIR/scripts"
    [ -d "scripts" ] && cp -r scripts/* "$GEMINI_CLI_DIR/scripts/"
    
    # Rules are now handled via GEMINI.md generation
    echo "Gemini CLI installation complete."
}

install_antigravity() {
    echo "Installing for Antigravity (VS Code / Cursor)..."
    
    # Cleanup existing directories if requested
    if [ "$CLEANUP" = true ]; then
        echo "Cleaning up existing Antigravity configurations..."
        rm -rf "$ANTIGRAVITY_DIR/global_workflows"
        rm -rf "$ANTIGRAVITY_DIR/global_agents"
        rm -rf "$ANTIGRAVITY_DIR/global_skills"
        # global_rules is deprecated, removing it
        rm -rf "$ANTIGRAVITY_DIR/global_rules"
    fi

    # Antigravity paths
    mkdir -p "$ANTIGRAVITY_DIR/global_workflows"
    mkdir -p "$ANTIGRAVITY_DIR/global_agents"
    mkdir -p "$ANTIGRAVITY_DIR/global_skills"
    
    # Workflows -> global_workflows
    [ -d "workflows" ] && cp workflows/*.md "$ANTIGRAVITY_DIR/global_workflows/"
    
    # Agents -> global_agents
    [ -d "agents" ] && cp agents/*.md "$ANTIGRAVITY_DIR/global_agents/"

    # Skills -> global_skills
    [ -d "skills" ] && cp -r skills/* "$ANTIGRAVITY_DIR/global_skills/"

    echo "Antigravity components installed/updated to $ANTIGRAVITY_DIR/global_*"
}

generate_gemini_md() {
    echo "Generating ~/.gemini/GEMINI.md (Global Context)..."
    TEMPLATE_DIR="templates"
    TARGET_FILE="$HOME/.gemini/GEMINI.md"
    
    # Ensure templates exist locally (we might need to fetch them if remote install)
    if [ ! -d "$TEMPLATE_DIR" ]; then
         # Usually redundant if we adhere to the main logic, but safety first
         echo "Templates not found. Skipping GEMINI.md generation."
         return
    fi
    
    # Ask for language preference if interactive
    LANG_CHOICE=""
    if [ -z "$INSTALL_TARGET" ]; then # Only ask in interactive mode
        echo "Select primary language for Global Rules:"
        echo "1) TypeScript/JavaScript"
        echo "2) Python"
        echo "3) Go"
        echo "4) None (General only)"
        read -p "Enter choice [1-4]: " lchoice
        case $lchoice in
            1) LANG_CHOICE="ts" ;;
            2) LANG_CHOICE="python" ;;
            3) LANG_CHOICE="go" ;;
            *) LANG_CHOICE="none" ;;
        esac
    else
        # Default to None or strictly General in non-interactive (unless extended later)
        LANG_CHOICE="none"
    fi

    echo "Creating GEMINI.md..."
    cat "$TEMPLATE_DIR/GEMINI_GLOBAL.md" > "$TARGET_FILE"
    
    if [ "$LANG_CHOICE" == "ts" ]; then
        cat "$TEMPLATE_DIR/GEMINI_TS.md" >> "$TARGET_FILE"
        echo "Added TypeScript rules."
    elif [ "$LANG_CHOICE" == "python" ]; then
        cat "$TEMPLATE_DIR/GEMINI_PYTHON.md" >> "$TARGET_FILE"
        echo "Added Python rules."
    elif [ "$LANG_CHOICE" == "go" ]; then
        cat "$TEMPLATE_DIR/GEMINI_GO.md" >> "$TARGET_FILE"
        echo "Added Go rules."
    fi
    
    echo "Generated $TARGET_FILE"
}

# Interactive mode if no target specified
if [ -z "$INSTALL_TARGET" ]; then
    echo "Select installation target:"
    echo "1) Gemini CLI (Standard)"
    echo "2) Antigravity (VS Code / Cursor)"
    echo "3) Both"
    read -p "Enter choice [1-3]: " choice
    case $choice in
        1) INSTALL_TARGET="cli" ;;
        2) INSTALL_TARGET="antigravity" ;;
        3) INSTALL_TARGET="all" ;;
        *) echo "Invalid choice. Exiting."; exit 1 ;;
    esac
fi

# Execute installation
case $INSTALL_TARGET in
    cli)
        install_gemini_cli
        generate_gemini_md
        ;;
    antigravity)
        install_antigravity
        generate_gemini_md # Antigravity users also benefit from GEMINI.md context
        ;;
    all)
        install_gemini_cli
        install_antigravity
        generate_gemini_md
        ;;
esac

echo "Installation process finished! 🚀"
