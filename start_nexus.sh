#!/bin/bash

# 🟣 Anuu_Verse Launch Protocol
# Single command to wake the entire system.

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
GOLD='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GOLD}"
echo "   ___   _   _   _   _   _   _     _   _____   _____   _____   _____  "
echo "  /   | | \ | | | | | | | | | |   | | | ____| |  _  \ /  ___/ | ____| "
echo " / /| | |  \| | | | | | | | | |   | | | |__   | |_| | | |___  | |__   "
echo "/ / | | | . ' | | | | | | | | |   | | |  __|  |  _  / \___  \ |  __|  "
echo "/ /  | | | |\  | | |_| | | |_| |   | | | |___  | | \ \  ___| | | |___  "
echo "/_/   |_| |_| \_| \_____/ \_____/   |_| |_____| |_|  \_\/_____/ |_____| "
echo -e "${NC}"
echo -e "${CYAN}:: Sincronizando Sistemas... ::${NC}"

# Function to kill processes on exit
cleanup() {
    echo -e "\n${GOLD}🛑 Cerrando Nexus...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# 1. Start Backend (The Soul)
echo -e "\n${GREEN}[1/2] Despertando el Núcleo (Backend)...${NC}"
source .venv/bin/activate
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Configuración GPU (AMD ROCm) si .gpu_type indica AMD
if [ -f ".gpu_type" ] && grep -q "AMD" ".gpu_type"; then
    echo "⚡ Activando aceleración ROCm (RDNA3 Override)..."
    export HSA_OVERRIDE_GFX_VERSION=11.0.0
    export ROCR_VISIBLE_DEVICES=0
    export HIP_VISIBLE_DEVICES=0
fi

python backend/main.py &
BACKEND_PID=$!
echo "   → Núcleo activo en PID $BACKEND_PID"

# Wait a moment for backend to initialize
sleep 3

# 2. Start Frontend (The Vision)
echo -e "\n${GREEN}[2/2] Iniciando el Interfaz Nexus (Frontend)...${NC}"
cd systems/VISUAL/nexus_dashboard
npm run dev -- --host &
FRONTEND_PID=$!
echo "   → Interfaz activa en PID $FRONTEND_PID"

echo -e "\n${CYAN}✨ SISTEMA OPERATIVO...${NC}"
echo -e "${GOLD}>> Accede al Nexus en: http://localhost:5173/Anuu_Verse/v2${NC}"
echo -e "${NC}Presiona Ctrl+C para desconectar."

# Keep script running to maintain processes
wait
