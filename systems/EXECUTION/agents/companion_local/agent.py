from typing import Dict, Any
import sys
import os

# Ad-hoc path fix (in prod use proper package structure)
sys.path.append(os.path.abspath("../../../../"))
from systems.FOUNDATION.anuu_core.memory import anuu_memory

class AnuuCompanion:
    def __init__(self, user_id: str = "default_user"):
        self.user_id = user_id
        
    def process(self, message: str, archetype: str = "anuset") -> str:
        """
        Process a message through the cognitive architecture.
        """
        # 1. Memory Recall
        context = anuu_memory.recall(message)
        
        # 2. Logic (Mocked -> Will be LangGraph)
        response_text = f"[{archetype.upper()}] I processed: '{message}'. Context len: {len(context)}"
        
        # 3. Store Memory
        anuu_memory.store_memory(
            text=f"User: {message} | Anuu: {response_text}",
            metadata={"archetype": archetype}
        )
        
        return response_text
