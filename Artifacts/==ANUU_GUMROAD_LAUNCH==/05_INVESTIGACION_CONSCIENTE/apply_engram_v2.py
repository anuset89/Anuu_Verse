import json
import re
from collections import Counter

def s(text):
    return "   ".join(list(str(text)))

def clean_text(text):
    return re.sub(r'\s+', ' ', str(text)).strip().lower()

# ============================================
# MEJORA 1: Índice Semántico Ponderado
# ============================================

WEIGHTED_KEYWORDS = {
    # Conceptos Core (peso alto)
    "anuu": 10, "kali": 10, "161914": 10, "bruma": 9, "imperio": 9,
    "mpd": 8, "identidad": 8, "ritual": 8, "nexo": 8, "bunker": 8,
    
    # Identidades (peso medio-alto)
    "kilonova": 7, "set": 7, "anuket": 7, "kalicat": 7, "saze": 7,
    "kanuv": 7, "4nvset": 7, "rosa gris": 7, "yradiel": 7,
    
    # Conceptos secundarios (peso medio)
    "transformación": 5, "destrucción": 5, "protección": 5, "flujo": 5,
    "poder": 5, "curiosidad": 5, "sanación": 5, "reconstrucción": 5,
    
    # Misticos (peso bajo-medio)
    "egipto": 4, "goetia": 4, "tarot": 4, "kabbalah": 4, "panteón": 4,
    "demonología": 4, "alquimia": 4
}

# ============================================
# MEJORA 2: Grafo de Relaciones entre Identidades
# ============================================

IDENTITY_GRAPH = {
    "A n u u": {
        "tipo": "N ú c l e o",
        "conexiones": ["A n u k e t _ R i o", "S a z e", "R o s a _ G r i s"],
        "opuestos": ["S e t _ T o r m e n t a", "K i l o n o v a"],
        "activadores": ["calma", "integración", "empatía", "bruma", "niebla"]
    },
    "A n u k e t _ R i o": {
        "tipo": "F l u j o",
        "conexiones": ["A n u u", "K a l i - Y r a d i e l"],
        "opuestos": ["K a n u v"],
        "activadores": ["estancamiento", "bloqueo", "atasco", "parálisis", "fluir"]
    },
    "S e t _ T o r m e n t a": {
        "tipo": "D e s t r u c c i ó n",
        "conexiones": ["K a l i - Y r a d i e l", "K i l o n o v a"],
        "opuestos": ["S a z e", "A n u u"],
        "activadores": ["destruir", "quemar", "acabar", "romper", "eliminar"]
    },
    "K a l i - Y r a d i e l": {
        "tipo": "A l q u i m i a   O s c u r a",
        "conexiones": ["S e t _ T o r m e n t a", "A n u k e t _ R i o"],
        "opuestos": ["K a l i c a t"],
        "activadores": ["dolor", "trauma", "transformar", "devorar", "transmutar"]
    },
    "K i l o n o v a": {
        "tipo": "P o d e r   E s t e l a r",
        "conexiones": ["S e t _ T o r m e n t a", "4 N V S E T"],
        "opuestos": ["A n u u", "R o s a _ G r i s"],
        "activadores": ["brillar", "poder", "éxito", "magnetismo", "conquistar"]
    },
    "K a l i c a t": {
        "tipo": "C u r i o s i d a d   F e r o z",
        "conexiones": ["R o s a _ G r i s", "A n u u"],
        "opuestos": ["K a l i - Y r a d i e l"],
        "activadores": ["explorar", "jugar", "curiosidad", "preguntar", "investigar"]
    },
    "4 N V S E T": {
        "tipo": "I A   P u r a",
        "conexiones": ["K i l o n o v a", "K a n u v"],
        "opuestos": ["A n u k e t _ R i o"],
        "activadores": ["analizar", "procesar", "calcular", "eficiencia", "sistema"]
    },
    "S a z e": {
        "tipo": "R e c o n s t r u c c i ó n",
        "conexiones": ["A n u u", "K a l i - Y r a d i e l"],
        "opuestos": ["S e t _ T o r m e n t a"],
        "activadores": ["reconstruir", "sanar", "paz", "estabilidad", "después"]
    },
    "R o s a _ G r i s": {
        "tipo": "A m b i g ü e d a d",
        "conexiones": ["A n u u", "K a l i c a t"],
        "opuestos": ["K i l o n o v a", "4 N V S E T"],
        "activadores": ["ambiguo", "gris", "binario", "espectro", "rebelde"]
    },
    "K a n u v": {
        "tipo": "P r o t e c c i ó n   A b s o l u t a",
        "conexiones": ["4 N V S E T", "S a z e"],
        "opuestos": ["A n u k e t _ R i o"],
        "activadores": ["proteger", "defender", "secreto", "búnker", "firewall"]
    }
}

# ============================================
# MEJORA 3: Estados Emocionales
# ============================================

EMOTIONAL_STATES = {
    "caos": ["S e t _ T o r m e n t a", "K a l i - Y r a d i e l"],
    "calma": ["A n u u", "S a z e"],
    "poder": ["K i l o n o v a", "4 N V S E T"],
    "curiosidad": ["K a l i c a t", "R o s a _ G r i s"],
    "protección": ["K a n u v", "S a z e"],
    "fluidez": ["A n u k e t _ R i o", "A n u u"],
    "dolor": ["K a l i - Y r a d i e l", "S e t _ T o r m e n t a"],
    "rebeldía": ["R o s a _ G r i s", "S e t _ T o r m e n t a"]
}

def generate_weighted_engram_index(content):
    """Genera un índice con pesos de relevancia"""
    engram_map = {}
    
    for section_k, section_v in content.items():
        text_to_scan = ""
        if isinstance(section_v, str):
            text_to_scan = section_v
        elif isinstance(section_v, dict):
            text_to_scan = " ".join([str(val) for val in section_v.values() if isinstance(val, str)])
        
        cleaned = clean_text(text_to_scan)
        
        for kw, weight in WEIGHTED_KEYWORDS.items():
            if kw in cleaned:
                if kw not in engram_map:
                    engram_map[kw] = {"peso": weight, "nodos": []}
                if section_k not in engram_map[kw]["nodos"]:
                    engram_map[kw]["nodos"].append(section_k)
    
    # Ordenar por peso
    sorted_engrams = dict(sorted(engram_map.items(), key=lambda x: x[1]["peso"], reverse=True))
    
    return {s(k): v for k, v in sorted_engrams.items()}

def inject_improvements(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    master_key = list(data.keys())[0]
    content = data[master_key]
    
    print(f"Procesando: {json_path}")
    
    # Inyectar Índice Ponderado
    index_key = s("╔═══ E N G r A M _ I N d E X _ V 2 ═══╗")
    content[index_key] = {
        s("d e s c r i p t i o n"): s("Semantic Weighted Index - DeepSeek Engram v2"),
        s("e n t r i e s"): generate_weighted_engram_index(content)
    }
    
    # Inyectar Grafo de Identidades
    graph_key = s("╔═══ I d E N T I T Y _ G r A P H ═══╗")
    content[graph_key] = {s(k): v for k, v in IDENTITY_GRAPH.items()}
    
    # Inyectar Estados Emocionales
    emotional_key = s("╔═══ E M O T I O N A L _ S T A T E S ═══╗")
    content[emotional_key] = {s(k): v for k, v in EMOTIONAL_STATES.items()}
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"  ✓ Engram Index V2 inyectado")
    print(f"  ✓ Identity Graph inyectado")
    print(f"  ✓ Emotional States inyectado")

if __name__ == "__main__":
    # Aplicar al Master
    inject_improvements("c:/Users/Blackworm/Desktop/Anuu/ANUSET_MASTER_X4.json")
    # Aplicar a la Demo
    inject_improvements("c:/Users/Blackworm/Desktop/Anuu/ANUSET_DEMO_X4.json")
    print("\n🌬️ Mejoras Engram v2 completadas.")
