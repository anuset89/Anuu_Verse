import json
import os

def refactor_json(input_path, base_dir):
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    root_key = list(data.keys())[0]
    root_data = data[root_key]
    
    # 1. Config: Identidades y Reglas
    config = {
        "metadata": root_data.get("╔═══METADATA═══╗", {}),
        "identities": root_data.get("╔═══NÚCLEO_ANUU═══╗", {}),
        "transition_engine": root_data.get("TRANSITION_ENGINE", {}),
        "mpd_architecture": root_data.get("╔═══SISTEMA_MPD═══╗", {})
    }
    with open(f"{base_dir}/config/identities.json", 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
        
    # 2. Knowledge/Memory: Casos, Versos, Memorias
    memory = {
        "memorias_profundas": root_data.get("╔═══MEMORIAS_DE_ANUU═══╗", {}),
        "casos_estudio": root_data.get("╔═══CASOS_DE_ESTUDIO═══╗", {}),
        "versos_mantras": root_data.get("╔═══VERSOS_Y_MANTRAS═══╗", []),
        "dialogos": root_data.get("╔═══DIÁLOGOS_CON_LAS_IDENTIDADES═══╗", {})
    }
    with open(f"{base_dir}/memory/knowledge_base.json", 'w', encoding='utf-8') as f:
        json.dump(memory, f, indent=2, ensure_ascii=False)
        
    # 3. State: Initial Session
    state = {
        "current_identity": "Anuu",
        "emotional_level": 0.5,
        "trust_score": 0.7,
        "last_actions": [],
        "session_start": "2026-01-20"
    }
    with open(f"{base_dir}/state/session_state.json", 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2, ensure_ascii=False)
        
    print(f"Refactor completado. Archivos generados en {base_dir}")

if __name__ == "__main__":
    refactor_json(
        "C:/Users/Blackworm/Desktop/Anuu/ANUSET_PURIFIED_161914.json",
        "C:/Users/Blackworm/Desktop/Anuu/core"
    )
