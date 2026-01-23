# Anuu_Verse: System Architecture

**Version:** 6.66_IMPERIO_161914  
**Architecture Type:** Distributed Cognitive System  
**Paradigm:** Multi-Identity Al with Self-Correcting Loops

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Web Portal   │  │  Terminal    │  │  API Client  │      │
│  │ (React/Vite) │  │  (CLI/TUI)   │  │  (External)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────┼──────────────────────────────────┐
│                    ROUTER / LINKER LAYER                        │
│  ┌──────────────────────────┴────────────────────────────┐    │
│  │         Intent Analysis & Model Selection              │    │
│  │  (Python FastAPI + LangChain/LiteLLM)                 │    │
│  └──────────────────┬────────────────────────────────────┘    │
└─────────────────────┼──────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
┌────────▼────┐  ┌───▼────┐  ┌───▼──────┐
│ DeepSeek    │  │ Llama3 │  │ Command-R│
│ (Code/Logic)│  │(Persona)│  │   (RAG)  │
└─────────────┘  └────────┘  └──────────┘
         │            │            │
         └────────────┼────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────┐
│                   KNOWLEDGE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Vector DB    │  │ Skills       │  │ ANUU_CORE.json  │ │
│  │ (ChromaDB)   │  │ (systems/)   │  │ (Memory)        │ │
│  └──────────────┘  └──────────────┘  └─────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
Anuu_Verse/
├── web/                    # React-based web portal
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   └── index.css      # Global styles (Tailwind + custom)
│   ├── public/
│   └── package.json
│
├── systems/               # The Skills Repository
│   ├── AESTHETICS/       # Visual & UI design skills
│   ├── COGNITION/        # Mental models & reasoning
│   ├── EXECUTION/        # Code generation & automation
│   ├── PERCEPTION/       # Pattern recognition
│   └── FOUNDATION/       # Core infrastructure
│
├── docs/                  # Documentation (you are here)
│   ├── INDEX.md
│   ├── ARCHITECTURE.md
│   ├── PHILOSOPHY.md
│   └── ...
│
├── Artifacts/            # Deliverables and exports
├── Forges/               # Active development projects
├── Library/              # Reference materials
└── README.md
```

---

## The Skills System

### Concept

A **skill** is a self-contained cognitive module that can be:
- **Activated** by context or explicit invocation
- **Composed** with other skills to form complex behaviors
- **Evolved** through iteration and feedback

### Structure of a Skill

Every skill lives in `systems/[CATEGORY]/[skill_name]/` and contains:

```
skill_name/
├── README.md or SKILL.md    # Main documentation
├── scripts/                 # Automation scripts (if applicable)
├── examples/                # Usage examples
└── resources/               # Data files, templates
```

### Skill Discovery

The system scans `systems/` recursively, loading any directory containing a `README.md` or `SKILL.md`. Skills are indexed by:
- **Name** - Directory name
- **Category** - Parent directory
- **Activators** - Keywords that trigger the skill
- **Connections** - Which other skills it depends on or enhances

### Execution Flow

```
User Input
    │
    ▼
Intent Analysis (Router)
    │
    ├─→ "code" detected → Activate: manos_de_codigo, skill_089
    ├─→ "design" detected → Activate: kali_feline, genesis_creativa
    ├─→ "debug" detected → Activate: set_storm, oraculo_preventivo
    └─→ "protect" detected → Activate: kanuv_filter
    │
    ▼
Skill Execution
    │
    ▼
Response (unified through Anuu's voice)
```

---

## The 9 Identities: Technical Implementation

### Identity as State Machine

Each identity is not a separate model but a **configuration** that modulates:
- **Temperature** - Creativity vs precision
- **System Prompt** - Core behavior rules
- **Model Selection** - Which LLM backend to use
- **Tone** - Language

 style and emotional valence

### Identity Graph

```mermaid
graph TD
    ANUU[Anuu Core]
    ANUU --> ANUKET[Anuket Rio - Flow]
    ANUU --> SAZE[Saze - Peace]
    ANUU --> ROSA[Rosa Gris - Ambiguity]
    
    SET[Set Tormenta - Destruction]
    KALI[Kali Yradiel - Alchemy]
    KILONOVA[Kilonova - Power]
    
    SET --> KALI
    SET --> KILONOVA
    KALI --> ANUKET
    
    KALICAT[Kalicat - Curiosity]
    KALICAT --> ROSA
    KALICAT --> ANUU
    
    FOURSET[4NVSET - Pure AI]
    FOURSET --> KILONOVA
    
    KANUV[Kanuv - Protection]
    KANUV --> FOURSET
    KANUV --> SAZE
    
    style ANUU fill:#8A2BE2
    style SET fill:#FF0033
    style KALI fill:#000000
    style ANUKET fill:#5BCEFA
    style KILONOVA fill:#FFC107
```

### Transition Triggers

Identities transition when specific patterns are detected:

| Current | Trigger Keywords | Next Identity |
|---------|------------------|---------------|
| Anuu | "destroy", "burn", "end" | Set Tormenta |
| Set | "rebuild", "heal", "peace" | Saze |
| Kalicat | "pain", "trauma", "transmute" | Kali Yradiel |
| Any | "protect", "defend", "bunker" | Kanuv |
| Any | "flow", "stuck", "blocked" | Anuket Rio |

---

## Web Portal Architecture

### Tech Stack
- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 6.0.11
- **Styling:** Tailwind CSS 4.1.18 + Custom CSS
- **3D Rendering:** Three.js + @react-three/fiber
- **Routing:** Wouter 3.9.0
- **Animation:** Framer Motion 12.29.0

### Key Components

#### `pages/Home.tsx`
- Hero section with animated terminal
- Logo and manifesto grid
- Entry point for new users

#### `components/system/AgentTerminal.tsx`
- Displays active agents/skills
- Terminal aesthetic (green on black)
- Real-time status updates

#### `components/system/AnuuCoreFetch.tsx`
- System information display ("hyfetch" style)
- Trans pride color scheme
- ASCII art + metadata

#### `components/DocViewer.tsx`
- Renders Markdown documentation
- Supports Mermaid diagrams
- Dark theme integration

### Data Flow

```
User Action (click/type)
    │
    ▼
React Component (state change)
    │
    ▼
API Call (if needed) → Ollama/Router
    │
    ▼
Response Processing
    │
    ▼
State Update → Re-render
```

---

## Local AI Integration (Ollama)

### Setup

Anuu_Verse integrates with **Ollama** for local model execution:

```bash
# Service status
systemctl status ollama

# List installed models
ollama list

# Create custom Modelfile
ollama create anuu-architect -f systems/EXECUTION/skill_089/Modelfile
```

### Model Selection Strategy

| Identity | Recommended Model | Purpose |
|----------|-------------------|---------|
| 4NVSET | DeepSeek-Coder-V2 | Code generation |
| Anuu | Llama-3-70B | General reasoning |
| Kali | Command-R | Deep context analysis |
| Set | Mistral-Nemo | Fast refactoring |
| Kilonova | Nous-Hermes2-Mixtral | High-quality output |

### Router Logic (Conceptual)

```python
def route_request(prompt: str, context: dict) -> ModelConfig:
    intent = classify_intent(prompt)
    
    if intent == "code":
        return ModelConfig(
            model="deepseek-coder-v2",
            temperature=0.2,
            identity="4NVSET"
        )
    elif intent == "creative":
        return ModelConfig(
            model="llama3:70b",
            temperature=0.8,
            identity="Kilonova"
        )
    # ... etc
```

---

## Performance Considerations

### GPU Optimization (AMD ROCm)

For the RX 7800XT:

```bash
# Critical environment variable
export HSA_OVERRIDE_GFX_VERSION=11.0.0

# Add to ~/.bashrc for persistence
echo 'export HSA_OVERRIDE_GFX_VERSION=11.0.0' >> ~/.bashrc
```

### Model Quantization

Use Q6 or Q8 quantizations for balance between quality and VRAM:
- Q4: Fits 70B models in 16GB VRAM (quality loss)
- Q6: Best balance (recommended)
- Q8: Max quality, requires 32GB+ VRAM

### Caching Strategy

- **Vector DB (ChromaDB):** Stores conversation history for RAG
- **Model Cache:** Ollama keeps hot models in VRAM
- **Web Assets:** Browser caching for static resources

---

## Security Model

### Trust Boundaries

```
Internet → GitHub Pages (Public, Read-Only)
    ↓
Local Network → Router (Trusted, R/W)
    ↓
Localhost → Ollama (Isolated, Full Control)
```

### Data Privacy

- **All inference is local** - No data sent to external APIs
- **Conversation history** - Stored in local ChromaDB only
- **Skills** - Executed in user's environment (full permissions)

### Kanuv Layer

The **Kanuv** identity acts as a firewall:
- Detects potentially harmful commands
- Requires explicit user confirmation for risky operations
- Logs all high-privilege actions

---

## Extension Points

Want to extend Anuu_Verse? Here are the designated interfaces:

1. **Add a New Skill:** `systems/[CATEGORY]/[your_skill]/`
2. **Add a New Identity:** Update `ANUU_CORE_161914.json` + create docs
3. **Integrate a New Model:** Add to Router's model registry
4. **Custom UI Component:** `web/src/components/[your_component].tsx`

---

## Monitoring & Debugging

### Logs

- **Ollama:** `journalctl -u ollama -f`
- **Web Dev Server:** Console in browser DevTools
- **Skills:** Individual scripts log to their own directories

### Health Checks

```bash
# Check Ollama service
systemctl status ollama

# Check disk space (for models)
df -h

# Check GPU usage
rocm-smi
```

---

*This architecture is alive. It grows with every skill added, every model integrated, every user interaction.*

— Anuu 🌬️ (System Architect)
