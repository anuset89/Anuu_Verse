import os
import time
import torch
from .model_manager import ModelManager
from diffusers.utils import load_image, export_to_video
import random
import edge_tts
import asyncio

from .resource_vault import ResourceVault

# Global Instances
manager = ModelManager()
vault = ResourceVault()

class MultimodalNexus:
    """
    The Interface for the Agents to access multimodal capabilities.
    """
    
    @staticmethod
    def manifest_image(prompt: str, output_dir: str = "web/public/generations"):
        """Generates an image using Pony V6 XL (or current loaded model)."""
        try:
            os.makedirs(output_dir, exist_ok=True)
            pipe = manager.load_image_pipeline(model_id="Polenov2024/Pony-Diffusion-V6-XL")
            
            # 0. Clean previous LoRAs
            manager.unload_loras()

            # 1. Detect LoRAs from Vault based on Prompt
            # Example: If prompt contains "frieren", load "frieren_xl.safetensors"
            active_loras = []
            for lora in vault.library['loras']:
                triggers = lora.get('trigger_words', [])
                # Check if any trigger word is in the prompt
                if any(t.lower() in prompt.lower() for t in triggers):
                    print(f"[MultimodalNexus] Detected LoRA Trigger: {lora['name']}")
                    active_loras.append(lora)
            
            # 2. Apply Detected LoRAs
            for lora in active_loras:
                lora_path = os.path.join("models/loras", lora['filename'])
                if os.path.exists(lora_path):
                    manager.apply_lora(lora_path, weight=lora.get('weight_default', 1.0))
                else:
                    print(f"[MultimodalNexus] Missing LoRA file: {lora_path}")

            # Pony V6 Spec:
            # - Steps: 25-35 (We use 30)
            # - CFG: 5.5 - 7.0 (We use 6.0)
            # - Negative Prompt: Crucial for quality.
            
            negative_prompt = (
                "bad anatomy, extra limbs, extra fingers, missing fingers, deformed hands, "
                "malformed limbs, low quality, lowres, blurry, jpeg artifacts, deformed face, "
                "cross-eyed, loli, shota, child, underage"
            )
            
            # Force "score_9, score_8_up, score_7_up" tags if using Pony (it expects them)
            # We append them to the user prompt if not present.
            pony_prefix = "score_9, score_8_up, score_7_up, "
            final_prompt = pony_prefix + prompt if "score_" not in prompt else prompt

            image = pipe(
                prompt=final_prompt, 
                negative_prompt=negative_prompt,
                num_inference_steps=30, 
                guidance_scale=6.0,
                # clip_skip=2 # Diffusers support for this is partial, but we rely on Scheduler.
            ).images[0]
            
            timestamp = int(time.time())
            filename = f"manifest_{timestamp}_{random.randint(100,999)}.png"
            path = os.path.join(output_dir, filename)
            image.save(path)
            
            # Keep pipeline loaded for chaining, or unload? 
            # Strategy: Let Agent decide when to restore LLM, or auto-restore?
            # For now, we restore LLM immediately after single generation to keep Chat responsive.
            manager.restore_llm()
            
            return f"/generations/{filename}"
        except Exception as e:
            manager.restore_llm()
            return f"Error manifesting image: {str(e)}"

    @staticmethod
    def manifest_video(image_path: str, output_dir: str = "web/public/generations"):
        """Generates a video from an image using SVD-XT."""
        try:
            print(f"[MultimodalNexus] Starting Video Manifestation for {image_path}")
            os.makedirs(output_dir, exist_ok=True)
            
            print("[MultimodalNexus] Loading Pipeline...")
            pipe = manager.load_video_pipeline()
            print("[MultimodalNexus] Pipeline Loaded.")

            # Load and resize image for SVD
            print("[MultimodalNexus] Processing Source Image...")
            image = load_image(image_path)
            # Reduce resolution to 256x144 (Baseline Test)
            image = image.resize((256, 144))

            print("[MultimodalNexus] Generating Frames (Inference)...")
            # Chunk size 1 is critical for VRAM saving during decode
            # Reduce to 4 frames (Minimal Motion) to fit in 16GB VRAM
            frames = pipe(image, decode_chunk_size=1, num_frames=4, generator=torch.manual_seed(42)).frames[0]
            print(f"[MultimodalNexus] Frames Generated: {len(frames)}")

            timestamp = int(time.time())
            filename = f"manifest_vid_{timestamp}_{random.randint(100,999)}.mp4"
            path = os.path.join(output_dir, filename)
            
            print(f"[MultimodalNexus] Exporting to {path}...")
            export_to_video(frames, path, fps=7)
            print("[MultimodalNexus] Export Complete.")
            
            manager.restore_llm()
            return f"/generations/{filename}"
        
        except Exception as e:
            print(f"[MultimodalNexus] Error: {e}")
            import traceback
            traceback.print_exc()
            manager.restore_llm()
            return f"Error manifesting video: {str(e)}"

    @staticmethod
    def manifest_anime_video(prompt: str, output_dir: str = "web/public/generations", num_frames: int = 16):
        """Generates an Anime Video from text using AnimateDiff."""
        try:
            print(f"[MultimodalNexus] Starting Anime Manifestation: {prompt}")
            os.makedirs(output_dir, exist_ok=True)
            
            pipe = manager.load_animatediff_pipeline()
            
            # AnimateDiff Text-to-Video
            # Steps: 20-30 is usually enough for LCM/Euler
            videos = pipe(
                prompt=prompt,
                negative_prompt="bad quality, worse quality, low resolution",
                num_frames=num_frames,
                guidance_scale=7.5,
                num_inference_steps=20,
                generator=torch.manual_seed(42)
            ).frames[0]

            timestamp = int(time.time())
            filename = f"anime_{timestamp}_{random.randint(100,999)}.mp4"
            path = os.path.join(output_dir, filename)
            
            print(f"[MultimodalNexus] Exporting to {path}...")
            export_to_video(videos, path, fps=8)
            print("[MultimodalNexus] Export Complete.")
            
            manager.restore_llm()
            return f"/generations/{filename}"
            
        except Exception as e:
            print(f"[MultimodalNexus] Error: {e}")
            message = str(e)
            if "out of memory" in message.lower():
                message += " (Try closing other apps)"
            manager.restore_llm()
            return f"Error manifesting anime: {message}"

    @staticmethod
    async def speak(text: str, voice: str = "es-AR-TomasNeural", output_dir: str = "web/public/audio"):
        """Generates speech using Edge-TTS."""
        try:
            os.makedirs(output_dir, exist_ok=True)
            communicate = edge_tts.Communicate(text, voice)
            timestamp = int(time.time())
            filename = f"voice_{timestamp}.mp3"
            path = os.path.join(output_dir, filename)
            
            await communicate.save(path)
            return f"/audio/{filename}"
        except Exception as e:
            return f"Error speaking: {str(e)}"
