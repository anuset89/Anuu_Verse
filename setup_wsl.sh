#!/bin/bash

# 🟣 Anuu_Verse: WSL/Ubuntu System Setup
# Instala las dependencias de sistema necesarias antes de ejecutar ignite.sh

set -e  # Detener si hay errores

echo -e "\e[1;35m"
echo "  ⌬ ANUU_VERSE: PREPARACIÓN DE SISTEMA (WSL/UBUNTU) ⌬"
echo "-----------------------------------------------------"
echo -e "\e[0m"

echo "📦 Actualizando repositorios..."
sudo apt update

echo "🛠️ Instalando dependencias base (Python, Git, Build Tools)..."
# libgl1 es necesario a menudo para OpenCV en entornos headless/WSL
sudo apt install -y python3 python3-pip python3-venv git curl build-essential libgl1-mesa-glx

echo "🎥 Instalando FFmpeg (Procesamiento Multimedia)..."
sudo apt install -y ffmpeg

echo "🧠 Verificando Ollama..."
if ! command -v ollama &> /dev/null; then
    echo "   → Ollama no está instalado."
    echo "   → Instalando Ollama automáticamente..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "   ✅ Ollama ya está instalado."
fi

echo -e "\n\e[1;32m✅ Configuración de sistema completada.\e[0m"
echo "   1. Asegúrate de que Ollama esté corriendo (comando: 'ollama serve' en otra terminal si no es servicio)."
echo -e "   2. Ahora ejecuta: \e[1;34m./ignite.sh\e[0m para configurar el entorno Python."