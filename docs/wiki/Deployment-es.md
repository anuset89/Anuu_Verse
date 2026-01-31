# 🚀 Deployment & Production Guide

**How to run Anuu_Verse reliably 24/7.**

---

## 🏗️ 1. Docker Deployment (Recommended)

The easiest way to run Anuu is using Docker Compose. This ensures all dependencies (Database, API, Web) are isolated and configured correctly.

### Prerequisites
- Docker Engine installed
- Docker Compose v2+
- 8GB RAM minimum (for LLMs)

### Step 1: Clone & Configure
```bash
git clone https://github.com/anuset89/Anuu_Verse.git
cd Anuu_Verse

# Create persistent volume directories
mkdir -p ollama_data memory_db
```

### Step 2: Start Services
```bash
docker-compose up -d
```

### Step 3: Verify
- **API:** http://localhost:8000
- **Web UI:** http://localhost:3000
- **Ollama:** http://localhost:11434

---

## 🛠️ 2. Manual Installation (Linux/Mac)

If you prefer running directly on metal (e.g. for GPU debugging).

### System Requirements
- Python 3.9+
- Node.js 18+ (for frontend)
- `build-essential` (Linux)

### Backend Setup
```bash
# Create environment
python3 -m venv .venv
source .venv/bin/activate

# Install deps
pip install -r requirements.txt

# Run API
uvicorn systems.EXECUTION.agents.companion_local.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd web
npm install
npm run build
npm run preview -- --port 3000
```

---

## 🔐 3. Security Best Practices

### Network Security
- **Do NOT expose port 8000/11434 to the public internet** without a reverse proxy.
- Use **Nginx** or **Caddy** with SSL/TLS if accessing remotely.

### Authentication
Anuu currently does not enforce auth. For multi-user setups:
- Setup Basic Auth via Nginx
- Use a VPN (Tailscale, WireGuard) to access the dashboard

---

## 💾 4. Backup & Restore

### Memory Backup (ChromaDB)
The vector database creates a directory `memory_db` (or inside `/Library`).

**To Backup:**
```bash
tar -czvf memory_backup_$(date +%F).tar.gz ./memory_db
```

**To Restore:**
```bash
tar -xzvf memory_backup_2026-01-23.tar.gz
```

---

## ⚡ 5. Performance Tuning

### GPU Acceleration (Ollama)
If you have an NVIDIA GPU, ensure `nvidia-container-toolkit` is installed for Docker to pass GPU access.

Update `docker-compose.yml`:
```yaml
services:
  ollama:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

---

## 🆘 Need Professional Help?

Setting up production infrastructure can be complex.

**I offer setup services:**
- ✅ **Quick Setup (€300):** I install and configure everything for you properly.
- ✅ **Support:** Debugging and optimization.

→ **[Hire me for Setup](mailto:YradielRTS@protonmail.com?subject=Setup%20HeIp)**
