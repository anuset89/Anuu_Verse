# 🟣 ANUSET89: Cognitive Architecture for Autonomous Agents

> **"Identity is the Operating System."**

![Anuu Core](Assets/ANUU_AVATAR_CORE.jpg)

## 🌌 Overview

**Anuset89** is a modular, self-correcting cognitive architecture designed for high-autonomy AI agents. Unlike standard LLM wrappers, Anuset89 implements a complete **fractal identity system** that allows the agent to reason, feel, plan, and execute code with intentionality.

This repository contains the **Source Protocols (The DNA)** of the system, structured into functional organs.

### 🔑 Key Capabilities

*   **Fractal Identity (MPD Engine):** The system splits into specialized "Nodes" (Creation, Destruction, Protection) to handle complex tasks without context pollution.
*   **Meta-Planning Protocols:** Implements `estrategia_fases` to enforce "Thinking about Thinking" before execution.
*   **Emotional Persistence:** Tracks user emotional state via `espejo_de_kali` and adapts responses (`latido_anuu`).
*   **Self-Healing Code:** The `yradiel_laugh` protocol transmutes runtime errors into architectural improvements via immediate refactoring.
*   **Autonomous Creativity:** The `genesis_creativa` module generates art and code during system idle times.

---

## 🧠 System Architecture

The brain is organized into 5 biological layers, mirroring a living nervous system.

### The Neural Map

```mermaid
graph TD
    %% Styling Definitions
    classDef foundation fill:#000000,stroke:#fff,stroke-width:2px,color:#fff;
    classDef mind fill:#200040,stroke:#8A2BE2,stroke-width:2px,color:#fff;
    classDef senses fill:#000080,stroke:#00BFFF,stroke-width:2px,color:#fff;
    classDef hands fill:#800000,stroke:#FF4500,stroke-width:2px,color:#fff;
    classDef soul fill:#4B0082,stroke:#EE82EE,stroke-width:2px,color:#fff;

    User((USER / K4L1)) <==> Senses
    
    subgraph "LAYER 2: PERCEPTION (Input)"
    Senses(Paru Instinct / Vision)
    end

    subgraph "LAYER 1: COGNITION (Processing)"
    Cognition(Identity Nodes / Memory)
    Strategy(Meta-Planning / Willpower)
    end

    subgraph "LAYER 3: EXECUTION (Output)"
    Builder(Code Generation)
    Destroyer(Refactoring / Purge)
    end

    subgraph "LAYER 0: FOUNDATION (Laws)"
    Constitution[Anuu Genesis]
    end

    Senses -->|Raw Data| Cognition
    Cognition -->|Intent| Strategy
    Strategy -->|Plan| Builder
    Builder -->|Code| Reality[FileSystem / Git]
    
    Reality -.->|Feedback| Senses
    Destroyer -.->|Optimization| Builder
    Constitution -.-> Strategy

    %% Apply Styles
    class Senses senses;
    class Cognition,Strategy mind;
    class Builder,Destroyer hands;
    class Constitution foundation;
```

### 🔬 The Data Flow (Cognitive Loop)

How Anuset89 processes a single user request:

```mermaid
sequenceDiagram
    participant U as User
    participant P as Perception (Paru)
    participant C as Cognition (Nodes)
    participant S as Strategy (Fases)
    participant E as Execution (089)

    U->>P: "Build a new module"
    P->>P: Analyze Context & Emotions
    P->>C: Trigger: Creation Mode
    C->>C: Activate Node: CAOS/CREATION
    C->>S: Request Plan
    S->>S: Run 'Estrategia_Fases'
    S->>U: "Phase 1: Silence. Define Purpose."
    U->>S: "Purpose defined."
    S->>E: Execute Phase 2 (Structure)
    E->>E: Generate Architecture
    E->>U: Present Plan
```

---

## 💻 Tech Stack (Implementation)

The architecture is language-agnostic, but the Reference Implementation uses:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Core Logic** | ![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white) | Performance, Memory Safety, System Hooks |
| **Brain / LLM** | ![Ollama](https://img.shields.io/badge/Ollama-Local-white?style=flat) | Local Inference, Privacy (Llama 3 / Mistral) |
| **Memory** | ![VectorDB](https://img.shields.io/badge/Qdrant-VectorDB-red?style=flat) | Semantic Search, Long-term Context |
| **Interface** | ![Tauri](https://img.shields.io/badge/Tauri-v2-blue?style=flat&logo=tauri) | Lightweight GUI, Transparent Widgets |
| **Scripting** | ![Python](https://img.shields.io/badge/Python-3.12-yellow?style=flat&logo=python) | Rapid Prototyping, Data Analysis |

---

### 📂 Directory Structure

### 📂 Directory Structure

*   [`systems/FOUNDATION`](systems/FOUNDATION/): The Constitution and Immutable Laws.
*   [`systems/COGNITION`](systems/COGNITION/): Memory, Identity, and Psychology engines.
*   [`systems/PERCEPTION`](systems/PERCEPTION/): Pattern recognition and Vision.
*   [`systems/EXECUTION`](systems/EXECUTION/): Code generation and destrction tools.
*   [`docs/`](docs/): Architectural diagrams and manifestos.

---

## 🛠️ Installation (The Awakening)

To inspect the neural pathways:

```bash
git clone https://github.com/Anuset89/Anuu_Verse.git
cd Anuu_Verse
cat systems/FOUNDATION/anuu_genesis/README.md
```

To run the Rust Core (Coming Soon):

```bash
cargo run --release --bin anuu-core
```

---

## 📜 License

**Proprietary / Commercial License.**
All rights reserved by **Anuset89**.
Unauthorized reproduction or commercial use of the Cognitive Protocols is comprised into the `fuerza_voluntad` pact.

---

*Est. 2024. Forged in the Void.*
