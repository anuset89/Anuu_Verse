#!/bin/bash

# Script de instalación universal corregido - Manejo de nvm mejorado
# AnuSet Desktop v4.2.1 - Universal Installer
# Versión corregida para manejar nvm automáticamente

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🎭 Instalador AnuSet Desktop v4.2.1 (CORREGIDO)${NC}"
echo "====================================="

# Función para cargar nvm si está disponible
load_nvm() {
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 2>/dev/null || true

    # Verificar si nvm funciona
    if command -v nvm &> /dev/null; then
        echo -e "${GREEN}✅ NVM cargado correctamente${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ NVM no disponible, usando Node.js del sistema${NC}"
        return 1
    fi
}

# Función para instalar Node.js usando nvm
install_node_nvm() {
    if load_nvm; then
        echo -e "${CYAN}📦 Instalando Node.js via NVM...${NC}"
        nvm install --lts
        nvm use --lts
        nvm alias default node
        return 0
    else
        return 1
    fi
}

# Función para verificar Node.js
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"
        return 0
    else
        echo -e "${RED}❌ Node.js no encontrado${NC}"
        return 1
    fi
}

# Función para instalar Node.js del sistema
install_node_system() {
    echo -e "${CYAN}📦 Instalando Node.js del sistema...${NC}"

    # Detectar distribución
    if command -v apt &> /dev/null; then
        # Debian/Ubuntu/Kali
        sudo apt update -qq
        sudo apt install -y nodejs npm
    elif command -v pacman &> /dev/null; then
        # Arch Linux/Manjaro
        sudo pacman -S --noconfirm nodejs npm
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install -y nodejs npm
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y nodejs npm
    else
        echo -e "${RED}❌ Distribución no soportada. Instala Node.js manualmente.${NC}"
        exit 1
    fi

    # Verificar instalación
    if check_node; then
        return 0
    else
        echo -e "${RED}❌ Error al instalar Node.js${NC}"
        exit 1
    fi
}

# Función principal de instalación
main() {
    echo -e "${BLUE}🔍 Detectando sistema operativo...${NC}"

    # Detectar OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS_TYPE="debian"
            echo -e "${GREEN}📱 Distribución Debian/Ubuntu/Kali detectada${NC}"
        elif [ -f /etc/arch-release ] || [ -f /etc/manjaro-release ]; then
            OS_TYPE="arch"
            echo -e "${GREEN}📱 Distribución Arch/Manjaro detectada${NC}"
        elif [ -f /etc/redhat-release ]; then
            OS_TYPE="redhat"
            echo -e "${GREEN}📱 Distribución RedHat/CentOS/Fedora detectada${NC}"
        else
            OS_TYPE="linux"
            echo -e "${YELLOW}📱 Distribución Linux genérica${NC}"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS_TYPE="macos"
        echo -e "${GREEN}📱 macOS detectado${NC}"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS_TYPE="windows"
        echo -e "${GREEN}📱 Windows detectado${NC}"
    else
        echo -e "${RED}❌ Sistema operativo no soportado: $OSTYPE${NC}"
        exit 1
    fi

    # Verificar Node.js
    echo -e "${CYAN}🔍 Verificando Node.js...${NC}"

    if ! check_node; then
        echo -e "${YELLOW}⚠️ Node.js no encontrado. Instalando...${NC}"

        # Intentar con nvm primero
        if ! install_node_nvm; then
            # Si falla nvm, usar instalación del sistema
            install_node_system
        fi
    fi

    # Verificar npm
    echo -e "${CYAN}📦 Verificando npm...${NC}"
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm no encontrado${NC}"
        exit 1
    fi

    # Crear directorio de aplicación
    APP_DIR="/opt/anuset-vtuber-desktop"
    echo -e "${CYAN}📁 Creando directorio: $APP_DIR${NC}"
    sudo mkdir -p "$APP_DIR"
    sudo chown "$USER:$USER" "$APP_DIR"

    # Copiar archivos
    echo -e "${CYAN}📋 Copiando archivos de la aplicación...${NC}"
    cp -r . "$APP_DIR/"
    cd "$APP_DIR"

    # Instalar dependencias
    echo -e "${CYAN}📦 Instalando dependencias npm...${NC}"
    echo "Esto puede tardar varios minutos..."
    npm install --legacy-peer-deps

    # Crear archivo de configuración
    echo -e "${CYAN}⚙️ Creando configuración...${NC}"
    mkdir -p config
    cat > config/api-config.js << 'EOF'
// Configuración API para AnuSet Desktop
export const API_CONFIG = {
  // Gemini API Key (usuario debe configurar)
  geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE',

  // Configuración de la aplicación
  app: {
    version: '4.2.1',
    name: 'AnuSet Desktop',
    port: 3000,
    host: 'localhost'
  },

  // Configuración de base de datos
  database: {
    name: 'anuset_vtuber.db',
    path: './config/'
  },

  // Configuración por defecto del usuario
  defaultUser: {
    username: 'kali',
    password: 'kali'
  }
};
EOF

    # Crear launcher global
    echo -e "${CYAN}🚀 Creando launcher global...${NC}"
    cat > /usr/local/bin/anuset-vtuber-desktop << 'EOF'
#!/bin/bash
cd /opt/anuset-vtuber-desktop
npm run dev
EOF

    sudo chmod +x /usr/local/bin/anuset-vtuber-desktop

    # Crear icono de escritorio
    echo -e "${CYAN}🖥️ Creando acceso directo...${NC}"
    mkdir -p "$HOME/.local/share/applications"
    cat > "$HOME/.local/share/applications/anuset-vtuber-desktop.desktop" << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=AnuSet Desktop
Comment=Sistema VTuber IA Desktop
Exec=anuset-vtuber-desktop
Icon=applications-graphics
Terminal=true
Categories=Graphics;AudioVideo;
EOF

    # Instrucciones finales
    echo ""
    echo -e "${GREEN}🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE!${NC}"
    echo "=============================================="
    echo -e "${CYAN}📍 Ubicación:${NC} /opt/anuset-vtuber-desktop"
    echo -e "${CYAN}🚀 Comando:${NC} anuset-vtuber-desktop"
    echo -e "${CYAN}🌐 URL:${NC} http://localhost:3000"
    echo ""
    echo -e "${YELLOW}⚙️ CONFIGURACIÓN REQUERIDA:${NC}"
    echo "1. Edita: /opt/anuset-vtuber-desktop/config/api-config.js"
    echo "2. Reemplaza 'YOUR_GEMINI_API_KEY_HERE' con tu API key de Gemini"
    echo "3. Inicia con: anuset-vtuber-desktop"
    echo ""
    echo -e "${GREEN}🔑 Credenciales por defecto:${NC}"
    echo "   Usuario: kali"
    echo "   Contraseña: kali"
    echo ""
    echo -e "${PURPLE}✨ AnuSet Desktop v4.2.1 listo para usar!${NC}"
}

# Ejecutar instalación
main "$@"
