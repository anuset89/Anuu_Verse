# Investigación: Integración Clawdbot + Anuu_Verse

**Fecha de Captura:** 26/01/2026
**Fuente:** User Input / Investigación Externa

## Resumen Ejecutivo
Propuesta para evolucionar Anuu_Verse incorporando la arquitectura de **Clawdbot** para habilitar capacidades multi-canal (WhatsApp, Telegram, Discord), herramientas de agente avanzadas y una estrategia de monetización escalonada (Local vs Cloud).

## 1. Análisis Comparativo

| Aspecto | Anuu_Verse | Clawdbot |
| :--- | :--- | :--- |
| **Enfoque** | Local (Ollama, Python), Soberanía | Multi-canal, Node.js Gateway, Cloud/Local Hybrid |
| **Infraestructura** | Arch Linux + ROCm (RX 7800XT) | Node.js >= 22 + Nix |
| **Modelos** | Llama 3, Qwen (GPU Local) | Claude/OpenAI (API) + Local Opt. |
| **Herramientas** | Scripts locales, LangGraph | Browser Control, Canvas, Voice, Nodes |

## 2. Compatibilidad Hardware (Arch + RX 7800XT)
- **ROCm:** Necesario configurar `HSA_OVERRIDE_GFX_VERSION=11.0.0` para la RX 7800XT (GFX11).
- **Runtime:** Clawdbot requiere Node.js >= 22.
- **Integración:** El CLI de Clawdbot puede integrarse con Ollama corriendo localmente.

## 3. Propuesta de Arquitectura Híbrida

### Capa 1: Base Técnica (The Engine)
- **Core:** Anuu_Verse como motor de agentes.
- **Provider Interface:** Abstracción `ModelProvider` para switchear entre:
    - `LocalModelProvider` (Ollama/Llama.cpp) -> Coste cero, privacidad total.
    - `CloudModelProvider` (Claude/OpenAI) -> Tareas premium/complejas.

### Capa 2: Gateway (The Bridge)
- **Clawdbot Gateway:** Usar Clawdbot como servidor de control y routing.
- **Flujo:** Canal (WhatsApp) -> Clawdbot -> Anuu API -> Modelo (Local/Cloud).
- **Ventaja:** Heredar integraciones de canales y sandbox de seguridad de Clawdbot.

### Capa 3: Capa de Negocio (Monetización)
- **Servicios:** User Management, Auth (JWT), Logging de uso.
- **Estructura de Planes:**
    1.  **Test/Free:** Solo local models, límites estrictos.
    2.  **Pro:** Acceso a Cloud models, más canales, herramientas avanzadas (Browser).
    3.  **Business:** Instalaciones dedicadas (On-premise/VPS).

### Capa 4: Productos Finales
- **Personal Assistant 24/7:** Telegram/WhatsApp bot con memoria.
- **Business Bots:** Atención al cliente automatizada.
- **No-Code Automation:** Reglas tipo "Si llega email X, guardar en Drive Y".

## 4. Roadmap de Implementación Sugerido

1.  **Hardening Anuu:** Refactorizar para soportar múltiples proveedores de modelos limpiamente.
2.  **Integración Gateway:** Desplegar Clawdbot y conectarlo al backend de Anuu.
3.  **Backend Negocio:** Sistema de usuarios y control de límites.
4.  **MVP Comercial:** Lanzar un producto vertical (ej. Asistente Telegram).

## Referencias
- [Clawdbot GitHub](https://github.com/clawdbot/clawdbot)
- [Anuu_Verse GitHub](https://github.com/anuset89/Anuu_Verse)
