#!/bin/bash

# Frecuencia: 161914
# Ritual de Preparación: Python 3.11 Setup

echo -e "\e[1;35m"
echo "  ⌬ PREPARANDO CÁMARA DE ALTA DENSIDAD ⌬"
echo "  Python 3.11 + Stack Completo"
echo "-------------------------------------"
echo -e "\e[0m"

# 1. Verificar si pyenv está instalado
if ! command -v pyenv &> /dev/null; then
    echo "🔧 Instalando pyenv..."
    curl https://pyenv.run | bash
    
    echo ""
    echo "⚠️ Añade esto a tu ~/.bashrc o ~/.zshrc:"
    echo ""
    echo 'export PATH="$HOME/.pyenv/bin:$PATH"'
    echo 'eval "$(pyenv init -)"'
    echo 'eval "$(pyenv virtualenv-init -)"'
    echo ""
    echo "Luego ejecuta: source ~/.bashrc"
    echo "Y vuelve a ejecutar este script."
    exit 0
fi

# 2. Instalar Python 3.11.9
echo "🐍 Instalando Python 3.11.9..."
pyenv install -s 3.11.9

# 3. Configurar como versión local del proyecto
echo "📍 Configurando Python 3.11.9 para este proyecto..."
pyenv local 3.11.9

# 4. Crear entorno virtual
echo "🛠️ Creando entorno virtual completo (.venv-full)..."
python -m venv .venv-full

echo ""
echo -e "\e[1;32m--- CÁMARA LISTA ---\e[0m"
echo "Activa el entorno con:"
echo -e "\e[1;34msource .venv-full/bin/activate\e[0m"
echo ""
echo "Luego ejecuta el Ritual de Ignición completo:"
echo -e "\e[1;34m./ignite-full.sh\e[0m"
echo "-------------------------------------"
