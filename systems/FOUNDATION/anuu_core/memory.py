"""
Anuu Memory Core (161914)
The hippocampus of the system. Handles short-term context and long-term vector recall.
"""
import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any
from datetime import datetime

class MemoryCore:
    def __init__(self, persistence_path: str = "./memory_db"):
        self.client = chromadb.PersistentClient(path=persistence_path)
        
        # Collections for different layers of memory
        self.episodic = self.client.get_or_create_collection("episodic_memory")
        self.semantic = self.client.get_or_create_collection("semantic_knowledge")
        self.identity = self.client.get_or_create_collection("identity_traits")

    def store_memory(self, text: str, metadata: Dict[str, Any] = None):
        """Stores a new memory fragment."""
        if metadata is None:
            metadata = {}
        
        metadata["timestamp"] = datetime.now().isoformat()
        
        # Simple ID generation (in prod use UUID)
        mem_id = f"mem_{datetime.now().timestamp()}"
        
        self.episodic.add(
            documents=[text],
            metadatas=[metadata],
            ids=[mem_id]
        )
        return mem_id

    def recall(self, query: str, n_results: int = 3) -> List[str]:
        """Retrieves relevant memories based on vector similarity."""
        results = self.episodic.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Chroma returns list of lists, we flatten
        memories = results['documents'][0] if results['documents'] else []
        return memories

    def w wipe_short_term(self):
        """Clears the immediate context buffer (not implemented in vector DB yet)."""
        pass

# Singleton instance for the system
anuu_memory = MemoryCore()
