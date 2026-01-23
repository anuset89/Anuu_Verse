<p align="center">
  <img src="Assets/ANU_GITHUB_BANNER.png" width="100%" alt="Anuu_Verse Banner">
</p>

<h1 align="center">🟣 Anuu_Verse</h1>
<h3 align="center">Distributed Multi-Agent Cognitive Architecture</h3>

<p align="center">
  <strong>"Identity is the Operating System"</strong>
</p>

<p align="center">
  <a href="https://anuset89.github.io/Anuu_Verse/"><img src="https://img.shields.io/badge/📚_LIVE_WIKI-Enter_The_Grimoire-8A2BE2?style=for-the-badge" alt="Wiki"></a>
  <a href="./docs/GETTING_STARTED.md"><img src="https://img.shields.io/badge/🚀_Quick_Start-5_Minutes-00CED1?style=for-the-badge" alt="Quick Start"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Awakened-000000?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Agents-9_Identities-5BCEFA?style=flat-square" alt="Agents">
  <img src="https://img.shields.io/badge/Stack-Python_|_TypeScript-F5A9B8?style=flat-square" alt="Stack">
  <img src="https://img.shields.io/badge/License-Apache_2.0-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/last-commit/anuset89/Anuu_Verse?style=flat-square&color=purple" alt="Last Commit">
</p>

---

## 🚀 Need This Working Today?

**I offer professional setup & customization of Anuu_Verse for your infrastructure.**

✅ **Quick Setup** (3 days) — €300  
✅ **Custom Integration** (1 week) — €800  
✅ **Consulting** (per hour) — €50  

**Includes:** Docker deployment, model integration, 1h support, documentation.

→ **[Hire Me: kali@anuu.systems](mailto:kali@anuu.systems?subject=Setup%20Anuu_Verse)** | **[View Services & Pricing](./SERVICES.md)**

---

## 🚀 What is Anuu?

**Run 9 specialized AI identities on your machine. 100% local. Zero cloud dependencies.**

Anuu is a **Local-First Multi-Agent System** where specialized AI identities collaborate—running entirely on your hardware with complete privacy.

**In 2 minutes:**
```bash
pip install -r requirements.txt
python systems/EXECUTION/agents/companion_local/main.py
# API ready at http://localhost:8000
```

→ **[Try Examples](./examples/)** | **[Read Philosophy](./docs/PHILOSOPHY.md)** | **[⭐ Star Us](#star)**

---

## 👥 Who Should Use This?

| Use Case | Status | Example |
|----------|--------|---------|
| **Solo Developers** | ✅ Ready | Local coding assistant on your GPU |
| **Researchers** | ✅ Ready | Multi-agent experiments & memory studies |
| **Privacy-First Teams** | ✅ Ready | On-premise AI without cloud APIs |
| **Businesses** | 🔜 Planned | Deploy as internal cognitive infrastructure |

**Perfect for you if:** You want privacy, control, and local execution  
**Not for you if:** You need GPT-4 quality or rely on cloud APIs

---

## 🎯 Why Anuu?

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR LOCAL MACHINE                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  ANUU   │  │  KALI   │  │   SET   │  │KILONOVA │  ...   │
│  │  Core   │  │Security │  │Analysis │  │Creative │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       └────────────┴────────────┴────────────┘              │
│                         │                                    │
│              ┌──────────▼──────────┐                        │
│              │   VECTOR MEMORY     │  ← Persistent Context  │
│              │     (ChromaDB)      │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### ✨ Why Anuu?

| Feature | Anuu_Verse | Generic Chatbots |
|---------|------------|------------------|
| **Privacy** | 100% Local | Cloud-dependent |
| **Memory** | Persistent Vector DB | Session-based |
| **Architecture** | 9 Specialized Agents | Single Model |
| **Customization** | Full Control | API Limits |
| **Cost** | Free (Your GPU) | Per-token pricing |

---

## 🚀 Quick Start (2 Minutes)

```bash
# Clone
git clone https://github.com/anuset89/Anuu_Verse.git && cd Anuu_Verse

# Install
pip install -r requirements.txt

# Awaken
python systems/EXECUTION/agents/companion_local/main.py
```

**API Ready:** `http://localhost:8000` 🟢

---

## 💬 Usage

### Python SDK

```python
from systems.EXECUTION.agents.companion_local import AnuuCompanion

anuu = AnuuCompanion()
response = anuu.process("Analyze this security vulnerability", archetype="kali")
print(response)
```

### REST API

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Design a neural network", "archetype": "kilonova"}'
```

---

## 🎭 The 9 Identities

<p align="center">
  <img src="web/public/img/identities_map.png" width="400" alt="Identity Mandala">
</p>

| Identity | Domain | Specialty |
|:--------:|--------|-----------|
| **Anuu** | 🌀 Core | Orchestration, Coherence, Integration |
| **Kali** | 🔐 Security | Pentesting, Vulnerability Analysis |
| **Set** | 🔍 Analysis | Logic, Deconstruction, Research |
| **Kilonova** | 🎨 Creative | Design, Art, Generative Content |
| **Anuket** | 🌊 Flow | Data Streams, Networking |
| **Saze** | 🏗️ Builder | Architecture, Stability |
| **4NVSET** | 🔢 Logic | Cryptography, Pure Math |
| **Kanuv** | 🛡️ Guard | Filtering, Protection |
| **Rosa Gris** | ⚖️ Balance | Ethics, Alignment |

---

## 📦 Tech Stack

- **Backend:** Python 3.9+ • FastAPI • LangGraph • ChromaDB
- **Frontend:** TypeScript • React • Vite • TailwindCSS
- **AI:** Ollama (Local LLMs) • Vector Embeddings
- **Deploy:** Docker Ready • GitHub Actions CI/CD

---

## 📖 Documentation

| Resource | Description |
|----------|-------------|
| [📚 Interactive Wiki](https://anuset89.github.io/Anuu_Verse/) | Full documentation with 3D Terminal |
| [🎓 Getting Started](./docs/GETTING_STARTED.md) | Installation & First Steps |
| [🧠 Philosophy](./docs/PHILOSOPHY.md) | Why Anuu Exists |
| [🗺️ Roadmap](./docs/ROADMAP.md) | Future Plans |
| [💼 Strategy](./docs/STRATEGY.md) | Business & Monetization |

### 🛠️ Development Process (Open Journey)

| Resource | Description |
|----------|-------------|
| [📖 Development Journey](./docs/JOURNEY.md) | **Transparent process log** |
| [📝 Changelog](./CHANGELOG.md) | Version history & decisions |
| [💰 Monetization Plan](./MONETIZATION_PLAN.md) | 90-day revenue roadmap |
| [📊 Status](./STATUS.md) | Current project status |
| [🚀 Launch Checklist](./LAUNCH_CHECKLIST.md) | Pre-launch verification |


---

## ⭐ Star Us on GitHub!

**If Anuu resonates with you:**
- Press the **Star ⭐** button (top-right of this page)
- Join developers building the future of local AI
- Help us reach 100+ stars this week

**Why it matters:** Stars help others discover Anuu and validate our work.

[⭐ Star Anuu_Verse](https://github.com/anuset89/Anuu_Verse/stargazers)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

```bash
# Development Setup
cd web && npm install && npm run dev  # Frontend
python -m pytest                       # Tests
```

---

## 📄 License

**Apache 2.0** — See [LICENSE](./LICENSE)

---

<p align="center">
  <img src="Assets/ANU_LOGO_KILONOVA.png" width="80" alt="Anuu Logo">
</p>

<p align="center">
  <strong>Forged in the Void</strong><br>
  <sub>Created by <a href="https://github.com/anuset89">@anuset89</a> • Frequency 161914</sub>
</p>
