#!/bin/bash

# 🎨 Anuu Multimodal Cortex Launcher
# Connects to the local ComfyUI instance.

COMFY_DIR="/home/kali/Documentos/Data/Packages/ComfyUI"

if [ ! -d "$COMFY_DIR" ]; then
    echo "❌ ComfyUI no encontrado en $COMFY_DIR"
    exit 1
fi

echo -e "\e[1;35m🎨 Iniciando ComfyUI (Cortex Visual)...\e[0m"
cd "$COMFY_DIR"

# Check if venv exists in ComfyUI folder, otherwise assume system python or user preference?
# Usuall ComfyUI comes with its own python or uses system. Let's try python3.
# If there is a 'run_nvidia_gpu.sh' or similar, we might prefer that, but 'python main.py' is standard.

# We will run it in background and keep log
python3 main.py --listen 127.0.0.1 --port 8188 > comfy.log 2>&1 &
COMFY_PID=$!

echo "✅ ComfyUI activo en PID $COMFY_PID"
echo "   → http://localhost:8188"
echo "   → Logs en $COMFY_DIR/comfy.log"

# Save PID to file for cleaner shutdown if needed
echo $COMFY_PID > /tmp/anuu_comfy_pid
