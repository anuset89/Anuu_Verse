# Getting Started / Quick Start

**Time:** 15-45 minutes  
**Skill Level:** Intermediate (Terminal usage required)

---

## 🔧 Hardware Compatibility

Detailed requirements to ensure smooth operation.

### GPU Support
| Vendor | Tier | Recommended Model | VRAM | Notes |
|:-------|:-----|:------------------|:-----|:------|
| **NVIDIA** | Entry | RTX 3060 | 12GB | Good for 7B/8B models |
| | **Optimal** | **RTX 3090/4090** | **24GB** | **Runs Llama-3-70B (Q4)** |
| **AMD** | Entry | RX 6700 XT | 12GB | Requires ROCm 6.0+ |
| | **Optimal** | **RX 7900 XTX** | **24GB** | **Excellent value/perf** |

### CPU-Only Mode
✅ **Supported:** Yes, but slower.
❌ **Limitations:** Multimodal features (image gen) may be painful.
**RAM:** 32GB+ System RAM recommended for offloading.

---

## 🤖 Recommended Models

Anuu uses a "Council" of models. You can swap them, but these are tuned:

| Role | Model ID | VRAM | Command |
|:-----|:---------|:-----|:--------|
| **Code/Logic** | `deepseek-coder-v2:16b` | 16GB | `ollama pull deepseek-coder-v2:16b` |
| **Chat/Persona** | `llama3:8b` | 8GB | `ollama pull llama3` |
| **Vision** | `llava:7b` | 8GB | `ollama pull llava` |
| **Low-End** | `phi3:mini` | 4GB | `ollama pull phi3:mini` |

---

## 🔥 Installation (The Ritual)

### 1. Automated Setup (Pinokio / Script)

The easiest way. Handles venv, dependencies, and model downloads.

```bash
git clone https://github.com/anuset89/Anuu_Verse.git
cd Anuu_Verse
chmod +x ignite.sh
./ignite.sh
```

### 2. Manual Setup

If `ignite.sh` fails or you prefer manual control:

```bash
# 1. Create environment
python -m venv .venv
source .venv/bin/activate

# 2. Install Python deps
pip install -r requirements.txt

# 3. Pull Models (Ollama must be running)
ollama pull llama3
ollama pull deepseek-coder-v2:16b
```

---

## 🎯 Your First Conversation

Once installed (`ignite.sh` completed), wake the system:

```bash
python systems/EXECUTION/agents/companion_local/main.py
```

### Basic Commands
*   `/status` - Check system health and active identities.
*   `/imagine <prompt>` - Generate an image (if GPU allows).
*   `@kali <message>` - Speak directly to Kali (Security/Alchemy).
*   `switchear a <identidad>` - Explicitly change the active archetype.

### Example Interaction
> **User:** "Anuu, I need to analyze a security log."
>
> **Anuu:** "Loading **Kali** archetype for security analysis..."
>
> **Kali:** "Accessing logs. I see the patterns. Upload the snippet."

---
