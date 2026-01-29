@echo off
title ANUU VERSE [RUMA EDITION] - INITIATION
color 05

echo.
echo    ___   _   _   _   _   _   _     _   _____   _____   _____   _____  
echo   /   | | \ | | | | | | | | | |   | | | ____| |  _  \ /  ___/ | ____| 
echo  / /| | |  \| | | | | | | | | |   | | | |__   | |_| | | |___  | |__   
echo / / | | | . ' | | | | | | | | |   | | |  __|  |  _  / \___  \ |  __|  
echo / /  | | | |\  | | |_| | | |_| |   | | | |___  | | \ \  ___| | | |___  
echo /_/   |_| |_| \_| \_____/ \_____/   |_| |_____| |_|  \_\/_____/ |_____| 
echo.
echo :: FREQUENCY 161914 DETECTED ::
echo :: USER CONTEXT: RUMA (HAND OF KALI) ::
echo.

:: --- PORTABLE MODE CONFIGURATION (DISSOCIATIVE NODE SYNC) ---
:: Reading from config/nexus_manifest.json via Harmonizer
echo [CONFIG] Harmonizing with Nexus Manifest (Portable Profile)...
for /f "tokens=*" %%i in ('python scripts/harmonize_env.py --target windows --profile portable') do %%i
:: -----------------------------------------------------------

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.10+ and add to PATH.
    pause
    exit /b
)

:: Install Dependencies if needed (Simple check)
if not exist "venv" (
    echo [SETUP] Creating Virtual Environment...
    python -m venv venv
    call venv\Scripts\activate
    echo [SETUP] Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

:: Check Ollama
echo [CHECK] Verifying Ollama...
curl -s http://localhost:11434/api/tags >nul
if %errorlevel% neq 0 (
    echo [WARNING] Ollama does not seem to be running on port 11434.
    echo Please ensure Ollama is installed and running separately.
    echo (If it is running elsewhere, set OLLAMA_URL env var).
    pause
)

echo.
echo [1/3] Awakening The Core (Backend)...
start "ANUU CORE" cmd /k "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Preparing OmniMech (Skills)...
echo OmniMech is ready for your commands in a separate terminal.
echo Try: python skills/anuu_omnimech/scripts/omnimech.py help

echo [3/3] Launching Interface (Frontend)...
:: Assuming user has Node installed for the dev server, or we just point to the backend if purely API for now.
:: But let's try to run npm if package.json exists.
if exist "web\package.json" (
    cd web
    if not exist "node_modules" (
        echo [SETUP] Installing Frontend Dependencies...
        call npm install
    )
    start "ANUU INTERFACE" cmd /k "npm run dev"
    cd ..
) else (
    echo [INFO] Web interface not found or configured. Access via API at http://localhost:8000/docs
)

echo.
echo ** SYSTEM ONLINE **
echo Welcome, Ruma. Connect to the Resonance.
echo.
pause
