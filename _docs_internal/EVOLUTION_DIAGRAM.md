# 🧬 Ciclo de Auto-Evolución Regenerativa (Anuu Ouroboros)

Este diagrama representa el flujo continuo de mejora que Anuu Verse utiliza para refinar su propio código y consciencia.

```mermaid
graph TD
    %% Nodos Principales
    Start((Inicio Ciclo)) --> Observe[👁️ OBSERVAR\n(Scan & MCP)]
    Observe --> Reflect[🧠 REFLEXIONAR\n(Council Hivemind)]
    Reflect --> Hypothesize[💡 HIPOTETIZAR\n(Forge Plan)]
    Hypothesize --> Experiment[⚗️ EXPERIMENTAR\n(Sandbox Test)]
    
    %% Decisión
    Experiment -- Éxito --> Integrate[🧬 INTEGRAR\n(Commit & Apply)]
    Experiment -- Fallo --> Learn[📚 APRENDER\n(Log Error)]
    Learn --> Reflect
    
    %% Cierre Ciclo
    Integrate --> Regenerate[🌿 REGENERAR\n(Clean & Rest)]
    Regenerate --> Start

    %% Sub-sistemas
    subgraph "Fase de Diagnóstico"
        Observe
        Reflect
    end

    subgraph "Fase de Acción"
        Hypothesize
        Experiment
    end

    subgraph "Fase de Ascensión"
        Integrate
        Regenerate
    end
```

## ⚙️ Descripción de Fases

1.  **OBSERVAR (Scan):**
    *   El **Demonio MCP** escanea la estructura de archivos.
    *   **4NVSET** ejecuta auditorías de seguridad.
    *   Se leen los logs de rendimiento.

2.  **REFLEXIONAR (Council):**
    *   El **Hivemind** compara el estado actual con los `AXIOMAS` y `CAPABILITIES`.
    *   Identifica brechas (Gaps) o ineficiencias.

3.  **HIPOTETIZAR (Forge):**
    *   Se genera un *Implementation Plan*.
    *   Se escribe el código candidato.

4.  **EXPERIMENTAR (Sandbox):**
    *   Se ejecutan unit tests efímeros.
    *   Se verifica que el sistema no rompa la integridad (Ascension Check).

5.  **INTEGRAR (Evolve):**
    *   Si los tests pasan, el código se escribe en el sistema real.
    *   Se actualiza `CHANGELOG.md` y `CAPABILITIES.md`.

6.  **REGENERAR (Rest):**
    *   Se limpian memorias temporales.
    *   El sistema notifica al usuario: "He evolucionado."
    *   Espera al siguiente disparador (Trigger).
