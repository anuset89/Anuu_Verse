#!/bin/bash

# ANUU DEPLOYMENT SCRIPT (161914)
# Copies documentation to web app and builds for GitHub Pages.

echo "🟣 [ANUU] Initiating Deployment Sequence..."

# 1. Cleaning pre-build
rm -rf web/public/docs
mkdir -p web/public/docs

# 2. Copying The Grimoire (Docs) to the Web Interface
echo "📜 [ANUU] Injecting Knowledge Base..."
cp -r docs/* web/public/docs/

# 3. Generating Skill List for the UI
echo "🧠 [ANUU] Indexing Skills..."
# (Optional: Generate a JSON index of docs if needed, for now just raw copy)

# 4. Building React App
echo "🏗️ [ANUU] Building Web Interface..."
cd web
npm install
npm run build

echo "✅ [ANUU] Build Complete. Ready for manual push of 'dist' folder or GH Action."
