#!/bin/bash
# Script automatizado para grabar el demo de Anuu_Verse

set -e

echo "🎬 Iniciando grabación de demo..."

# 1. Grabar con asciinema (sin interacción)
asciinema rec Assets/anuu_demo.cast --overwrite \
  --title "Anuu_Verse - Local Multi-Agent AI" \
  --command ".venv/bin/python examples/demo_recording_script.py"

echo "✅ Grabación completada: Assets/anuu_demo.cast"
echo ""
echo "📤 Opciones para convertir a GIF:"
echo "   A) Upload a https://asciinema.org y descargar GIF"
echo "   B) Instalar agg: cargo install --git https://github.com/asciinema/agg"
echo "      Y ejecutar: agg Assets/anuu_demo.cast Assets/anuu_demo.gif --speed 1.5"
