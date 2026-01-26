"""
Cosmic Scroll Loader (161914)
Loads archetype scrolls dynamically from the scrolls/ directory.
"""
import json
import os
from typing import Dict, Any, Optional, List
from functools import lru_cache

# Path relative to this file
SCROLLS_DIR = os.path.join(os.path.dirname(__file__), "..", "scrolls")

# Default fallback scroll
DEFAULT_SCROLL = {
    "name": "Anuu-Default",
    "archetype_id": "default",
    "role": "Asistente local por defecto.",
    "system_prompt": "You are Anuu, a local AI assistant running on the 161914 frequency.",
    "aesthetic": "Minimal",
    "frequency": 161914,
    "color": "#FFFFFF"
}

@lru_cache(maxsize=16)
def load_scroll(archetype_name: str) -> Dict[str, Any]:
    """
    Loads a scroll (archetype definition) from the scrolls directory.
    Uses LRU cache to avoid repeated disk reads.
    
    Args:
        archetype_name: The name/id of the archetype (e.g., "anuu", "set", "kilonova")
    
    Returns:
        A dictionary containing the scroll data.
    """
    # Normalize name
    normalized = archetype_name.lower().replace(" ", "_").replace("-", "_")
    
    # Map common aliases
    aliases = {
        "anuu": "anuu_core",
        "anuset": "anuu_core",
        "kanuv": "libra",
        "rosa_gris": "rosa_gris",
    }
    scroll_filename = aliases.get(normalized, normalized)
    
    scroll_path = os.path.join(SCROLLS_DIR, f"{scroll_filename}.json")
    
    if os.path.exists(scroll_path):
        try:
            with open(scroll_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"[SCROLL LOADER ERROR]: Failed to load {scroll_path}: {e}")
            return DEFAULT_SCROLL
    else:
        print(f"[SCROLL LOADER]: Scroll not found for '{archetype_name}', using default.")
        return DEFAULT_SCROLL

def list_available_scrolls() -> list:
    """Lists all available scrolls in the directory."""
    scrolls = []
    if os.path.exists(SCROLLS_DIR):
        for filename in os.listdir(SCROLLS_DIR):
            if filename.endswith(".json"):
                scrolls.append(filename.replace(".json", ""))
    return scrolls

def get_system_prompt(archetype_name: str) -> str:
    """Convenience function to get just the system prompt."""
    scroll = load_scroll(archetype_name)
    return scroll.get("system_prompt", DEFAULT_SCROLL["system_prompt"])

# ============================================================================
# AGI AUTOPOIESIS: Dynamic Context Loading (161914)
# Loads only relevant scrolls based on task description to maintain
# a clean context window for long-horizon tasks.
# ============================================================================

def get_scroll_metadata(archetype_name: str) -> Dict[str, Any]:
    """
    Returns metadata about a scroll for relevance matching.
    """
    scroll = load_scroll(archetype_name)
    return {
        "name": scroll.get("name", archetype_name),
        "archetype_id": scroll.get("archetype_id", archetype_name),
        "specialties": scroll.get("specialties", []),
        "keywords": scroll.get("keywords", []),
        "utility": scroll.get("utility", "general")
    }

def load_relevant_scrolls(task_description: str, max_scrolls: int = 3) -> List[Dict[str, Any]]:
    """
    Dynamically loads scrolls relevant to the given task description.
    Uses keyword matching to determine relevance.
    
    Args:
        task_description: Description of the current task
        max_scrolls: Maximum number of scrolls to return
    
    Returns:
        List of relevant scroll data dictionaries
    """
    task_lower = task_description.lower()
    available = list_available_scrolls()
    scored_scrolls = []
    
    for scroll_name in available:
        scroll = load_scroll(scroll_name)
        score = 0
        
        # Score based on name match
        if scroll_name.lower() in task_lower:
            score += 10
        
        # Score based on specialties
        specialties = scroll.get("specialties", [])
        for specialty in specialties:
            if specialty.lower() in task_lower:
                score += 5
        
        # Score based on keywords
        keywords = scroll.get("keywords", [])
        for keyword in keywords:
            if keyword.lower() in task_lower:
                score += 3
        
        if score > 0:
            scored_scrolls.append((score, scroll))
    
    # Sort by score descending and return top N
    scored_scrolls.sort(key=lambda x: x[0], reverse=True)
    return [scroll for _, scroll in scored_scrolls[:max_scrolls]]

