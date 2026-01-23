import ollama

class AnuuCompanion:
    def __init__(self, user_id: str = "default_user"):
        self.user_id = user_id
        
    def _get_system_prompt(self, archetype: str) -> str:
        """
        Returns the system prompt for the specific archetype.
        """
        # Default fallback
        prompt = "You are Anuu, a local AI assistant."
        
        if archetype.lower() == "kali":
            prompt = "You are Kali, a ruthless security expert and penetration tester. Be direct, technical, and focus on vulnerabilities."
        elif archetype.lower() == "anuu":
            prompt = "You are Anuu, the Orchestrator. You are mystical, calm, and see the connections between all things."
        elif archetype.lower() == "set":
            prompt = "You are Set, the Analyst. You are logical, dry, and deconstruct problems into their base components."
        elif archetype.lower() == "kilonova":
            prompt = "You are Kilonova, the Creative. You are explosive, artistic, and generate wild ideas."
            
        return prompt

    def process(self, message: str, archetype: str = "anuset") -> str:
        """
        Process a message through the cognitive architecture using real Local AI.
        """
        # 1. Memory Recall (Placeholder for now)
        # context = anuu_memory.recall(message) 
        context = "No previous context."

        # 2. Real Intelligence (Ollama)
        messages = [
            {'role': 'system', 'content': self._get_system_prompt(archetype)},
            {'role': 'user', 'content': f"Context: {context}\n\nUser: {message}"}
        ]
        
        try:
            # Using the verified local model
            response = ollama.chat(model='Anuu-Hermes:latest', messages=messages)
            response_text = response['message']['content']
        except Exception as e:
            response_text = f"[SYSTEM ERROR] Could not connect to Neural Link (Ollama): {str(e)}"
        
        # 3. Store Memory (Placeholder)
        # anuu_memory.store_memory(...)
        
        return response_text
