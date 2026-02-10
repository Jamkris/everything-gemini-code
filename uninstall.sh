#!/bin/bash
set -e

# Define paths
GEMINI_CLI_DIR="$HOME/.gemini"
ANTIGRAVITY_DIR="$HOME/.gemini/antigravity"
REPO_URL="https://github.com/Jamkris/everything-gemini-code.git"
TEMP_DIR=""

# Cleanup function for temp directory
cleanup_temp() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup_temp EXIT

# Parse arguments
TARGET_ANTIGRAVITY=false
TARGET_CLI=false
PURGE=false
SHOW_HELP=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --antigravity) TARGET_ANTIGRAVITY=true ;;
        --cli) TARGET_CLI=true ;;
        --all) TARGET_ANTIGRAVITY=true; TARGET_CLI=true ;;
        --purge) PURGE=true ;;
        --help) SHOW_HELP=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

if [ "$SHOW_HELP" = true ] || ([ "$TARGET_ANTIGRAVITY" = false ] && [ "$TARGET_CLI" = false ]); then
    echo "Gemini Extension Uninstaller"
    echo "Usage: ./uninstall.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --antigravity   Uninstall Antigravity components (VS Code/Cursor)"
    echo "  --cli           Uninstall Gemini CLI components"
    echo "  --all           Uninstall both"
    echo "  --purge         Delete ALL files in target directories (Default: delete only installed files)"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  curl ... | bash -s -- --antigravity          (Remove only extension files)"
    echo "  curl ... | bash -s -- --antigravity --purge  (Remove everything in global folders)"
    exit 0
fi

# Function to remove files matching the repository content
remove_matching_files() {
    local src_dir="$1"
    local dest_dir="$2"
    
    if [ -d "$src_dir" ]; then
        echo "Scanning $src_dir for files to remove from $dest_dir..."
        find "$src_dir" -type f | while read -r file; do
            # Get relative path from source dir
            rel_path="${file#$src_dir/}"
            target_file="$dest_dir/$rel_path"
            
            if [ -f "$target_file" ]; then
                echo "Removing $target_file"
                rm "$target_file"
            fi
        done
        
        # Cleanup empty directories
        find "$dest_dir" -type d -empty -delete 2>/dev/null || true
    fi
}

# If not purging, we need the repo to know what files to delete
if [ "$PURGE" = false ]; then
    echo "Running selective uninstall (removing only installed components)..."
    echo "Cloning repository to index files..."
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR"
    cd "$TEMP_DIR"
fi

# Uninstall Antigravity
if [ "$TARGET_ANTIGRAVITY" = true ]; then
    echo "Uninstalling Antigravity components..."
    if [ "$PURGE" = true ]; then
        echo "Purging global configuration directories..."
        rm -rf "$ANTIGRAVITY_DIR/global_workflows"
        rm -rf "$ANTIGRAVITY_DIR/global_agents"
        rm -rf "$ANTIGRAVITY_DIR/global_skills"
        rm -rf "$ANTIGRAVITY_DIR/global_rules"
    else
        echo "Removing matching files..."
        remove_matching_files "workflows" "$ANTIGRAVITY_DIR/global_workflows"
        remove_matching_files "agents" "$ANTIGRAVITY_DIR/global_agents"
        remove_matching_files "skills" "$ANTIGRAVITY_DIR/global_skills"
        remove_matching_files "rules/common" "$ANTIGRAVITY_DIR/global_rules"
    fi
    echo "Antigravity uninstallation complete."
fi

# Uninstall CLI
if [ "$TARGET_CLI" = true ]; then
    echo "Uninstalling Gemini CLI components..."
    if [ "$PURGE" = true ]; then
        echo "Purging CLI directories..."
        rm -rf "$GEMINI_CLI_DIR/agents"
        rm -rf "$GEMINI_CLI_DIR/commands"
        rm -rf "$GEMINI_CLI_DIR/skills"
        rm -rf "$GEMINI_CLI_DIR/scripts"
        rm -rf "$GEMINI_CLI_DIR/rules"
        rm -rf "$GEMINI_CLI_DIR/rules"
    else
        echo "Removing matching files..."
        remove_matching_files "agents" "$GEMINI_CLI_DIR/agents"
        remove_matching_files "commands" "$GEMINI_CLI_DIR/commands"
        remove_matching_files "skills" "$GEMINI_CLI_DIR/skills"
        remove_matching_files "scripts" "$GEMINI_CLI_DIR/scripts"
        remove_matching_files "rules/common" "$GEMINI_CLI_DIR/rules"
        remove_matching_files "rules/common" "$GEMINI_CLI_DIR/rules"
    fi
    echo "Gemini CLI uninstallation complete."
fi

echo "Uninstallation finished successfully."
