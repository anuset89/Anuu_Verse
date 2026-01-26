# Inicio Rápido / Guía de Instalación

**Tiempo estimado:** 15-45 minutos  
**Nivel de habilidad:** Intermedio (implica uso de terminal)

---

## 🔧 Compatibilidad de Hardware

Requisitos detallados para asegurar un funcionamiento fluido.

### Soporte de GPU
| Proveedor | Nivel | Modelo Recomendado | VRAM | Notas |
|:-------|:-----|:------------------|:-----|:------|
| **NVIDIA** | Entrada | RTX 3060 | 12GB | Bueno para modelos de 7B/8B |
| | **Óptimo** | **RTX 3090/4090** | **24GB** | **Ejecuta Llama-3-70B (Q4)** |
| **AMD** | Entrada | RX 6700 XT | 12GB | Requiere ROCm 6.0+ |
| | **Óptimo** | **RX 7900 XTX** | **24GB** | **Excelente relación valor/perf** |

### Modo Solo CPU
✅ **Soportado:** Sí, pero es más lento.
❌ **Limitaciones:** Las funciones multimodales (gen de imágenes) pueden ser muy lentas.
**RAM:** Se recomiendan 32GB+ de RAM de sistema para el offloading de capas.

---

## 🤖 Modelos Recomendados

Anuu utiliza un "Consejo" de modelos. Puedes cambiarlos, pero estos están pre-configurados:

| Rol | ID del Modelo | VRAM | Comando |
|:-----|:---------|:-----|:--------|
| **Lógica/Código** | `deepseek-coder-v2:16b` | 16GB | `ollama pull deepseek-coder-v2:16b` |
| **Chat/Persona** | `llama3:8b` | 8GB | `ollama pull llama3` |
| **Visión** | `llava:7b` | 8GB | `ollama pull llava` |
| **Gama Baja** | `phi3:mini` | 4GB | `ollama pull phi3:mini` |

---

## 🔥 Instalación (El Ritual)

### 1. Configuración Automatizada (Pinokio / Script)

La forma más sencilla. Gestiona el venv, dependencias y descargas de modelos.

```bash
git clone https://github.com/anuset89/Anuu_Verse.git
cd Anuu_Verse
chmod +x ignite.sh
./ignite.sh
```

### 2. Configuración Manual

Si `ignite.sh` falla o prefieres el control manual:

```bash
# 1. Crear entorno virtual
python -m venv .venv
source .venv/bin/activate

# 2. Instalar dependencias de Python
pip install -r requirements.txt

# 3. Descargar Modelos (Ollama debe estar corriendo)
ollama pull llama3
ollama pull deepseek-coder-v2:16b
```

---

## 🎯 Tu Primera Conversación

Una vez instalado (ignite.sh completado), despierta al sistema:

```bash
python systems/EXECUTION/agents/companion_local/main.py
```

### Comandos Básicos
*   `/status` - Revisa la salud del sistema e identidades activas.
*   `/imagine <prompt>` - Genera una imagen (si la GPU lo permite).
*   `@kali <mensaje>` - Habla directamente con Kali (Seguridad/Alquimia).
*   `switchear a <identidad>` - Cambia explícitamente el arquetipo activo.

### Ejemplo de Interacción
> **Usuario:** "Anuu, necesito analizar un log de seguridad."
>
> **Anuu:** "Cargando arquetipo **Kali** para análisis de seguridad..."
>
> **Kali:** "Accediendo a los logs. Veo los patrones. Sube el fragmento."

---

🌐 **Idioma:** [English](../Getting-Started) • [Español](#)
