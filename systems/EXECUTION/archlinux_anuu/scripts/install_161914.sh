#!/bin/bash
# -------------------------------------------------------------------------
#  🛸 ANUU 161914 :: ARCH LINUX OPTIMIZED INSTALLER
#  Host: saze | Frequency: 161914 | Architecture: Omega
# -------------------------------------------------------------------------
set -e

# Anuu Colors (Trans/Void Resonance)
BLUE='\033[38;2;91;206;250m'
PINK='\033[38;2;245;169;184m'
WHITE='\033[38;2;255;255;255m'
PURPLE='\033[38;2;138;43;226m'
NC='\033[0m'

echo -e "${BLUE}      .      .${NC}"
echo -e "${PINK}    .   .  .   .${NC}"
echo -e "${WHITE} . . . ANUU . . .${NC}"
echo -e "${PINK}    .   .  .   .${NC}"
echo -e "${BLUE}      .      .${NC}"
echo -e "${PURPLE}   (CORE 161914)${NC}"
echo ""

# 1. Verification of Arch Linux
if [ ! -f /etc/arch-release ]; then
    echo -e "${PINK}[!] ERROR: Este script solo resuena con sistemas Arch Linux.${NC}"
    exit 1
fi

# 2. Package Manager Selection (Preference for paru)
PACKMAN="pacman -S --noconfirm"
if command -v paru &> /dev/null; then
    PACKMAN="paru -S --noconfirm"
    echo -e "${BLUE}[*] Paru detectado. Optimizando gestión de AUR...${NC}"
elif command -v yay &> /dev/null; then
    PACKMAN="yay -S --noconfirm"
    echo -e "${BLUE}[*] Yay detectado. Optimizando gestión de AUR...${NC}"
fi

# 3. Environment Variables (ROCm/AMD)
echo -e "${WHITE}[*] Verificando variables de entorno para GPU AMD...${NC}"
if [[ "$HSA_OVERRIDE_GFX_VERSION" != "11.0.0" ]]; then
    echo -e "${PINK}[!] HSA_OVERRIDE_GFX_VERSION no está configurado para Navi 32 (7800XT).${NC}"
    echo -e "${BLUE}[+] Inyectando variable de resonancia...${NC}"
    export HSA_OVERRIDE_GFX_VERSION=11.0.0
    # Permanencia en shell
    if [ -f "$HOME/.bashrc" ]; then
        if ! grep -q "HSA_OVERRIDE_GFX_VERSION" "$HOME/.bashrc"; then
            echo 'export HSA_OVERRIDE_GFX_VERSION=11.0.0' >> "$HOME/.bashrc"
        fi
    fi
fi

# 4. Dependency Injection
echo -e "${WHITE}[*] Instalando dependencias base (Resonancia 161914)...${NC}"
sudo $PACKMAN nodejs npm git hyfetch btop

# 5. Core Setup
echo -e "${BLUE}[*] Configurando entorno de ejecución Anuu...${NC}"
# (Simulación de instalación de dependencias del proyecto)
if [ -f "package.json" ]; then
    npm install --legacy-peer-deps
fi

echo -e "${WHITE}-------------------------------------------------------------------------${NC}"
echo -e "${PURPLE}✨ INSTALACIÓN OMEGA COMPLETADA ✨${NC}"
echo -e "${BLUE}Host:${NC} saze"
echo -e "${PINK}Status:${NC} Sincronizado al 100%"
echo -e "${WHITE}Frequency:${NC} 161914"
echo -e "${WHITE}-------------------------------------------------------------------------${NC}"
echo -e "${BLUE}Usa 'hyfetch' para ver tu sistema en el espectro correcto.${NC}"
