#!/bin/bash
# Anuu_Verse Quick Setup Demo
# Run this to get Anuu working in <5 minutes

set -e

echo "🟣 Anuu_Verse Quick Setup"
echo "=========================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install Python 3.9+ first."
    exit 1
fi

echo "✅ Python detected: $(python3 --version)"

# Create venv
echo "📦 Creating virtual environment..."
python3 -m venv .venv

# Activate
echo "⚡ Activating environment..."
source .venv/bin/activate

# Install requirements
echo "📥 Installing dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting Anuu API server..."
echo "   (Press Ctrl+C to stop)"
echo ""

# Run server
python systems/EXECUTION/agents/companion_local/main.py
