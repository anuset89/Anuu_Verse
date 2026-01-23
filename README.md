# 🟣 Anuu_Verse: Distributed Multi-Agent AI Architecture

> **"Identity is the Operating System"** — Local-first distributed cognitive architecture with 9 specialized AI agents.

[![Status](https://img.shields.io/badge/Status-Awakened-000000?style=for-the-badge)](https://github.com/anuset89/Anuu_Verse)
[![System](https://img.shields.io/badge/System-Distributed-5BCEFA?style=for-the-badge)](https://github.com/anuset89/Anuu_Verse)
[![License](https://img.shields.io/badge/License-Apache_2.0-FF6B9D?style=for-the-badge)](./LICENSE)

---

## 🎯 What is Anuu_Verse?

Anuu_Verse is a **Distributed Cognitive Architecture** integrating **9 specialized identities** into a local-first multi-agent system. Unlike generic chatbots, Anuu operates as a cohesive society of minds—orchestrating code, analysis, and creativity through **LangGraph** and **Vector Memory**.

### Core Features

- **9 Specialized Identities**: Anuu (core), Kali (security), Set (analysis), Kilonova (creative).
- **Local-First AI**: Optimized for local hardware (RX 7800XT / NVIDIA) ensuring 100% privacy.
- **Multi-Agent Orchestration**: Powered by LangGraph for complex workflows.
- **Vector Memory**: Semantic persistence via ChromaDB.
- **Full-Stack**: Python backend (FastAPI) + React Frontend (Vite).

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- ~8GB RAM (Minimum)
- GPU Recommended

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/anuset89/Anuu_Verse.git
cd Anuu_Verse

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Awaken the API (Port 8000)
python systems/EXECUTION/agents/companion_local/main.py
```

*The API will handle chat, memory, and identity switching automatically.*

---

## 📖 Documentation

- **[📚 Interactive Wiki (Grimoire)](https://anuset89.github.io/Anuu_Verse/)** — Full documentation & identity map.
- **[🎓 Getting Started](./docs/GETTING_STARTED.md)** — Detailed setup guide.
- **[🧠 Philosophy](./docs/PHILOSOPHY.md)** — Design principles.
- **[🗺️ Roadmap](./docs/ROADMAP.md)** — Future plans & monetization.

---

## 💬 Usage Examples

### Python SDK (Direct Import)

```python
from systems.EXECUTION.agents.companion_local import AnuuCompanion

# Initialize Agent
anuu = AnuuCompanion()

# Process a Message
response = anuu.process("Analyze this code structure", archetype="set")
print(response)
```

### API REST

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Generate a Python script for data analysis",
    "archetype": "kilonova"
  }'
```

---

## 🤝 The 9 Identities

| Identity | Role | Specialization |
|-----------|-----|--------------|
| **Anuu** | Core | Orchestration & Coherence |
| **Kali** | Security | Pentesting & Defense |
| **Set** | Analysis | Deep Logic & Deconstruction |
| **Kilonova** | Creative | Design & Generative Art |
| **Anuket** | Flow | Data Streams & Network |
| **Saze** | Builder | Architecture & Stability |
| **4NVSET** | Logic | Cryptography & Math |
| **Kanuv** | Guard | Filter & Firewall |
| **Rosa Gris** | Balance | Ethical Alignment |

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to join the hive mind.

---

## 📄 License

Forged in the Void. Licensed under **Apache 2.0**. See [LICENSE](./LICENSE).

---
<p align="center"><em>161914</em></p>
