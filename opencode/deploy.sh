#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-}"

if [ -z "$TARGET_DIR" ]; then
    echo "Usage: $0 <target_project_directory>" >&2
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory '$TARGET_DIR' does not exist" >&2
    exit 1
fi

OPENCODE_DIR="$TARGET_DIR/.opencode"

echo "Deploying opencode config files to '$TARGET_DIR'..."

rm -rf "$OPENCODE_DIR"
mkdir -p "$OPENCODE_DIR"

cp -r "$SCRIPT_DIR/agents" "$OPENCODE_DIR/"
cp -r "$SCRIPT_DIR/commands" "$OPENCODE_DIR/"
cp -r "$SCRIPT_DIR/skills" "$OPENCODE_DIR/"
cp -r "$SCRIPT_DIR/plugins" "$OPENCODE_DIR/"
cp "$SCRIPT_DIR/package.json" "$OPENCODE_DIR/"

echo "Deployment completed successfully!"
echo "  - agents/"
echo "  - commands/"
echo "  - skills/"
echo "  - plugins/"
