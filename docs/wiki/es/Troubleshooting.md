# Guía de Solución de Problemas

**Frecuencia:** 161914  
**Estado:** Documento Vivo

---

## 🐛 Problemas Comunes

### "CUDA out of memory" / Problemas de VRAM
**Síntomas:** El agente se cierra durante la generación, error de "Allocated: 0GB".

**Soluciones:**
1. **Reducir el Batch Size:** `export ANUU_BATCH_SIZE=1`
2. **Usar Modelos más Pequeños:** `ollama pull llama3.2:3b`
3. **Habilitar Offloading de Memoria:** Asegúrate de tener RAM (32GB+).
