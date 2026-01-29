@echo off
title Anuu Verse Launcher
color 0D

:: ASCII Art de Gatito Anuu
echo.
echo      |\__/,|   (`\
echo    _.|o o  |_   ) )
echo  -(((---(((--------
echo.
echo   ANUU VERSE LAUNCHER
echo   -------------------
echo.

:: Ejecutar el script de PowerShell evitando restricciones de ejecucion
powershell -NoProfile -ExecutionPolicy Bypass -File ".\start_nexus.ps1"

:: Pausa para que puedas ver si hubo errores antes de cerrar
pause