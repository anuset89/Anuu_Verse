import asyncio
import sys
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from .base_deity import Deity

# Add backend to path for librarian import
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(ROOT_DIR / "backend") not in sys.path:
    sys.path.insert(0, str(ROOT_DIR / "backend"))

CACHE_FILE = ROOT_DIR / "memory_db" / "thoth_cache.json"
CACHE_TTL_HOURS = 24  # Cache entries expire after 24 hours

class Thoth(Deity):
    """
    Thoth: The Grand Librarian.
    Domain: Knowledge, Research, Synthesis.
    Integration: Uses backend/mind/librarian.py for web search with local cache.
    """
    
    def __init__(self):
        super().__init__(name="Thoth", domain="Knowledge")
        self.librarian = None
        self.cache = self._load_cache()
        
    def _load_cache(self) -> Dict:
        if CACHE_FILE.exists():
            try:
                with open(CACHE_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"cache_version": "1.0", "entries": {}}
    
    def _save_cache(self):
        CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(self.cache, f, indent=2, ensure_ascii=False)
            
    def _get_cache_key(self, query: str, entity: Optional[str]) -> str:
        raw = f"{query}::{entity or 'default'}"
        return hashlib.md5(raw.encode()).hexdigest()
    
    def _get_cached(self, key: str) -> Optional[str]:
        entry = self.cache.get("entries", {}).get(key)
        if entry:
            # Check TTL
            cached_at = datetime.fromisoformat(entry.get("timestamp", "2000-01-01"))
            if (datetime.now() - cached_at).total_seconds() < CACHE_TTL_HOURS * 3600:
                self.log_manifestation("Cache HIT - Returning stored wisdom.")
                return entry.get("wisdom")
        return None
    
    def _set_cached(self, key: str, wisdom: str):
        if "entries" not in self.cache:
            self.cache["entries"] = {}
        self.cache["entries"][key] = {
            "timestamp": datetime.now().isoformat(),
            "wisdom": wisdom
        }
        self._save_cache()
        
    async def _ensure_librarian(self):
        if self.librarian is None:
            try:
                from backend.mind.librarian import librarian
                self.librarian = librarian
            except ImportError as e:
                self.log_manifestation(f"Warning: Could not import librarian: {e}")
                self.librarian = None
        
    async def invoke(self, intention: Dict[str, Any]) -> Dict[str, Any]:
        query = intention.get('query')
        entity = intention.get('entity', 'THOTH')
        
        self.log_manifestation(f"Accessing Infinite Library for: '{query}'")
        
        # Check cache first (Phase 4: Velocidad de Ra)
        cache_key = self._get_cache_key(query, entity)
        cached_wisdom = self._get_cached(cache_key)
        
        if cached_wisdom:
            return {
                "deity": "Thoth",
                "status": "enlightened",
                "wisdom": f"[CACHED] {cached_wisdom}",
                "artifacts": []
            }
        
        # Cache miss - perform real search
        await self._ensure_librarian()
        
        if self.librarian:
            try:
                wisdom = await self.librarian.extract_best_answer(query, entity=entity)
                self.log_manifestation("Research completed via Librarian.")
                
                # Store in cache
                self._set_cached(cache_key, wisdom)
                
                return {
                    "deity": "Thoth",
                    "status": "enlightened",
                    "wisdom": wisdom,
                    "artifacts": []
                }
            except Exception as e:
                self.log_manifestation(f"Search failed: {e}")
                return {
                    "deity": "Thoth",
                    "status": "error",
                    "wisdom": f"Research failed: {e}",
                    "artifacts": []
                }
        else:
            await asyncio.sleep(1)
            return {
                "deity": "Thoth",
                "status": "enlightened",
                "wisdom": f"[MOCK] Thoth has analyzed '{query}'. The pathways are clear.",
                "artifacts": []
            }
