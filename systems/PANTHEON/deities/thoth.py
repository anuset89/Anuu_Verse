import asyncio
import sys
from pathlib import Path
from typing import Dict, Any
from .base_deity import Deity

# Add backend to path for librarian import
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(ROOT_DIR / "backend") not in sys.path:
    sys.path.insert(0, str(ROOT_DIR / "backend"))

class Thoth(Deity):
    """
    Thoth: The Grand Librarian.
    Domain: Knowledge, Research, Synthesis.
    Integration: Uses backend/mind/librarian.py for web search.
    """
    
    def __init__(self):
        super().__init__(name="Thoth", domain="Knowledge")
        self.librarian = None
        
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
        entity = intention.get('entity', 'THOTH')  # Default to THOTH entity for technical searches
        
        self.log_manifestation(f"Accessing Infinite Library for: '{query}'")
        
        await self._ensure_librarian()
        
        if self.librarian:
            # Real search via librarian
            try:
                wisdom = await self.librarian.extract_best_answer(query, entity=entity)
                self.log_manifestation("Research completed via Librarian.")
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
            # Fallback mock
            await asyncio.sleep(1)
            return {
                "deity": "Thoth",
                "status": "enlightened",
                "wisdom": f"[MOCK] Thoth has analyzed '{query}'. The pathways are clear.",
                "artifacts": []
            }
