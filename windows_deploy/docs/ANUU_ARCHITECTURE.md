# Arquitectura de Flujo Cognitivo de Anuu (ACE-01)

Este diagrama representa el flujo de información desde la entrada del usuario hasta la manifestación final en el Dashboard.

```mermaid
graph TD
    %% Nodos Principales
    User([👤 User Input])
    Router{🔀 Intent Router<br>(The Cortex)}
    Memory[(🧠 Memory & Context)]
    
    %% Rutas de Procesamiento
    subgraph Cognitive_Core [The Ace Graph]
        LLM[🤖 Language Model<br>(Ollama / ACE)]
        Auditor[🛡️ Auditor<br>(Self-Correction)]
    end
    
    subgraph Creative_Nexus [Multimodal Nexus]
        ImgGen[🎨 Image Generator<br>(ComfyUI: PonyXL)]
        VidGen[🎬 Video Generator<br>(ComfyUI: AnimateDiff)]
        AudioGen[🗣️ Audio Synth<br>(Edge-TTS)]
    end
    
    %% Flujo 
    User --> Memory
    Memory --> LLM
    LLM --> Router
    
    %% Routing Logic based on Agent.py
    Router -- "Text Response" --> Output([📝 Final Output])
    Router -- "/imagine" --> ImgGen
    Router -- "/anime" --> VidGen
    Router -- "/speak" --> AudioGen
    
    %% Aggregation
    ImgGen --> Output
    VidGen --> Output
    AudioGen --> Output
    
    %% Feedback Loop
    Output -.-> Memory
```

## Descripción de Componentes

1.  **Chat (Input)**: El usuario envía un mensaje o comando desde el Nexus Dashboard.
2.  **LM (Cognition)**: El **ACE Graph** procesa el contexto y genera la respuesta textual base.
3.  **Router (Cortex)**: Analiza tanto el input original como la respuesta del LM para detectar intenciones creativas (`/imagine`, `/anime`, `/speak`) y referencias implícitas ("Genérala").
4.  **Nexus (Manifestation)**:
    *   **Imágenes**: Llamada a la API de ComfyUI (Workflow `txt2img_pony`).
    *   **Video**: Llamada a la API de ComfyUI (Workflow `txt2vid_animatediff`).
    *   **Audio**: Síntesis de voz directa.
5.  **Output**: Se combina el texto y los enlaces a los medios generados (`/generations/...`) para su visualización en el Dashboard.
