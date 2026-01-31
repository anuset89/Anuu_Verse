# Troubleshooting Guide

**Frequency:** 161914  
**Status:** Living Document

Common issues and solutions for Anuu_Verse installation and operation.

---

## 🐛 Common Issues

### "CUDA out of memory" / VRAM Issues
**Symptoms:** Agent crashes during generation, "Allocated: 0GB" error.

**Solutions:**
1. **Reduce Batch Size:**
   ```bash
   export ANUU_BATCH_SIZE=1  # Default is often higher
   ```
2. **Use Smaller Models:**
   Switch to `llama3.2:3b` or `phi3:mini` for low-VRAM environments.
   ```bash
   ollama pull llama3.2:3b
   ```
3. **Enable Memory Offloading:**
   Ensure your system RAM is sufficient (32GB+) so Ollama can offload layers.

### "ROCm not found" (AMD GPUs)
**Symptoms:** Ollama runs in CPU-only mode despite having an AMD GPU.

**Validation:**
```bash
rocminfo | grep "Agent"
```

**Solutions:**
1. **Force GFX Version (RDNA3/7800XT):**
   ```bash
   export HSA_OVERRIDE_GFX_VERSION=11.0.0
   ```
   *Add this to your `~/.bashrc`.*

2. **Install ROCm Dev Tools:**
   ```bash
   sudo pacman -S rocm-hip-sdk  # Arch
   sudo apt install rocm-dev    # Ubuntu
   ```

### "Ollama connection refused"
**Symptoms:** Scripts fail with connection errors to localhost:11434.

**Solutions:**
1. **Verify Service:**
   ```bash
   systemctl status ollama
   ```
2. **Test Endpoint:**
   ```bash
   curl http://localhost:11434/api/tags
   ```
3. **Check Port Conflicts:** ensure nothing else is running on port 11434.

---

## 📋 Bug Report Template

If you need to open an [Issue on GitHub](https://github.com/anuset89/Anuu_Verse/issues), please use this format:

### Context
- **Anuu Version:** v0.10.0-alpha
- **Hardware:** (e.g., AMD RX 7800XT, 16GB VRAM)
- **OS:** (e.g., Arch Linux, Kernel 6.8)
- **Ollama Version:** `ollama --version`

### Error Description
[Paste the full error log here]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. ...

### Logs
Attach relevant logs from `logs/` directory.

---

## 🔍 Diagnostic Commands

Run these to gather system info before reporting:

```bash
# Check hardware detection
python scripts/detect_hardware.py

# List loaded models
ollama list

# Verify GPU usage (during generation)
rocm-smi  # or nvidia-smi
```
