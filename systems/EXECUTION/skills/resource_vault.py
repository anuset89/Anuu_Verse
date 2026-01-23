import json
import os
from typing import List, Dict, Optional

class ResourceVault:
    """
    The Librarian. Manages physical assets (LoRAs, Checkpoints) and their metadata.
    """
    def __init__(self, library_path: str = "models/library.json"):
        self.library_path = library_path
        self.models_root = "models"
        self._load_library()

    def _load_library(self):
        if os.path.exists(self.library_path):
            with open(self.library_path, 'r') as f:
                self.library = json.load(f)
        else:
            self.library = {"checkpoints": [], "loras": [], "embeddings": []}

    def get_lora(self, name_query: str) -> Optional[Dict]:
        """Finds a LoRA by loose name matching."""
        name_query = name_query.lower()
        for lora in self.library['loras']:
            if name_query in lora['name'].lower():
                return lora
        return None

    def scan_local_files(self):
        """
        Scans models/ folders and updates registry with found .safetensors.
        (Placeholder for auto-discovery logic)
        """
        # Logic to scan directories and add unknown files to library.json
        pass
    
    def list_resources(self) -> str:
        """Returns a formatted string of available resources for the Agent."""
        txt = "Available Resources (The Vault):\n"
        txt += "Checkpoints:\n"
        for ckpt in self.library['checkpoints']:
            txt += f" - {ckpt['name']} (Triggers: {ckpt.get('trigger_words', [])})\n"
        
        txt += "\nLoRAs:\n"
        for lora in self.library['loras']:
            txt += f" - {lora['name']} (Triggers: {lora.get('trigger_words', [])})\n"
            
        return txt
