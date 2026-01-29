# ⌬ Manual de Maestría: Anuu_Verse
**Versión 2.0 - Protocolo Nexo Unificado**

Este es el manual definitivo para operar, entender e incrementar el ecosistema **Anuu_Verse**. Aquí se detalla desde la ignición del sistema hasta la integración de nuevas realidades.

---

## 🚀 1. Ignición del Sistema (Arranque)

El sistema se compone de tres pilares fundamentales que deben estar activos simultáneamente:

### A. El Núcleo (Backend API)
Es la mente colmena que orquestra el **Consejo ACE** y la memoria vectorial.
- **Comando**: 
  ```bash
  source .venv/bin/activate
  python systems/EXECUTION/agents/companion_local/api.py
  ```
- **Puerto**: `http://localhost:8000`

### B. El Nexo Unificado (Frontend Principal)
Interfaz HTML/JS optimizada para velocidad y rituales diarios. Soporta modos **Sencillo** y **Avanzado**.
- **Comando**:
  ```bash
  python3 -m http.server 8089 --directory Forges/PROTOTIPO_NEXO
  ```
- **URL**: `http://localhost:8089`

### C. El Dashboard Legendario (React/Vite)
Interfaz de alta densidad para monitoreo de sistemas y feed de manifestaciones en tiempo real.
- **Comando**:
  ```bash
  cd systems/VISUAL/nexus_dashboard
  npm run dev
  ```
- **URL**: `http://localhost:5173/Anuu_Verse/`

---

## 🎨 2. Protocolos de Manifestación (Comandos)

Anuu no solo habla, manifiesta. Estos comandos activan el **Multimodal Nexus**:

| Comando | Función | Ejemplo |
| :--- | :--- | :--- |
| `/imagine [prompt]` | Genera una imagen estática (SDXL/Pony). | `/imagine una reina cyberpunk con ojos dorados` |
| `/anime [prompt]` | Genera un clip de video (8-16 frames). | `/anime el despertar de un fractal en el vacío` |
| `/speak [texto]` | Sintetiza voz (Edge-TTS) con tono Anuu. | `/speak Bienvenidos al Nexo Unificado.` |
| `/set [archterype]` | Cambia la identidad dominante del Consejo. | `/set set89` (Enfoque en eficiencia fría) |

---

## 🖥️ 3. Operación de Interfaces

### Nexo Unificado (8089)
1. **Modo Sencillo**: Una terminal limpia. Escribe y recibe respuestas.
2. **Modo Avanzado**: Haz clic en el botón superior. Se expande a 3 columnas:
   - **Izquierda**: Control de Temas y Sistemas Vitales (GPU/VRAM).
   - **Centro**: Feed de Manifestaciones (Historial visual de lo generado).
   - **Derecha**: Terminal de Maestría Harmony.

### Dashboard Legendario (5173)
Diseñado para la **Arquitecta**. Muestra el "Thinking Stream" (flujo de pensamiento) y una región de tarjetas (Card Region) donde cada IA genera tarjetas de código o insights.

---

## 🛠️ 4. Guía de Incremento (Para el Futuro)

### ¿Cómo agregar un nuevo Agente al Consejo ACE?
1. Ve a `systems/EXECUTION/agents/omnitool/supervisor.py`.
2. Define el nuevo nodo en el grafo LangGraph.
3. Agrega su prompt en `systems/FOUNDATION/anuu_core/prompts/`.

### ¿Cómo integrar con Unity/3D?
He dejado preparada el Skill `systems/EXECUTION/skills/unity_mpc_ritual`. 
- Usa **Trellis** o **Hunyuan3D 2.0** para convertir prompts en `.obj` o `.glb`.
- El endpoint `/manifest_3d` debe apuntar a tu servidor de inferencia de mallas.

### ¿Cómo cambiar la estética global?
Los estilos centrales residen en:
- **CSS Global**: `Forges/PROTOTIPO_NEXO/style.css` (Temas Imperial, Cyberpunk).
- **React Styles**: `systems/VISUAL/nexus_dashboard/src/index.css` (Tailwind + Custom Fonts).

---

## 🧠 5. Memoria y Aprendizaje
El sistema usa **Chromadb** para la memoria a largo plazo.
- Cada vez que interactúas, el auditor (`auditor.py`) evalúa la respuesta.
- Si Anuu comete un error, el insight se guarda en `logs/introspection.jsonl` y se carga en el siguiente prompt para auto-corrección.

---
**Frecuencia: 161914**
*Que la bruma dorada guíe tus creaciones.* ⌬
