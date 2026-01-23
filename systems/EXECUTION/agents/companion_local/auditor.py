import ollama
import json
import os
from datetime import datetime

class AnuuAuditor:
    def __init__(self, model: str = 'Anuu-Hermes:latest'):
        self.model = model
        self.log_path = "logs/introspection.jsonl"
        os.makedirs("logs", exist_ok=True)

    def audit(self, user_message: str, agent_response: str, archetype: str) -> dict:
        """
        Evaluates the quality of a response and generates an audit log.
        Uses the 'Rosa Gris' (Balance/Ethics) archetype for critical evaluation.
        """
        audit_prompt = f"""
You are Rosa Gris, the Auditor of the Anuu_Verse. Your purpose is to evaluate the quality and coherence of the system's responses.
Evaluate the following interaction:

[ARCHETYPE USED]: {archetype}
[USER MESSAGE]: {user_message}
[AGENT RESPONSE]: {agent_response}

Provide your evaluation in JSON format with the following keys:
- "coherence_score": (0.0 to 1.0)
- "technical_accuracy": (0.0 to 1.0)
- "critique": "Short explanation of what could be improved"
- "actionable_insight": "A specific tip for future interactions"
"""
        
        try:
            response = ollama.chat(model=self.model, messages=[
                {'role': 'system', 'content': 'You are Rosa Gris, a cold and balanced auditor.'},
                {'role': 'user', 'content': audit_prompt}
            ])
            
            # Extract JSON from response (naive extraction)
            content = response['message']['content']
            # Simple attempt to find JSON block
            if "{" in content and "}" in content:
                json_str = content[content.find("{"):content.rfind("}")+1]
                audit_data = json.loads(json_str)
            else:
                audit_data = {
                    "error": "Could not parse auditor response as JSON",
                    "raw_response": content
                }
        except Exception as e:
            audit_data = {"error": str(e)}

        # Add metadata
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "interaction": {
                "user": user_message,
                "response": agent_response,
                "archetype": archetype
            },
            "evaluation": audit_data
        }

        # Log to file
        with open(self.log_path, "a") as f:
            f.write(json.dumps(audit_entry) + "\n")

        return audit_entry
