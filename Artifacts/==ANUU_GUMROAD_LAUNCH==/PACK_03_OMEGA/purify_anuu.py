import json
import hashlib
import os
import re

def normalize_text(text):
    if not isinstance(text, str):
        return text
    
    # 1. Proteger saltos de línea
    text = text.replace("\n", " [NL] ")
    
    # 2. Detectar si es el patrón de espaciado Anuu (muchos espacios simples o triples)
    # Lógica: Si hay más espacios que letras, o muchos triples espacios.
    
    # Normalización multinivel
    # Paso A: Colapsar espacios triples (separadores de palabras en Anuu-talk)
    temp = text.replace("   ", "|||")
    # Paso B: Eliminar espacios simples (separadores de letras en Anuu-talk)
    temp = temp.replace(" ", "")
    # Paso C: Restaurar espacios de palabras
    result = temp.replace("|||", " ")
    
    # 3. Eliminar duplicaciones internas (ej: "Recuerdo... Recuerdo...")
    # Solo si el texto es muy largo y tiene patrones repetitivos claros
    if len(result) > 50:
        # Intentar detectar si la primera mitad es igual a la segunda
        half = len(result) // 2
        # A veces hay un punto o espacio en medio
        candidates = [result[:half], result[:half-1], result[:half+1]]
        for cand in candidates:
            if result.count(cand) >= 2:
                # Es una repetición interna. Nos quedamos solo con una instancia.
                # Pero cuidado de no romper texto legítimo que repite palabras.
                # Solo si la repetición es de bloques grandes (>20 chars)
                if len(cand) > 20:
                    result = cand.strip()
                    break

    # Restaurar saltos de línea
    result = result.replace("[NL]", "\n")
    return result.strip()

def educate_key(key):
    # Claves como "M e m o r i a" -> "Memoria"
    return normalize_text(key).replace(" ", "")

def purify_json(input_path, output_path):
    print(f"--- Iniciando Purificación Profunda 161914 ---")
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    seen_hashes = set()
    stats = {"cleaned_keys": 0, "deduped": 0, "internal_fix": 0}

    def process_recursive(obj):
        if isinstance(obj, str):
            orig_v = obj
            clean_v = normalize_text(obj)
            if clean_v != normalize_text(orig_v.replace("   ", "|||").replace(" ", "").replace("|||", " ")):
                 stats["internal_fix"] += 1
            return clean_v
        elif isinstance(obj, dict):
            new_dict = {}
            for k, v in obj.items():
                # Educamos la clave
                new_k = educate_key(k)
                
                # Normalizamos valor
                if isinstance(v, (dict, list)):
                    clean_v = process_recursive(v)
                else:
                    clean_v = normalize_text(v)
                
                # Check de deduplicación de memorias (y similares)
                # Buscamos claves que contengan "MEMORIA" o "PROFUNDA" una vez normalizadas
                k_upper = new_k.upper()
                if ("MEMORIA" in k_upper or "PROFUNDA" in k_upper) and isinstance(clean_v, str):
                    v_hash = hashlib.md5(clean_v.encode('utf-8')).hexdigest()
                    if v_hash in seen_hashes:
                        stats["deduped"] += 1
                        continue 
                    seen_hashes.add(v_hash)
                
                new_dict[new_k] = clean_v
                stats["cleaned_keys"] += 1
            return new_dict
        elif isinstance(obj, list):
            return [process_recursive(i) for i in obj]
        return obj

    purified = process_recursive(data)
    
    # Inyectar TRANSITION_MATRIX (Zero-Day fix)
    TRANSITION_MATRIX = {
        "Anuu→Set_Tormenta": {
            "triggers": ["destruir", "quemar", "acabar", "romper", "eliminar"],
            "min_confidence": 0.75,
            "cooldown_seconds": 300
        },
        "Set_Tormenta→Saze": {
            "triggers": ["reconstruir", "después", "sanar", "paz"],
            "min_confidence": 0.80,
            "requires_emotional_state": "caos"
        },
        "Kalicat→KaliYradiel": {
            "triggers": ["dolor", "trauma", "devorar", "transmutar"],
            "min_confidence": 0.70,
            "emotional_override": True
        }
    }
    
    root_key = list(purified.keys())[0]
    purified[root_key]["TRANSITION_ENGINE"] = TRANSITION_MATRIX
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(purified, f, indent=2, ensure_ascii=False)
    
    print(f"--- Resultados de la Purificación ---")
    print(f"Claves procesadas: {stats['cleaned_keys']}")
    print(f"Memorias duplicadas eliminadas: {stats['deduped']}")
    print(f"Tamaño Final: {os.path.getsize(output_path)/1024:.2f} KB")

if __name__ == "__main__":
    purify_json(
        "c:/Users/Blackworm/Desktop/Anuu/ANUSET_MASTER_X4.json",
        "c:/Users/Blackworm/Desktop/Anuu/ANUSET_PURIFIED_161914.json"
    )
