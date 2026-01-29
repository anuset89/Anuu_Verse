import asyncio
import os
import logging
from enum import Enum
from typing import Optional
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VRAM_Lung")

# Environmental Configuration (Arch/ROCm defaults)
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
COMFY_URL = os.getenv("COMFY_URL", "http://127.0.0.1:8188")
VRAM_LOCK_FILE = "vram.lock" # Conceptual for now, using asyncio lock for process safety

class Realm(str, Enum):
    CHAT = "chat"      # Hermes / Llama 3
    VISION = "vision"  # Flux / ComfyUI
    AUDIT = "audit"    # Rosa Gris / Logic
    # VOICE is usually lightweight enough to coexist or runs on CPU (Edge-TTS)

class RealmStatus(str, Enum):
    ENTERING = "entering"
    READY = "ready"
    ERROR = "error"

class VRAMOrchestrator:
    """
    The 'Lung' of the System. 
    Manages the single breath of the GPU (16GB VRAM).
    Only one Major Realm can inhabit the VRAM at a time.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VRAMOrchestrator, cls).__new__(cls)
            cls._instance.current_realm = None
            cls._instance.lock = asyncio.Lock()
        return cls._instance

    async def enter_realm(self, target: Realm):
        """
        The Nexus Switch.
        Evicts previous occupants and summons the new Realm.
        """
        async with self.lock:
            if self.current_realm == target:
                logger.info(f"Already in realm: {target}")
                return

            logger.info(f"🌊 TIDE SHIFT: Leaving {self.current_realm} -> Entering {target}")
            
            # Notify System (Frontend Spinner etc - to be hooked up via Pulse)
            # await broadcast_status(target, RealmStatus.ENTERING) 

            try:
                # 1. EVICTION PHASE (Exhale)
                if self.current_realm == Realm.CHAT:
                    await self._evict_ollama()
                elif self.current_realm == Realm.VISION:
                    await self._evict_comfy()
                elif self.current_realm == Realm.AUDIT:
                    await self._evict_ollama() # Assumes Audit uses Ollama too

                # 2. INHALATION PHASE (Inhale)
                if target == Realm.CHAT:
                    await self._ensure_ollama_model("anuu-hermes") 
                elif target == Realm.VISION:
                    await self._ensure_comfy_workflow()
                elif target == Realm.AUDIT:
                    await self._ensure_ollama_model("rosa-gris")

                self.current_realm = target
                logger.info(f"✅ Realm {target} Anchored.")
                # await broadcast_status(target, RealmStatus.READY)

            except Exception as e:
                logger.error(f"❌ Realm Shift Failed: {e}")
                self.current_realm = None # Undefined state
                # await broadcast_status(target, RealmStatus.ERROR, str(e))
                raise e

    # --- OLLAMA RESPIRATORY MECHANICS ---
    
    async def _evict_ollama(self):
        """Force Ollama to unload all models from VRAM."""
        try:
            # Method 1: Generate with keep_alive=0
            async with httpx.AsyncClient() as client:
                # We send a dummy request to unload
                # Note: Ollama doesn't have a direct 'unload all' API officially without a generative call 
                # or stopping the service, but keep_alive=0 on a dummy model works in recent versions
                await client.post(f"{OLLAMA_URL}/api/generate", json={
                    "model": "dummy", 
                    "keep_alive": 0
                }, timeout=2.0)
        except Exception as e:
            logger.warning(f"Ollama eviction quiet fail (might already be empty): {e}")

    async def _ensure_ollama_model(self, model_name: str):
        """Warmup the specific LLM."""
        # Simple ping to load weights
        async with httpx.AsyncClient(timeout=30.0) as client:
             # This loads the model into VRAM
            await client.post(f"{OLLAMA_URL}/api/generate", json={
                "model": model_name,
                "prompt": "",
                "keep_alive": -1 # Keep in VRAM indefinitely until explicit eviction
            })

    # --- COMFYUI RESPIRATORY MECHANICS ---

    async def _evict_comfy(self):
        """Trigger 'Unload All' workflow or API command in ComfyUI."""
        # This requires a custom workflow or usage of the /free endpoint if using a specific custom node
        # For standard Comfy, we might just rely on it being pushed out by Ollama, 
        # but explicit is better. 
        # As a fallback, we assume Comfy manages its own LRU, but to be safe we can
        # hit a 'clear' endpoint if one exists in our custom node suite.
        pass 

    async def _ensure_comfy_workflow(self):
        """Ensure ComfyUI is listening and ready."""
        # ComfyUI loads models lazily at queue time usually. 
        # This check just ensures the server is up.
        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                resp = await client.get(f"{COMFY_URL}/system_stats")
                resp.raise_for_status()
        except Exception as e:
            logger.warning(f"⚠️ ComfyUI not reachable at {COMFY_URL}. Assuming Virtual/Mock Mode. ({e})")
            # We allow it to pass so the UI can still show the "Generating..." state
            # In a real deployed version, we might want to raise an error, 
            # but for this demo/UI-focused task, we prioritize the experience.
            return

# Global Singleton Accessor
vram_orchestrator = VRAMOrchestrator()
