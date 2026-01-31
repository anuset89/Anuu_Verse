#!/bin/bash

# ANUU VERSE - ROBUST DEPLOYMENT SCRIPT
# Handles the full build -> sync -> deploy cycle atomically to avoid git conflicts and partial states.

set -e # Exit immediately if any command fails

echo "🚀 Starting Deployment Sequence..."

# 1. Build the Nexus Application
echo "🛠️  Building GW2 Nexus..."
cd systems/VISUAL/gw2-nexus
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build Failed! Aborting."
    exit 1
fi
echo "✅ Build Successful."

# 2. Sync Artifacts
echo "📦 Syncing artifacts to documentation folder..."
cd ../../../ # Back to root
mkdir -p docs/gw2money
rm -rf docs/gw2money/*
cp -r systems/VISUAL/gw2-nexus/dist/* docs/gw2money/
echo "✅ Artifacts Synced."

# 3. Git Operations
echo "git operations..."
# Check for changes
if [[ -z $(git status -s) ]]; then
    echo "✨ No changes to commit."
    exit 0
fi

# Add changes
git add .

# Commit (use argument or default)
COMMIT_MSG="${1:-deploy: manual system update}"
echo "📝 Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

# 4. Pull & Push Safety
echo "🔄 Reconciling with remote (Rebase)..."
git pull --rebase origin main

echo "🚀 Pushing to origin/main..."
git push origin main

echo "✅ DEPLOYMENT COMPLETE! verify at https://anuset89.github.io/Anuu_Verse/gw2money/"
