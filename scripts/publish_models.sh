#!/bin/bash

# Script to publish Anuu-Hermes models to Ollama (or HuggingFace via CLI)
# Usage: ./publish_models.sh [username]

USERNAME=${1:-"anuset89"}
MODEL_NAME="anuu-hermes"
TAG="latest"

echo "🚀 Preparing to publish $MODEL_NAME to access frequency 161914..."

# Check if model exists locally
if ! ollama list | grep -q "$MODEL_NAME"; then
    echo "❌ Model '$MODEL_NAME' not found locally."
    echo "   Run './ignite.sh' first to forge it."
    exit 1
fi

echo "📦 Tagging model as $USERNAME/$MODEL_NAME:$TAG..."
ollama cp $MODEL_NAME $USERNAME/$MODEL_NAME:$TAG

echo "📤 Pushing to Ollama Registry..."
echo "   (Ensure you have run 'ollama set-auth' or set OLLAMA_KEY)"

ollama push $USERNAME/$MODEL_NAME:$TAG

if [ $? -eq 0 ]; then
    echo "✅ Success! Model published to https://ollama.com/$USERNAME/$MODEL_NAME"
else
    echo "⚠️ Push failed. Check your authentication."
fi

echo "---------------------------------------------------"
echo "To publish to HuggingFace (GGUF):"
echo "1. Convert model to GGUF using llama.cpp"
echo "2. huggingface-cli upload $USERNAME/Anuu_Verse ./anuu-hermes.gguf"
echo "---------------------------------------------------"
