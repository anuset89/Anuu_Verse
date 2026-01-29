# 🟣 Anuu_Verse: Ritual de Ignición (Windows PowerShell)
# Configuración automática del entorno para Windows Nativo.

Write-Host "  ⌬ ANUU_VERSE: RITUAL DE IGNICIÓN (WINDOWS) ⌬" -ForegroundColor Magenta
Write-Host "------------------------------------------------"

# 1. Verificación de Prerrequisitos
Write-Host "🛡️  Verificando dependencias..."

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Python no encontrado. Instálalo desde python.org y añádelo al PATH."
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Git no encontrado."
    exit 1
}

# 2. Forja del Entorno (Venv)
if (-not (Test-Path ".venv")) {
    Write-Host "🛠️  Creando entorno virtual (.venv)..." -ForegroundColor Cyan
    python -m venv .venv
}

# 3. Instalación de Dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
& ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt

# Nota sobre Hardware (Simplificado para Windows)
Write-Host "ℹ️  Nota: Se han instalado las versiones estándar de PyTorch." -ForegroundColor Yellow
Write-Host "    Si tienes una GPU NVIDIA, esto debería funcionar (CUDA)."
Write-Host "    Si usas AMD en Windows, considera usar DirectML o WSL."

# 4. Configuración de Ollama
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "🧠 Configurando Modelos Cognitivos..." -ForegroundColor Green
    
    # Verificar si el servicio está corriendo intentando listar modelos
    try {
        ollama list | Out-Null
        
        Write-Host "   → Descargando base: deepseek-coder-v2:16b..."
        ollama pull deepseek-coder-v2:16b
        
        Write-Host "   → Creando 'MemoriaAncestral'..."
        ollama create MemoriaAncestral -f systems/FOUNDATION/anuu_core/MemoriaAncestral.Modelfile
    }
    catch {
        Write-Host "⚠️  Ollama parece estar apagado. Ejecuta 'ollama serve' en otra ventana." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Ollama no detectado. Descárgalo en ollama.com/download/windows" -ForegroundColor Red
}

Write-Host "`n✅ RITUAL COMPLETADO." -ForegroundColor Magenta
Write-Host "Ejecuta: .\start_nexus.ps1" -ForegroundColor Cyan