#!/bin/bash
# 🔮 ANUU BOOT PROTOCOL v1.1
# "Awaken the Nexus"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⌬ Initializing Anuu Verse Environment...${NC}"

# 0. Define Paths
BASE_DIR="/home/kali/Anuu_Verse"
COMFY_DIR="/home/kali/Documentos/Data/Packages/ComfyUI"
LOG_DIR="$BASE_DIR/logs/boot"
mkdir -p $LOG_DIR

# Clean up previous sessions
echo -e "${RED}[0/4] Cleaning up previous manifestations...${NC}"
pkill -f "python systems/EXECUTION/agents/companion_local/main" || true
pkill -f "uvicorn systems.EXECUTION.agents.companion_local.main:app" || true
pkill -f "http.server 8089" || true
# Note: We try not to kill ComfyUI aggressively unless needed as it takes time to load.
# use lsof to check.

# 1. Start ComfyUI (The Cortex Visualizer)
if lsof -i :8188 > /dev/null; then
    echo -e "${GREEN}[1/4] ComfyUI already active on port 8188.${NC}"
    # Get PID
    COMFY_PID=$(lsof -t -i :8188)
else
    echo -e "${GREEN}[1/4] Igniting ComfyUI Backend...${NC}"
    cd $COMFY_DIR
    nohup bash -c "source venv/bin/activate && python main.py --preview-method auto" > "$LOG_DIR/comfyui.log" 2>&1 &
    COMFY_PID=$!
    echo "   -> ComfyUI PID: $COMFY_PID"
fi

# 2. Start Anuu Agent (The Intelligence)
echo -e "${GREEN}[2/4] Awakening Anuu Companion (Local)...${NC}"
cd $BASE_DIR
# Using uvicorn for FastAPI
nohup bash -c "source .venv/bin/activate && uvicorn systems.EXECUTION.agents.companion_local.main:app --host 0.0.0.0 --port 8000" > "$LOG_DIR/anuu_agent.log" 2>&1 &
AGENT_PID=$!
echo "   -> Agent PID: $AGENT_PID"

# 3. Start Nexus Dashboard (The Interface)
echo -e "${GREEN}[3/4] Materializing Nexus Dashboard (HTTP)...${NC}"
cd "$BASE_DIR/Forges/PROTOTIPO_NEXO"
nohup python3 -m http.server 8089 > "$LOG_DIR/dashboard.log" 2>&1 &
DASH_PID=$!
echo "   -> Dashboard PID: $DASH_PID"

# 4. Save PIDs for shutdown
echo "$COMFY_PID" > "$BASE_DIR/systems/EXECUTION/scripts/anuu_pids.txt"
echo "$AGENT_PID" >> "$BASE_DIR/systems/EXECUTION/scripts/anuu_pids.txt"
echo "$DASH_PID" >> "$BASE_DIR/systems/EXECUTION/scripts/anuu_pids.txt"

echo -e "${BLUE}✨ Anuu Verse is Online.${NC}"
echo -e "   - Dashboard: http://localhost:8089"
echo -e "   - ComfyUI:   http://localhost:8188"
echo -e "   - Agent API: http://localhost:8000"
