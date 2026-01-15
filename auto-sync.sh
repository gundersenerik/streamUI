#!/bin/bash

# StreamUI Auto-Sync Script
# Watches for file changes and automatically commits/pushes to GitHub
#
# Usage: ./auto-sync.sh
# To stop: Press Ctrl+C

WATCH_DIR="$(dirname "$0")"
cd "$WATCH_DIR" || exit 1

echo "🔄 StreamUI Auto-Sync Started"
echo "📁 Watching: $WATCH_DIR"
echo "Press Ctrl+C to stop"
echo ""

# Function to sync changes
sync_changes() {
    # Check if there are any changes
    if [[ -n $(git status --porcelain) ]]; then
        echo "$(date '+%H:%M:%S') - Changes detected, syncing..."

        # Stage all changes
        git add -A

        # Create commit with timestamp
        CHANGED_FILES=$(git diff --cached --name-only | head -3 | tr '\n' ', ' | sed 's/,$//')
        git commit -m "Auto-sync: $CHANGED_FILES" -m "$(date '+%Y-%m-%d %H:%M:%S')"

        # Push to remote
        if git push origin main 2>&1; then
            echo "$(date '+%H:%M:%S') - ✅ Pushed successfully"
        else
            echo "$(date '+%H:%M:%S') - ❌ Push failed, will retry on next change"
        fi
        echo ""
    fi
}

# Check if fswatch is available (macOS)
if command -v fswatch &> /dev/null; then
    echo "Using fswatch for file monitoring..."
    echo ""

    # Initial sync
    sync_changes

    # Watch for changes (excluding .git directory)
    fswatch -o -e "\.git" "$WATCH_DIR" | while read -r; do
        sleep 2  # Debounce - wait for file saves to complete
        sync_changes
    done
else
    echo "fswatch not found. Installing via Homebrew is recommended:"
    echo "  brew install fswatch"
    echo ""
    echo "Falling back to polling mode (checks every 10 seconds)..."
    echo ""

    # Initial sync
    sync_changes

    # Poll for changes
    while true; do
        sleep 10
        sync_changes
    done
fi
