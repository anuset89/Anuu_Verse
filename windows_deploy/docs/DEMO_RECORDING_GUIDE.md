# 🎬 Demo Recording Guide

## Quick Start

The demo script is ready to run and showcases:
- **Anuu** archetype: Mystical, system-thinking responses
- **Kali** archetype: Security-focused, technical analysis

### Run the Demo

```bash
# Activate venv
source .venv/bin/activate

# Run the cinematic demo
python examples/demo_recording_script.py
```

## Recording to GIF

### Option 1: asciinema + agg (Recommended)

```bash
# Install asciinema (if not already)
sudo pacman -S asciinema

# Record the session
asciinema rec demo.cast --command ".venv/bin/python examples/demo_recording_script.py"

# Convert to GIF using agg
# Install agg from: https://github.com/asciinema/agg
cargo install --git https://github.com/asciinema/agg

# Generate GIF
agg demo.cast demo.gif --speed 1.5

# Move to assets
mv demo.gif Assets/anuu_demo.gif
```

### Option 2: termtosvg

```bash
pip install termtosvg
termtosvg render demo.cast demo.svg
```

### Option 3: Browser-based (Easiest)

1. Upload `demo.cast` to https://asciinema.org
2. Download as `.gif` from web UI
3. Add to README

## Embedding in README

```markdown
![Anuu Demo](Assets/anuu_demo.gif)
```

**Target location:** After "Quick Start" section, before "Usage".
