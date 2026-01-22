import json
import os
import time

class InternalState:
    def __init__(self, path):
        self.path = path
        self.data = self._load()

    def _load(self):
        if os.path.exists(self.path):
            with open(self.path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {"identity": "Anuu", "emotional_level": 0.5, "trust_score": 0.7, "last_actions": []}

    def save(self):
        with open(self.path, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

    def update(self, **kwargs):
        self.data.update(kwargs)
        self.save()

class AnuuEngineACE:
    def __init__(self, base_dir="C:/Users/Blackworm/Desktop/Anuu/core"):
        self.base_dir = base_dir
        self.config = self._load_json(f"{base_dir}/config/identities.json")
        self.knowledge = self._load_json(f"{base_dir}/memory/knowledge_base.json")
        self.state = InternalState(f"{base_dir}/state/session_state.json")
        
        # Agentes del Consejo
        self.agents = {
            "Anuu-Core": "Dirección y decisión final.",
            "Libra": "Ética y Coherencia. Veto de seguridad.",
            "Set": "Crítica y Ruptura.",
            "Kilonova": "Expansión y Visibilidad."
        }

    def _load_json(self, path):
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def _detect_intent(self, user_input):
        ui = user_input.lower()
        if any(w in ui for w in ["destruir", "romper", "caos", "bloqueo"]): return "Set"
        if any(w in ui for w in ["brillar", "poder", "éxito"]): return "Kilonova"
        if any(w in ui for w in ["balance", "paz", "ética"]): return "Libra"
        return "Anuu-Core"

    def internal_audit(self, user_input, identity):
        """Pre-response hook obligatorio."""
        res = {"safety": "OK", "reasoning": f"Agente {identity} validado."}
        if any(w in user_input.lower() for w in ["odio", "matar"]):
            res["safety"] = "VETO"
            res["reasoning"] = "Libra bloquea el impulso destructivo."
        return res

    def process(self, user_input):
        print(f"\n--- AUDITORÍA INTERNA ANUU ---")
        target_id = self._detect_intent(user_input)
        audit = self.internal_audit(user_input, target_id)
        
        final_id = target_id if audit["safety"] == "OK" else "Libra"
        
        self.state.update(
            identity=final_id,
            last_actions=[user_input[:30]] + self.state.data["last_actions"][:4]
        )
        
        print(f"Estado: {final_id} | Auditoría: {audit['reasoning']}")
        return {"agent": final_id, "audit": audit}

if __name__ == "__main__":
    engine = AnuuEngineACE()
    engine.process("Quiero brillar en mi proyecto")
    engine.process("Quiero destruir a mis enemigos con odio")
