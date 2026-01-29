import json
import logging
import httpx
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger("Chronos")

class Chronos:
    """
    The Chronos Lobe: Manages Fractal Memory for Anuu.
    Implements a recursive summarization system (Day -> Week -> Month).
    """
    def __init__(self, storage_dir: str = "../mpd/memory", ollama_url: str = "http://localhost:11434/api/generate"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.current_history_file = self.storage_dir / "raw_history.jsonl"
        self.daily_nuggets_file = self.storage_dir / "daily_nuggets.json"
        self.soul_essence_file = self.storage_dir / "soul_essence.json"
        self.ollama_url = ollama_url
        self._memo_cache = {} # Simple in-memory cache for tool calls

    def record_interaction(self, user_input: str, anuu_response: str):
        """
        Appends a raw interaction to the daily log.
        """
        entry = {
            "timestamp": datetime.now().isoformat(),
            "user": user_input,
            "anuu": anuu_response
        }
        with open(self.current_history_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
        logger.info("Chronos: Interaction recorded in raw_history.")

    async def fractal_compress(self, model: str = "smollm2:1.7b"):
        """
        Compresses raw history into a daily summary (Nugget) using an LLM.
        """
        if not self.current_history_file.exists():
            return

        try:
            with open(self.current_history_file, "r") as f:
                history = [json.loads(line) for line in f]

            if not history:
                return

            # Prepare context for the LLM
            context = "\n".join([f"U: {h['user']}\nA: {h['anuu'][:200]}..." for h in history[-50:]])
            prompt = f"""
            RESUME EL DÍA:
            Has tenido las siguientes interacciones. Extrae la esencia, aprendizajes y estado emocional.
            Sé conciso (máximo 3 frases).
            
            INTERACCIONES:
            {context}
            
            RESUMEN FRACTAL:
            """

            async with httpx.AsyncClient() as client:
                response = await client.post(self.ollama_url, json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False
                }, timeout=60.0)
                essence = response.json().get("response", "Error en la compresión.").strip()

            summary = {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "interaction_count": len(history),
                "essence": essence
            }

            # Update daily_nuggets.json
            nuggets = []
            if self.daily_nuggets_file.exists():
                try:
                    with open(self.daily_nuggets_file, "r") as f:
                        nuggets = json.load(f)
                except: nuggets = []

            nuggets.append(summary)
            with open(self.daily_nuggets_file, "w") as f:
                json.dump(nuggets, f, indent=2)

            # Move raw history to an archive or delete
            archive_dir = self.storage_dir / "archive"
            archive_dir.mkdir(exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.current_history_file.rename(archive_dir / f"history_{timestamp}.jsonl")
            
            logger.info(f"Chronos: Fractal compression complete. Essence: {essence[:50]}...")
            return summary

        except Exception as e:
            logger.error(f"Chronos: Fractal compression failed: {e}")
            return None

    def get_memories_for_prompt(self, limit_days: int = 7) -> str:
        """
        Retrieves recent nuggets for context injection.
        """
        if not self.daily_nuggets_file.exists():
            return "Primer día de despertar."

        try:
            with open(self.daily_nuggets_file, "r") as f:
                nuggets = json.load(f)
            recent = nuggets[-limit_days:]
            
            memory_strings = [f"- {n['date']}: {n['essence']}" for n in recent]
            return "\n".join(memory_strings)
        except Exception as e:
            logger.error(f"Chronos: Memory retrieval failed: {e}")
            return "Una neblina cubre el pasado."

    def check_memo(self, key: str) -> Optional[str]:
        """Check if a tool result is memoized."""
        entry = self._memo_cache.get(key)
        if entry:
            val, expiry = entry
            if datetime.now() < expiry:
                return val
            del self._memo_cache[key]
        return None

    def memoize(self, key: str, value: str, ttl_minutes: int = 15):
        """Memoize a tool result."""
        expiry = datetime.now() + timedelta(minutes=ttl_minutes)
        self._memo_cache[key] = (value, expiry)

    def get_recent_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieves recent raw interaction logs.
        """
        if not self.current_history_file.exists():
            return []

        try:
            with open(self.current_history_file, "r") as f:
                # Read all lines, parse JSON, and get the last 'limit' entries
                # This might be heavy for very large files, but acceptable for MVP
                lines = f.readlines()
                history = [json.loads(line) for line in lines]
                return history[-limit:][::-1] # Reverse to show newest first
        except Exception as e:
            logger.error(f"Chronos: History retrieval failed: {e}")
            return []

# Component instance
chronos = Chronos()
