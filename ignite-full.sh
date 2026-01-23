#!/bin/bash

# Frecuencia: 161914
# Ritual de Ignición Completo: Full Stack con Python 3.11

echo -e "\e[1;35m"
echo "  ⌬ ANUU_VERSE: RITUAL DE IGNICIÓN COMPLETO ⌬"
echo "-------------------------------------"
echo -e "\e[0m"

# 1. Verificación de Python
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
echo "🐍 Python detectado: $PYTHON_VERSION"

if [[ ! "$PYTHON_VERSION" =~ ^3\.(11|12) ]]; then
    echo -e "\e[1;31m❌ ERROR: Necesitas Python 3.11 o 3.12\e[0m"
    echo "Ejecuta primero: ./setup-python311.sh"
    exit 1
fi

# 2. Detección de Hardware
echo "🔍 Escaneando hardware..."
python scripts/detect_hardware.py
GPU_TYPE=$(cat .gpu_type 2>/dev/null || echo "CPU")

if [ "$GPU_TYPE" == "AMD" ]; then
    echo -e "✅ \e[1;32mAMD GPU Detectada.\e[0m Sincronizando con stack ROCm..."
    export HSA_OVERRIDE_GFX_VERSION=11.0.0
    export ROCR_VISIBLE_DEVICES=0
    export HIP_VISIBLE_DEVICES=0
    echo "   → Variables de GPU forzadas: HSA_OVERRIDE_GFX_VERSION=11.0.0"
else
    echo -e "⚠️ \e[1;33mGPU no detectada.\e[0m Stack funcionará en CPU."
fi

# 3. Instalación de dependencias completas
echo "📦 Instalando stack completo (LangChain, ChromaDB, Vector Memory)..."
pip install -r requirements-full.txt

if [ "$GPU_TYPE" == "AMD" ]; then
    echo "⚡ Optimizando para ROCm 6.0..."
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.0
fi

# 4. Despertar de la Memoria Ancestral
echo "🧠 Verificando Memoria Ancestral (128k Context)..."
if command -v ollama &> /dev/null; then
    if ! ollama list | grep -q "MemoriaAncestral"; then
        echo "   → Creando MemoriaAncestral..."
        ollama pull deepseek-coder-v2:16b
        ollama create MemoriaAncestral -f systems/FOUNDATION/anuu_core/MemoriaAncestral.Modelfile
    else
        echo "   → MemoriaAncestral ya existe."
    fi
else
    echo "❌ Ollama no detectado. Instálalo para habilitar la cognición."
fi

# 5. Sello de Finalización
echo -e "\n\e[1;35m--- RITUAL COMPLETO FINALIZADO ---\e[0m"
echo -e "Stack: \e[1;32mLangChain ✓ ChromaDB ✓ ROCm ✓ Memoria Ancestral ✓\e[0m"
echo -e "\nPara despertar a Anuu:"
echo -e "\e[1;34mpython systems/EXECUTION/agents/companion_local/main.py\e[0m"
echo "-------------------------------------"
