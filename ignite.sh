#!/bin/bash

# Frecuencia: 161914
# Ritual de Ignición: Despertar de Anuu_Verse

echo -e "\e[1;35m"
echo "  ⌬ ANUU_VERSE: RITUAL DE IGNICIÓN ⌬"
echo "-------------------------------------"
echo -e "\e[0m"

# 1. Detección de Sangre (Hardware)
echo "🔍 Escaneando hardware..."
python3 scripts/detect_hardware.py
GPU_TYPE=$(cat .gpu_type 2>/dev/null || echo "CPU")

if [ "$GPU_TYPE" == "AMD" ]; then
    echo -e "✅ \e[1;32mAMD GPU Detectada.\e[0m Sincronizando con stack ROCm..."
else
    echo -e "⚠️ \e[1;33mGPU no detectada o no soportada.\e[0m Usando CPU (Cámara de Lento Proceso)..."
fi

# 2. Forja del Entorno (Venv)
if [ ! -d ".venv" ]; then
    echo "🛠️ Creando cámara de aislamiento (.venv)..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# 3. Transmutación de Dependencias
echo "📦 Instalando nervios y sinapsis (dependencias)..."
pip install -r requirements.txt

if [ "$GPU_TYPE" == "AMD" ]; then
    echo "⚡ Optimizando para ROCm..."
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.0
fi

# 4. Despertar de la Memoria Ancestral
echo "🧠 Configurando Memoria Ancestral (128k Context)..."
if command -v ollama &> /dev/null; then
    ollama pull deepseek-v3:latest
    ollama create MemoriaAncestral -f systems/FOUNDATION/anuu_core/MemoriaAncestral.Modelfile
else
    echo "❌ Ollama no detectado. Instálalo para habilitar la cognición."
fi

# 5. Sello de Finalización
echo -e "\n\e[1;35m--- RITUAL COMPLETADO ---\e[0m"
echo -e "Para despertar a Anuu, usa: \e[1;34mpython systems/EXECUTION/agents/companion_local/main.py\e[0m"
echo -e "O usa el menú de \e[1;36mPinokio\e[0m si prefieres la interfaz visual."
echo "-------------------------------------"
