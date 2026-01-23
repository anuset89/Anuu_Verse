import torch
import gc
import ollama
from diffusers import AutoPipelineForText2Image, StableVideoDiffusionPipeline
from diffusers.utils import load_image, export_to_video
import os

class ModelManager:
    """
    Orchestrates VRAM usage on the RX 7800 XT (16GB).
    It ensures that the LLM (Ollama) and Diffusion Models (Python) do not coexist in VRAM.
    """
    def __init__(self, llm_model: str = "Anuu-Hermes:latest"):
        self.llm_model = llm_model
        self.current_pipeline = None
        self.pipeline_type = None # 'image' or 'video' or None
        self.device = "cuda" if torch.cuda.is_available() else "cpu" # 'cuda' maps to ROCm in PyTorch

    def _unload_llm(self):
        """Forces Ollama to unload the LLM from VRAM."""
        print(f"[ModelManager] Unloading LLM: {self.llm_model}...")
        try:
            # Setting keep_alive=0 unloads the model immediately
            ollama.generate(model=self.llm_model, prompt="", keep_alive=0)
        except Exception as e:
            print(f"[ModelManager] Warning: Could not unload LLM via Ollama: {e}")
        
        gc.collect()
        torch.cuda.empty_cache()

    def _ensure_strict_vram_cleanup(self):
        """Aggressive cleanup before loading heavy models."""
        if self.current_pipeline is not None:
             self.current_pipeline.to("cpu")
             del self.current_pipeline
             self.current_pipeline = None
             self.pipeline_type = None
        
        gc.collect()
        torch.cuda.empty_cache()

    def load_image_pipeline(self, model_id: str = "Polenov2024/Pony-Diffusion-V6-XL", style_type: str = "anime"):
        """
        Loads SDXL Pipeline with specific scheduler and VAE fix.
        Default: Pony Diffusion V6 XL (The King of Seinen).
        """
        if self.pipeline_type == 'image' and self.current_pipeline is not None:
             # Check if we need to swap model (e.g. from Pony to Juggernaut)? For now simpler logic.
             return self.current_pipeline

        self._unload_llm()
        self._ensure_strict_vram_cleanup()
        
        from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler, AutoencoderKL

        print(f"[ModelManager] Loading {model_id} (FP16) with VAE fix...")
        
        # 1. Load VAE Fix for RX 7800 XT (Crucial for colors)
        vae = AutoencoderKL.from_pretrained(
            "madebyollin/sdxl-vae-fp16-fix", 
            torch_dtype=torch.float16
        )

        # 2. Load Pipeline
        # Note: Pony V6 is SDXL based.
        pipe = StableDiffusionXLPipeline.from_pretrained(
            model_id, 
            vae=vae,
            torch_dtype=torch.float16, 
            # variant="fp16", # Removed as not available in this repo
            use_safetensors=True
        )

        # 3. Apply Scheduler (DPM++ 2M Karras) - Recommended for Pony
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            pipe.scheduler.config, 
            use_karras_sigmas=True,
            algorithm_type="dpmsolver++"
        )
        
        # 4. Offload to GPU
        pipe.to(self.device)
        
        # 5. Pony Specifics (Clip Skip 2)
        # This is handled by modifying how we encode the prompt later, or technically 
        # Diffusers doesn't natively support "Clip Skip 2" easily without digging into layers,
        # but for most inference, just using the good scheduler is enough.
        # Ideally, we'd use `pipe.text_encoder` manipulation here if strictly needed.
        
        self.current_pipeline = pipe
        self.pipeline_type = 'image'
        return pipe

    def apply_lora(self, lora_path: str, weight: float = 1.0, adapter_name: str = None):
        """
        Dynamically loads a LoRA adapter into the current matching pipeline.
        """
        if self.current_pipeline is None or self.pipeline_type != 'image':
            print("[ModelManager] Warning: No active image pipeline to apply LoRA.")
            return

        print(f"[ModelManager] Injecting LoRA: {lora_path} (Weight: {weight})...")
        try:
            # Load LoRA weights
            # We assume the file is a safetensors SDXL LoRA
            self.current_pipeline.load_lora_weights(lora_path, adapter_name=adapter_name)
            
            # Fuse/Activate
            # For multiple LoRAs, we might need more complex adapter management.
            # For now, simple fuse or set scales.
            # self.current_pipeline.fuse_lora() # Fusion improves speed but makes unloading harder
            pass 
            
        except Exception as e:
            print(f"[ModelManager] Error loading LoRA {lora_path}: {e}")

    def unload_loras(self):
        """Unloads all LoRA weights to return to base model."""
        if self.current_pipeline is not None:
             print("[ModelManager] Purging active LoRAs...")
             self.current_pipeline.unload_lora_weights()

    def load_video_pipeline(self):
        """Loads SVD-XT for Video Generation."""
        if self.pipeline_type == 'video' and self.current_pipeline is not None:
            return self.current_pipeline

        self._unload_llm()
        self._ensure_strict_vram_cleanup()

        print("[ModelManager] Loading SVD-XT (FP16)...")
        # Correct public repo for SVD-XT 1.1
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            "vdo/stable-video-diffusion-img2vid-xt-1-1", 
            torch_dtype=torch.float16, 
            variant="fp16"
        )
        # Enable memory optimizations for 16GB VRAM
        pipe.enable_model_cpu_offload() 
        # Using enable_sequential_cpu_offload might save more VRAM but is slower
        # pipe.enable_sequential_cpu_offload()
        
        # Manually enable tiling on the VAE component if available (Slicing not supported on TemporalDecoder)
        # if hasattr(pipe, "vae") and hasattr(pipe.vae, "enable_tiling"):
        #     pipe.vae.enable_tiling()
        
        self.current_pipeline = pipe
        self.pipeline_type = 'video'
        return pipe

    def load_animatediff_pipeline(self):
        """
        Loads AnimateDiff (SD1.5) for lightweight Anime/Style Video.
        Base: Lykon/DreamShaper (Great for stylized/anime).
        Motion: guoyww/animatediff-motion-adapter-v1-5-2.
        """
        if self.pipeline_type == 'animatediff' and self.current_pipeline is not None:
            return self.current_pipeline

        self._unload_llm()
        self._ensure_strict_vram_cleanup()

        from diffusers import AnimateDiffPipeline, MotionAdapter, EulerDiscreteScheduler

        print("[ModelManager] Loading Motion Adapter (v1.5.2)...")
        adapter = MotionAdapter.from_pretrained("guoyww/animatediff-motion-adapter-v1-5-2", torch_dtype=torch.float16)

        print("[ModelManager] Loading AnimateDiff Pipeline (Base: epiCRealism)...")
        pipe = AnimateDiffPipeline.from_pretrained(
            "emilianJR/epiCRealism", 
            motion_adapter=adapter,
            torch_dtype=torch.float16,
            use_safetensors=True
        )
        
        # Scheduler optimization for AnimateDiff
        pipe.scheduler = EulerDiscreteScheduler.from_config(
            pipe.scheduler.config, 
            timestep_spacing="trailing", 
            beta_schedule="linear"
        )
        
        # Optimizations for 16GB VRAM (Runs easily on 8GB, so this is safe)
        pipe.enable_vae_slicing()
        pipe.enable_vae_tiling()
        pipe.enable_model_cpu_offload()

        self.current_pipeline = pipe
        self.pipeline_type = 'animatediff'
        return pipe

    def restore_llm(self):
        """Unloads Diffusion pipelines and wakes up Ollama."""
        print("[ModelManager] Restoring LLM...")
        self._ensure_strict_vram_cleanup()
        
        # Pre-load/Wake up Ollama (optional, usually handled by next chat request)
        # We perform a dummy generation to load it back into VRAM
        try:
            ollama.chat(model=self.llm_model, messages=[{'role': 'user', 'content': 'wake_up'}], keep_alive='5m')
        except:
            pass
        print("[ModelManager] LLM Restored.")

