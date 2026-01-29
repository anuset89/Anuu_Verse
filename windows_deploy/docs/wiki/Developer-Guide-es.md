# 🛠️ Developer Guide: Anuu_Verse

**Target Audience:** Developers who want to extend, integrate, or contribute to Anuu_Verse.

---

## 🏗️ Architecture Overview

Anuu_Verse is a **Multi-Agent Cognitive Framework** with three layers:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌──────────────┐   ┌──────────────┐                    │
│  │   Web UI     │   │  REST API    │                    │
│  │  (React)     │   │  (FastAPI)   │                    │
│  └──────────────┘   └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   ORCHESTRATION LAYER                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │     LangGraph Coordinator                        │   │
│  │  • Routes tasks to appropriate identity          │   │
│  │  • Manages context & state                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     COGNITIVE LAYER                      │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐           │
│  │ANUU │  │KALI │  │ SET │  │KILO │  │ ... │  (9 IDs)  │
│  │Core │  │Sec  │  │Anal │  │Crea │  │     │           │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                     │
│  ┌──────────────┐   ┌──────────────┐                    │
│  │  ChromaDB    │   │  Local LLM   │                    │
│  │ (Vectors)    │   │  (Ollama)    │                    │
│  └──────────────┘   └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

```
Anuu_Verse/
├── systems/                    # Core cognitive systems
│   ├── FOUNDATION/            # Base infrastructure
│   │   └── anuu_core/         # Memory & core utilities
│   │       └── memory.py      # Vector DB interface
│   ├── PERCEPTION/            # Input processing
│   ├── COGNITION/             # Decision making
│   ├── EXECUTION/             # Output generation
│   │   └── agents/
│   │       └── companion_local/
│   │           ├── main.py    # FastAPI server
│   │           └── agent.py   # AnuuCompanion class
│   └── AESTHETICS/            # Style & presentation
│
├── web/                       # React frontend
│   ├── src/
│   │   ├── pages/             # Main views
│   │   └── components/        # Reusable UI
│   └── public/                # Static assets
│
├── examples/                  # Executable demos
│   ├── basic_task.py
│   └── agent_selection.py
│
├── docs/                      # Documentation
│   ├── INDEX.md               # Main entry point
│   ├── JOURNEY.md             # Development log
│   └── identities/            # Identity specs
│
└── Library/                   # Shared utilities
```

---

## 🧩 Core Components

### 1. Memory System (`systems/FOUNDATION/anuu_core/memory.py`)

**Purpose:** Persistent context storage using vector embeddings.

**Interface:**
```python
class MemoryCore:
    def store_memory(text: str, metadata: dict) -> str:
        """Store a memory fragment. Returns memory ID."""
        
    def recall(query: str, n_results: int = 3) -> List[str]:
        """Retrieve relevant memories via semantic search."""
```

**Usage:**
```python
from systems.FOUNDATION.anuu_core.memory import anuu_memory

# Store
mem_id = anuu_memory.store_memory(
    "User prefers dark mode",
    metadata={"category": "preferences"}
)

# Recall
results = anuu_memory.recall("What does user like?")
```

### 2. Agent System (`systems/EXECUTION/agents/companion_local/agent.py`)

**Purpose:** Identity-based task processing.

**Interface:**
```python
class AnuuCompanion:
    def process(message: str, archetype: str = "anuset") -> str:
        """Process message through specified identity."""
```

**Current Identities:**
- `anuset` (default) — Balanced, general-purpose
- `kali` — Security/pentesting focus
- `set` — Deep analysis
- `kilonova` — Creative generation

### 3. API Server (`systems/EXECUTION/agents/companion_local/main.py`)

**Endpoints:**
```
GET  /              → Health check
POST /chat          → Process message
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Analyze this security issue",
    "archetype": "kali",
    "user_id": "user_123"
  }'
```

---

## 🔧 How To: Add a New Identity

### Step 1: Create Identity Configuration

Create `systems/EXECUTION/agents/[identity_name]/config.py`:

```python
IDENTITY_CONFIG = {
    "name": "researcher",
    "system_prompt": """
    You are a meticulous research assistant.
    Your role: synthesize information from multiple sources.
    """,
    "tools": ["web_search", "summarize"],
    "temperature": 0.3,  # Lower for precision
}
```

### Step 2: Register in Agent Class

Update `agent.py`:

```python
IDENTITY_REGISTRY = {
    "anuset": {...},
    "kali": {...},
    "researcher": RESEARCHER_CONFIG,  # Add yours
}
```

### Step 3: Document in `docs/identities/`

Create `docs/identities/RESEARCHER.md`:

```markdown
# Researcher Identity

**Domain:** Information synthesis
**Specialty:** Multi-source analysis
**Use Case:** Academic research, fact-checking
```

### Step 4: Add Example

Create `examples/researcher_demo.py`:

```python
from systems.EXECUTION.agents.companion_local import AnuuCompanion

anuu = AnuuCompanion()
result = anuu.process(
    "Summarize recent papers on multi-agent systems",
    archetype="researcher"
)
print(result)
```

---

## 🔌 How To: Integrate a New LLM Backend

Currently using Ollama (mocked). To add a real integration:

### Step 1: Create Backend Adapter

Create `systems/FOUNDATION/anuu_core/llm_backends/ollama.py`:

```python
import ollama

class OllamaBackend:
    def __init__(self, model: str = "llama3"):
        self.model = model
    
    def generate(self, prompt: str) -> str:
        response = ollama.chat(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response['message']['content']
```

### Step 2: Update Agent to Use Backend

In `agent.py`:

```python
from systems.FOUNDATION.anuu_core.llm_backends.ollama import OllamaBackend

class AnuuCompanion:
    def __init__(self):
        self.llm = OllamaBackend(model="llama3")
    
    def process(self, message: str, archetype: str) -> str:
        prompt = f"[{archetype}]: {message}"
        return self.llm.generate(prompt)
```

### Step 3: Test

```bash
# Make sure Ollama is running
ollama serve

# Run example
python examples/basic_task.py
```

---

## 🐳 Development Environment

### Option 1: Local Python

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python systems/EXECUTION/agents/companion_local/main.py
```

### Option 2: Docker (Recommended)

```bash
docker-compose up
# API: http://localhost:8000
# Web: http://localhost:3000
```

---

## 🧪 Testing

### Run Unit Tests

```bash
pytest tests/
```

### Test a Specific Module

```bash
pytest tests/test_memory.py -v
```

### Integration Test (Full System)

```bash
python tests/integration/test_full_flow.py
```

---

## 📊 Performance Considerations

### Memory Usage
- ChromaDB keeps vectors in memory → RAM scales with history
- Consider periodic cleanup or archiving for long-running instances

### LLM Latency
- Local models: 1-5s response time (depends on GPU)
- Cloud fallback: Add timeout parameters

### Concurrency
- FastAPI handles concurrent requests
- LangGraph manages agent coordination
- Memory writes are sequential (ChromaDB limitation)

---

## 🤝 Contributing Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Anuu_Verse.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-new-identity
   ```

3. **Make Changes**
   - Add code
   - Update docs
   - Add tests

4. **Test Locally**
   ```bash
   pytest tests/
   python examples/basic_task.py
   ```

5. **Submit PR**
   - Clear description
   - Link to issue if applicable
   - Request review

---

## 🐛 Debugging Tips

### Issue: Memory not persisting
**Solution:** Check `memory_db/` directory exists and has write permissions

### Issue: LLM not responding
**Solution:** 
```bash
# Check Ollama is running
curl http://localhost:11434/api/version

# Check model is available
ollama list
```

### Issue: Web UI not loading
**Solution:**
```bash
cd web
npm install
npm run dev
```

---

## 📚 Further Reading

- [Architecture Deep Dive](./ARCHITECTURE.md)
- [Philosophy](./PHILOSOPHY.md)
- [Identity System](./identities/README.md)
- [API Reference](https://anuset89.github.io/Anuu_Verse/)

---

**Questions?** Open a [Discussion](https://github.com/anuset89/Anuu_Verse/discussions) or check [CONTRIBUTING.md](../CONTRIBUTING.md).

🟣
