# Guía de Solución de Problemas

**Frecuencia:** 161914  
**Estado:** Documento Vivo

Problemas comunes y soluciones para la instalación y operación de Anuu_Verse.

---

## 🐛 Problemas Comunes

### "CUDA out of memory" / Problemas de VRAM
**Síntomas:** El agente se cierra durante la generación, error de "Allocated: 0GB".

**Soluciones:**
1. **Reducir el Batch Size:**
   ```bash
   export ANUU_BATCH_SIZE=1  # El valor por defecto suele ser más alto
   ```
2. **Usar Modelos más Pequeños:**
   Cambia a `llama3.2:3b` o `phi3:mini` para entornos con poca VRAM.
   ```bash
   ollama pull llama3.2:3b
   ```
3. **Habilitar Offloading de Memoria:**
   Asegúrate de que la RAM de tu sistema sea suficiente (32GB+) para que Ollama pueda mover capas a la CPU.

### "ROCm not found" (GPUs AMD)
**Síntomas:** Ollama se ejecuta en modo solo CPU a pesar de tener una GPU AMD compatible.

**Validación:**
```bash
rocminfo | grep "Agent"
```

**Soluciones:**
1. **Forzar Versión GFX (RDNA3/7800XT):**
   ```bash
   export HSA_OVERRIDE_GFX_VERSION=11.0.0
   ```
   *Añade esto a tu `~/.bashrc`.*

2. **Instalar Herramientas de Desarrollo ROCm:**
   ```bash
   sudo pacman -S rocm-hip-sdk  # Arch
   sudo apt install rocm-dev    # Ubuntu
   ```

### "Ollama connection refused"
**Síntomas:** Los scripts fallan con errores de conexión a localhost:11434.

**Soluciones:**
1. **Verificar el Servicio:**
   ```bash
   systemctl status ollama
   ```
2. **Probar el Endpoint:**
   ```bash
   curl http://localhost:11434/api/tags
   ```
3. **Revisar Conflictos de Puertos:** Asegúrate de que nada más esté usando el puerto 11434.

---

## 📋 Plantilla de Reporte de Errores

Si necesitas abrir un [Issue en GitHub](https://github.com/anuset89/Anuu_Verse/issues), por favor usa este formato:

### Contexto
- **Versión de Anuu:** v0.10.0-alpha
- **Hardware:** (ej. AMD RX 7800XT, 16GB VRAM)
- **SO:** (ej. Arch Linux, Kernel 6.8)
- **Versión de Ollama:** `ollama --version`

### Descripción del Error
[Pega el log de error completo aquí]

### Pasos para Reproducir
1. [Paso 1]
2. [Paso 2]
3. ...

### Logs
Adjunta logs relevantes del directorio `logs/`.

---

## 🔍 Comandos de Diagnóstico

Ejecuta estos comandos para reunir información antes de reportar:

```bash
# Verificar detección de hardware
python scripts/detect_hardware.py

# Listar modelos cargados
ollama list

# Verificar uso de GPU (durante generación)
rocm-smi  # o nvidia-smi
```

---

🌐 **Idioma:** [English](../Troubleshooting) • [Español](#)
