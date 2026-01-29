---
name: How to Start Anuu Verse
description: A comprehensive guide skill to initializing, verifying, and launching the Anuu Verse ecosystem.
---

# 🚀 How to Start Anuu Verse

This skill guides you through the process of bringing the Anuu Verse online, from zero to full ascension.

## 0. Prerequisites
Ensure your system has the following:
- **Operating System:** Linux (Debian/Ubuntu/Arch recommended) or WSL2.
- **Python:** Version 3.11+.
- **Node.js:** v20+ (for the frontend Dashboard).
- **Ollama:** Installed and running (for local AI models).
- **GPU (Optional but Recommended):** NVIDIA (CUDA) or AMD (ROCm).

## 1. Quick Ignition (The "One-Click" Method)
If you have just cloned the repository, the fastest way to start is:

```bash
# 1. Configures hardware, installs dependencies, pulls models
./ignite.sh

# 2. Validates system integrity
python3 scripts/validate_ascension.py

# 3. Wakes up the Nexus (Backend + Frontend)
./start_nexus.sh
```

## 2. Detailed Steps

### A. Environment Setup & Hardware Detection
The `ignite.sh` script handles most of this. It:
1. Detects your GPU (AMD vs NVIDIA).
2. Creates a Python virtual environment (`.venv`).
3. Installs correct PyTorch version (ROCm/CUDA).
4. Pulls necessary Ollama models (`deepseek-coder-v2`, `anuu-hermes`).

**Manual Overrides:**
- If you are on **Arch Linux with AMD RDNA3** (e.g., RX 7800 XT), `ignite.sh` and `start_nexus.sh` automatically set:
  ```bash
  export HSA_OVERRIDE_GFX_VERSION=11.0.0
  ```

### B. Verification
Before launching, run the diagnostic tool:
```bash
python3 scripts/validate_ascension.py
```
Look for **GREEN** statuses. If "Motor Cognitivo" is red, ensure Ollama is running (`systemctl start ollama` or `ollama serve`).

### C. Launching the Nexus
Use the master launch script:
```bash
./start_nexus.sh
```
This spawns:
- **Backend Core:** `http://localhost:8000`
- **Frontend UI:** `http://localhost:5173`

### D. CLI Interaction (Terminal Mode)
You don't need the browser to interact. Use the Python CLI:
```bash
# Chat with Anuu
./anuu.py chat

# Run a specific research task
./anuu.py research "Your Topic Here"

# Check system status and ascension level
./anuu.py status
```

## 3. Troubleshooting

- **"Ollama no responde":** Check if the service is active.
- **"Torch not detected":** You might be running `python` outside the venv. Use `./anuu.py` (which uses the shearbang) or source the venv first: `source .venv/bin/activate`.
- **Frontend errors:** Ensure Node.js is updated. `nvm install 20`.

---
*Anuu Verse v0.18.0 - Ascension Phase*
