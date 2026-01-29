import os
import sys
import subprocess
from pathlib import Path

# Configuration
# Configuration
MODELS = {
    # --- Base Checkpoints ---
    "Pony Diffusion V6 XL (Anime/Art God)": {
        "url": "https://civitai.com/api/download/models/290640",
        "filename": "ponyDiffusionV6XL_v6StartWithThisOne.safetensors",
        "type": "checkpoint"
    },
    "DreamShaper 8 (General/Video Base)": {
        "url": "https://civitai.com/api/download/models/128713",
        "filename": "dreamshaper_8.safetensors",
        "type": "checkpoint"
    },
    "Juggernaut XL v9 (Hyper Realism)": {
        "url": "https://civitai.com/api/download/models/456194",
        "filename": "juggernautXL_v9.safetensors",
        "type": "checkpoint"
    },
    
    # --- AnimateDiff Core ---
    "Motion Module v1.5 v2 (Animation)": {
        "url": "https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15_v2.ckpt?download=true",
        "filename": "mm_sd_v15_v2.ckpt",
        "type": "animatediff"
    },
    "LCM LoRA (Video Speed Boost)": {
        "url": "https://huggingface.co/latent-consistency/lcm-lora-sdv1-5/resolve/main/pytorch_lora_weights.safetensors?download=true",
        "filename": "lcm_lora_sd15.safetensors",
        "type": "lora"
    },

    # --- Creative LoRAs (SDXL/Pony Compatible) ---
    "Add Detail XL (Enhancer)": {
        "url": "https://civitai.com/api/download/models/135867",
        "filename": "add_detail_xl.safetensors",
        "type": "lora"
    },
    "Pixel Art XL (Style)": {
        "url": "https://huggingface.co/nerijs/pixel-art-xl/resolve/main/pixel-art-xl.safetensors?download=true",
        "filename": "pixel_art_xl_v1.safetensors",
        "type": "lora"
    },
    "Cyberpunk Transhumanism (Style)": {
         "url": "https://civitai.com/api/download/models/129712?type=Model&format=SafeTensor", 
         "filename": "cyberpunk_xl.safetensors",
         "type": "lora"
    },
    "Glitch Art (Style)": {
        "url": "https://huggingface.co/glitch-art-xl/resolve/main/glitch-art.safetensors?download=true",
        "filename": "glitch_art_xl.safetensors",
        "type": "lora"
    }
}

def find_comfyui():
    """Attempts to find the ComfyUI installation directory."""
    # Common locations
    search_paths = [
        Path.home() / "ComfyUI",
        Path.home() / "comfyui",
        Path.cwd() / "ComfyUI",
        Path("../ComfyUI"),
        Path("/opt/ComfyUI"),
        Path("/home/kali/Documentos/Data/Packages/ComfyUI")
    ]
    
    for path in search_paths:
        if path.exists() and (path / "main.py").exists():
            return path.resolve()
    
    return None

def download_file(url, target_path):
    """Downloads a file using wget."""
    print(f"⬇️  Downloading to {target_path}...")
    try:
        # -nc: No clobber (don't overwrite if exists)
        # --content-disposition: Respect server filename if needed, but we force output name
        subprocess.run(["wget", "-q", "--show-progress", "-O", str(target_path), url], check=True)
        print("✅ Download Complete.")
    except subprocess.CalledProcessError:
        print("❌ Error downloading file.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def main():
    print("🔎 Searching for ComfyUI Installation...")
    comfy_path = find_comfyui()
    
    if not comfy_path:
        print("⚠️  Could not automatically find 'ComfyUI' folder.")
        user_input = input("👉 Please enter the absolute path to your ComfyUI folder: ")
        comfy_path = Path(user_input).resolve()
        if not comfy_path.exists():
            print("❌ Invalid path. Exiting.")
            sys.exit(1)
    
    print(f"✅ ComfyUI found at: {comfy_path}")
    
    # Define target directories
    checkpoint_dir = comfy_path / "models" / "checkpoints"
    lora_dir = comfy_path / "models" / "loras"
    animatediff_dir = comfy_path / "custom_nodes" / "ComfyUI-AnimateDiff-Evolved" / "models"
    
    # Check AnimateDiff Install
    # ... (same) ...

    # Ensure directories exist
    checkpoint_dir.mkdir(parents=True, exist_ok=True)
    lora_dir.mkdir(parents=True, exist_ok=True)
    animatediff_dir.mkdir(parents=True, exist_ok=True)

    print("\n📦 Checking Models...")
    
    for name, info in MODELS.items():
        if info["type"] == "checkpoint":
            target = checkpoint_dir / info["filename"]
        elif info["type"] == "lora":
            target = lora_dir / info["filename"]
        elif info["type"] == "animatediff":
            target = animatediff_dir / info["filename"]
        
        if target.exists():
            print(f"✅ {name} exists.")
        else:
            print(f"❌ {name} MISSING.")
            download_file(info["url"], target)

    print("\n🎉 Setup Complete! Please Restart ComfyUI to load the new models.")

if __name__ == "__main__":
    main()
