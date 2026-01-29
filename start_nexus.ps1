# 🟣 Anuu_Verse Launch Protocol (Windows)
# Despierta el sistema completo abriendo procesos independientes.

Write-Host "   ___   _   _   _   _   _   _     _   _____" -ForegroundColor Yellow
Write-Host "  /   | | \ | | | | | | | | | |   | | | ____|" -ForegroundColor Yellow
Write-Host " / /| | |  \| | | | | | | | | |   | | | |__  " -ForegroundColor Yellow
Write-Host "/ / | | | . ' | | | | | | | | |   | | |  __| " -ForegroundColor Yellow
Write-Host "---------------------------------------------"
Write-Host ":: Sincronizando Sistemas Windows... ::" -ForegroundColor Cyan

# 1. Iniciar Backend (Python)
Write-Host "`n[1/2] Despertando el Núcleo (Backend)..." -ForegroundColor Green
$BackendScript = "systems/EXECUTION/agents/companion_local/main.py"

# Usamos Start-Process para abrir una nueva ventana que mantenga el servidor vivo
Start-Process -FilePath ".\.venv\Scripts\python.exe" `
              -ArgumentList "$BackendScript" `
              -WorkingDirectory $PWD `
              -WindowStyle Normal

Write-Host "   → Núcleo lanzado en nueva ventana."

# Esperar un momento para inicialización
Start-Sleep -Seconds 3

# 2. Iniciar Frontend (Vite)
Write-Host "`n[2/2] Iniciando Interfaz Nexus (Frontend)..." -ForegroundColor Green
Set-Location "systems/VISUAL/nexus_dashboard"
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev -- --host" -WindowStyle Normal
Set-Location "../../.."

Write-Host "`n✨ SISTEMA OPERATIVO." -ForegroundColor Cyan
Write-Host ">> Accede al Nexus en: http://localhost:5173" -ForegroundColor Yellow