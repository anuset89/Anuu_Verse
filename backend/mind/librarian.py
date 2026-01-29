import logging
import asyncio
from typing import List, Dict, Optional
from duckduckgo_search import DDGS

logger = logging.getLogger("Librarian")

# Entity-Search Bias Mapping (MPD Entities)
ENTITY_FLAVORS = {
    "anuu": "core orchestration, holistic system architecture, convergence, unification",
    "kali": "cybersecurity, vulnerability research, exploit analysis, offensive security, pentesting",
    "set": "logical deconstruction, analytical proof, critical skepticism, data science, deep logic",
    "kilonova": "creative manifestation, generative art, design innovation, aesthetic breakthrough",
    "anuket": "data flow, streaming protocols, network optimization, connectivity, liquid dynamics",
    "saze": "structural engineering, stability, backend architecture, performance optimization",
    "4nvset": "cryptography, pure mathematics, symbolic logic, encryption, algorithmic complexity",
    "kanuv": "defensive architecture, infrastructure hardening, security specifications, stable documentation",
    "rosa gris": "ethical alignment, balanced perspective, trade-off analysis, neutrality, human values",
    "THOTH": "code python algorithm", # Coding & Technical
    "RA": "news recent",      # Current Events
    "ISIS": "wiki history",   # Context & Lore
    "MAAT": "review comparison", # Balanced Analysis
    "LUNA": "reddit forum",     # Public Sentiment (New)
}

class Librarian:
    """
    The Librarian: Sanitizes and extracts knowledge from the Web.
    Uses ddgs (Updated version of duckduckgo_search) with Entity Bias.
    """
    def __init__(self):
        self.ddgs = DDGS()

    async def search(self, query: str, entity: Optional[str] = None, max_results: int = 5) -> List[Dict]:
        """
        Performs a search with optional entity flavor bias.
        """
        search_query = query
        if entity and entity.lower() in ENTITY_FLAVORS:
            flavor = ENTITY_FLAVORS[entity.lower()]
            search_query = f"{query} {flavor}"
            logger.info(f"Applying {entity.upper()} bias: adding '{flavor}' to query.")

        try:
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(None, lambda: list(self.ddgs.text(search_query, max_results=max_results)))
            logger.info(f"DDGS returned {len(results)} results for '{search_query}'.")
            return results
        except Exception as e:
            logger.error(f"Search failed for '{search_query}': {e}")
            return []

    async def extract_best_answer(self, query: str, entity: Optional[str] = None) -> str:
        """
        Extracts knowledge snippets, potentially biased by an entity perspective.
        """
        results = await self.search(query, entity=entity)
        if not results:
            return "No knowledge found in the current digital winds."

        fragments = []
        if entity:
            fragments.append(f"📡 [MPD_PERSPECTIVE: {entity.upper()} VIEWPORT ACTIVE]")

        for res in results[:3]:
            title = res.get("title", "Untitled")
            content = res.get("body", "") 
            url = res.get("href", "")    
            fragments.append(f"Source: {title} ({url})\nContent: {content}")

        return "\n\n---\n\n".join(fragments)

# Component instance
librarian = Librarian()
