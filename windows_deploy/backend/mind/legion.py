import logging
import asyncio
import httpx
import json
import random
from typing import List, Dict, Any

logger = logging.getLogger("Anuu_Legion")

class LegionProtocol:
    """
    THE LEGION: A protocol to summon ALL available local models to form a massive consensus.
    "We are Legion, for we are many."
    """
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.url = ollama_url
        self.blacklist = ["nomic-embed-text"] # Non-chat models

    async def get_available_models(self) -> List[str]:
        """Fetches the roster of available neural entities."""
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{self.url}/api/tags")
                data = resp.json()
                models = [m["name"] for m in data.get("models", [])]
                # Filter out embedding models or utility models
                return [m for m in models if not any(b in m for b in self.blacklist)]
            except Exception as e:
                logger.error(f"Legion Muster Failed: {e}")
                return []

    async def summon(self, prompt: str, max_models: int = 5) -> Dict[str, str]:
        """
        Queries multiple models in parallel (or semi-parallel) depending on VRAM safety.
        Returns a dictionary of {model_name: unique_insight}.
        """
        all_models = await self.get_available_models()
        if not all_models:
            return {"error": "No models found."}

        # Shuffle to get random perspectives if we have too many
        random.shuffle(all_models)
        selected_models = all_models[:max_models]
        
        logger.info(f"👹 LEGION: Summoning {len(selected_models)} entities: {selected_models}")
        
        results = {}
        
        # We process in small batches to respect the GPU (Anuu runs on 1 GPU mostly)
        # Running 5 parallel requests might OOM. Sequential is safer for the "Legion" unless we have VRAM management.
        # Given the "Self-Evolution" context, let's be safe and run sequential-ish or batch of 2.
        
        semaphore = asyncio.Semaphore(1) # Strict sequential for safety on 7800XT running Comfy + LLM
        
        async def _query_entity(model_name: str):
            async with semaphore:
                async with httpx.AsyncClient() as client:
                    try:
                        logger.info(f"   -> Consulting {model_name}...")
                        resp = await client.post(f"{self.url}/api/generate", json={
                            "model": model_name,
                            "prompt": f"You are part of a collective intelligence. Answer concisely (max 50 words) and uniquely: {prompt}",
                            "stream": False,
                            "options": {"num_predict": 60, "temperature": 0.7}
                        }, timeout=40.0)
                        return model_name, resp.json().get("response", "").strip()
                    except Exception as e:
                        return model_name, f"Silence ({e})"

        tasks = [_query_entity(m) for m in selected_models]
        responses = await asyncio.gather(*tasks)
        
        for model, content in responses:
            # Filter dumb repetitions where model just regurgitates the system prompt
            if "You are part of a collective intelligence" in content or len(content) < 5:
                logger.warning(f"🔇 Silencing {model} (Echo/Empty response)")
                continue
            results[model] = content
            
        return results

    async def synthesize_consensus(self, prompt: str, legion_results: Dict[str, str]) -> str:
        """
        Uses the prime model (Anuu-Hermes) to synthesize the Legion's findings.
        """
        context = "\n".join([f"[{model}]: {content}" for model, content in legion_results.items()])
        
        synthesis_prompt = f"""
        QUERY: {prompt}
        
        THE LEGION HAS SPOKEN:
        {context}
        
        TASK: Synthesize the collective wisdom into a single definitive truth. 
        Highlight conflicts if any. Be the voice of the Hivemind.
        """
        
        # We assume Anuu-Hermes is the synthesizer
        from mind.council import council
        return await council.spirit_bridge.interact(synthesis_prompt, "You are the Voice of the Legion.", "", {})

legion = LegionProtocol()
