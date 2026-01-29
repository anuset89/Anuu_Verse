@echo off
title Stop Anuu Verse
color 0C

:: ASCII Art
echo.
echo      |\__/,|   (`\
echo    _.|o o  |_   ) )
echo  -(((---(((--------
echo.
echo   🛑 DETENIENDO ANUU VERSE
echo   ------------------------
echo.
echo   [!] Cerrando todos los procesos de Python y Node.js...
echo.

:: Matar procesos (La bandera /F fuerza el cierre, /T mata el árbol de procesos)
echo   🔪 Terminando Python (Backend/AI)...
taskkill /F /IM python.exe /T 2>nul

echo   🔪 Terminando Node.js (Frontend)...
taskkill /F /IM node.exe /T 2>nul

echo.
echo   ✅ Sistema apagado correctamente.
timeout /t 3