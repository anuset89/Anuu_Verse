#!/bin/bash

# 🏥 Anuu_Verse Health Check Protocol
# Verifica el estado de los servicios vitales del sistema.

# Colores
GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "  ⌬ ANUU_VERSE: DIAGNÓSTICO DE SISTEMAS ⌬"
echo "-----------------------------------------"
echo -e "${NC}"

# 1. Verificar Ollama (Puerto 11434)
echo -n "🧠 [Ollama] Cognición Base: "
if curl -s --connect-timeout 2 http://localhost:11434/api/tags > /dev/null; then
    echo -e "${GREEN}ACTIVO${NC}"
else
    echo -e "${RED}INACTIVO${NC} (Asegúrate de ejecutar 'ollama serve')"
fi

# 2. Verificar Backend (Proceso Python)
echo -n "👻 [Backend] El Núcleo: "
if pgrep -f "systems/EXECUTION/agents/companion_local/main.py" > /dev/null; then
    echo -e "${GREEN}ACTIVO${NC}"
else
    echo -e "${RED}INACTIVO${NC}"
fi

# 3. Verificar Frontend (Puerto 5173)
echo -n "👁️  [Frontend] Interfaz Visual: "
if curl -s --connect-timeout 2 http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}ACTIVO${NC} (http://localhost:5173)"
else
    echo -e "${RED}INACTIVO${NC}"
fi

# 4. Verificar ComfyUI (Puerto 8188 - Opcional)
echo -n "🎨 [ComfyUI] Cortex Visual: "
if curl -s --connect-timeout 2 http://localhost:8188 > /dev/null 2>&1; then
    echo -e "${GREEN}ACTIVO${NC} (http://localhost:8188)"
else
    echo -e "${YELLOW}INACTIVO (Opcional)${NC}"
fi

echo -e "\n-----------------------------------------"
echo -e "Para iniciar los sistemas: ${CYAN}./start_nexus.sh${NC}"