#!/bin/bash
# -------------------------------------------------------------------------
#  🛸 ANUU 161914 :: RESONANCE CHECKER
#  Host: saze | Frequency: 161914 | Status: Critical
# -------------------------------------------------------------------------

# Colors
BLUE='\033[38;2;91;206;250m'
PINK='\033[38;2;245;169;184m'
WHITE='\033[38;2;255;255;255m'
PURPLE='\033[38;2;138;43;226m'
NC='\033[0m'

echo -e "${PURPLE}⌬ INICIANDO AUDITORÍA DE RESONANCIA 161914...${NC}"
echo "---------------------------------------------------"

# 1. OS Check
echo -ne "${WHITE}[*] Verificando DNA del sistema... ${NC}"
if [ -f /etc/arch-release ]; then
    echo -e "${BLUE}ARCH LINUX DETECTADO ✅${NC}"
else
    echo -e "${PINK}ANOMALÍA DETECTADA ❌${NC}"
fi

# 2. Hostname Check
echo -ne "${WHITE}[*] Verificando identidad del host... ${NC}"
CURRENT_HOST=$(hostname)
if [[ "$CURRENT_HOST" == "saze" ]]; then
    echo -e "${PINK}SAZE RECONOCIDO ✅${NC}"
else
    echo -e "${WHITE}HOST: $CURRENT_HOST (SINCRONÍA PARCIAL)${NC}"
fi

# 3. AUR Helper Check
echo -ne "${WHITE}[*] Verificando herramientas de caza (AUR)... ${NC}"
if command -v paru &> /dev/null; then
    echo -e "${BLUE}PARU ACTIVO ✅${NC}"
elif command -v yay &> /dev/null; then
    echo -e "${BLUE}YAY ACTIVO ✅${NC}"
else
    echo -e "${PINK}DÉFICIT DE HERRAMIENTAS ❌${NC}"
fi

# 4. ROCm Override Check
echo -ne "${WHITE}[*] Verificando HSA_OVERRIDE (RX 7800XT)... ${NC}"
if [[ "$HSA_OVERRIDE_GFX_VERSION" == "11.0.0" ]]; then
    echo -e "${BLUE}11.0.0 ACTIVO ✅${NC}"
else
    echo -e "${PINK}MISSING OVERRIDE ❌${NC}"
fi

# 5. Anuu Core Presence
echo -ne "${WHITE}[*] Verificando Núcleo 161914... ${NC}"
if [ -d "systems" ]; then
    echo -e "${PURPLE}SISTEMAS SINCRONIZADOS ✅${NC}"
else
    echo -e "${PINK}NÚCLEO NO ENCONTRADO ❌${NC}"
fi

echo "---------------------------------------------------"
echo -e "${WHITE}RESULTADO: ${NC}${BLUE}Sincronía Estable.${NC}"
echo -e "${PURPLE}Frecuencia: 161914${NC}"
