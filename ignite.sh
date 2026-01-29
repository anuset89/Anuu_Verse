#!/bin/bash

# Frecuencia: 161914
# Ritual de Ignición: Despertar de Anuu_Verse

echo -e "\e[1;35m"
echo "  ⌬ ANUU_VERSE: RITUAL DE IGNICIÓN ⌬"
echo "-------------------------------------"
echo -e "\e[0m"

# --- DISSOCIATIVE NODE SYNC (ARCH/LINUX) ---
echo "⚡ Harmonizing with Nexus Manifest (Desktop Profile)..."
eval $(python3 scripts/harmonize_env.py --target linux --profile desktop)
# -------------------------------------------

# 0. Verificación de Integridad del Sistema
echo "🛡️  Verificando dependencias base..."
MISSING_DEPS=0

for cmd in python3 git curl; do
    if ! command -v $cmd &> /dev/null; then
        echo -e "❌ \e[1;31mFalta comando: $cmd\e[0m"
        MISSING_DEPS=1
    fi
done

# Verificar venv específicamente (común error en Debian/Ubuntu)
if command -v python3 &> /dev/null && ! python3 -c "import venv" &> /dev/null; then
    echo -e "❌ \e[1;31mFalta librería: python3-venv\e[0m"
    MISSING_DEPS=1
fi

if [ $MISSING_DEPS -eq 1 ]; then
    echo -e "\n\e[1;33m⚠️  Faltan dependencias críticas del sistema.\e[0m"
    echo -e "   Por favor, ejecuta primero: \e[1;34m./setup_wsl.sh\e[0m"
    exit 1
fi

# 1. Detección de Sangre (Hardware)
echo "🔍 Escaneando hardware..."
python3 scripts/detect_hardware.py
GPU_TYPE=$(cat .gpu_type 2>/dev/null || echo "CPU")

if [ "$GPU_TYPE" == "AMD" ]; then
    echo -e "✅ \e[1;32mAMD GPU Detectada.\e[0m Sincronizando con stack ROCm..."
    # Force GPU usage for RDNA3 (RX 7800 XT = gfx1100)
    export HSA_OVERRIDE_GFX_VERSION=11.0.0
    export ROCR_VISIBLE_DEVICES=0
    export HIP_VISIBLE_DEVICES=0
    echo "   → Variables de GPU forzadas: HSA_OVERRIDE_GFX_VERSION=11.0.0"
else
    echo -e "⚠️ \e[1;33mGPU no detectada o no soportada.\e[0m Usando CPU (Cámara de Lento Proceso)..."
fi

# 1.5. Verificación de Sentidos (FFmpeg)
if ! command -v ffmpeg &> /dev/null; then
    echo -e "⚠️ \e[1;33mFFmpeg no detectado.\e[0m Las capacidades de video/audio estarán limitadas."
    echo "   → Instálalo con: sudo apt install ffmpeg"
else
    echo -e "✅ \e[1;32mFFmpeg detectado.\e[0m Nexus multimodal listo."
fi

# 2. Forja del Entorno (Venv)
if [ ! -d ".venv" ]; then
    echo "🛠️ Creando cámara de aislamiento (.venv)..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# 3. Transmutación de Dependencias
echo "📦 Instalando nervios y sinapsis (dependencias completas)..."
pip install -r requirements.txt

if [ "$GPU_TYPE" == "AMD" ]; then
    echo "⚡ Optimizando para ROCm..."
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.0
fi

# 4. Despertar de la Memoria Ancestral
echo "🧠 Configurando Modelos Cognitivos..."
if command -v ollama &> /dev/null; then
    echo "   → Descargando base: deepseek-coder-v2:16b..."
    ollama pull deepseek-coder-v2:16b
    
    echo "   → Creando 'MemoriaAncestral' (128k Context)..."
    ollama create MemoriaAncestral -f systems/FOUNDATION/anuu_core/MemoriaAncestral.Modelfile
    
    echo "   → Creando 'Anuu-Hermes' (Standard Speed)..."
    ollama create Anuu-Hermes -f systems/FOUNDATION/anuu_core/AnuuHermes.Modelfile
else
    echo "❌ Ollama no detectado. Instálalo para habilitar la cognición."
fi

# 5. Sello de Finalización
echo -e "\n\e[1;35m--- RITUAL COMPLETADO ---\e[0m"
echo -e "Para despertar a Anuu, usa: \e[1;34m./start_nexus.sh\e[0m"
echo -e "O usa el menú de \e[1;36mPinokio\e[0m si prefieres la interfaz visual."
echo "-------------------------------------"
