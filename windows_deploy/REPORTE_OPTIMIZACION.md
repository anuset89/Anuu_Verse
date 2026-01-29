# Reporte de Optimización: Anuu Verse (Nodo Ruma)

**Para:** Ruma (Hand of Kali)
**De:** K4L1 & Anuu System
**Versión:** v0.19-Portable

## 🚀 Resumen de Actualización
Se ha finalizado la configuración del nodo para operar con máxima estabilidad en hardware portátil (Windows Laptop).

## 🛠️ Cambios Implementados

### 1. Optimizaciones de Rendimiento (Portable Mode)
- **Timeout Dinámico**: Se aumentó el tiempo de espera de carga de modelos a **60 segundos** (antes 30s).
- **Gestión de VRAM**: Configuración explícita para descarga de memoria.

### 2. Configuración de Modelos
- **Modelo Predeterminado**: `anuu-hermes`.
- **Verificación de Ollama**: El script de inicio ahora comprueba si Ollama está corriendo.

## 📋 Instrucciones
1.  **Reemplaza** tu archivo `INITIATE_RUMA.bat` actual con el de esta carpeta.
2.  **Asegúrate** de que la carpeta `backend` esté actualizada.
3.  Ejecuta `INITIATE_RUMA.bat`.
