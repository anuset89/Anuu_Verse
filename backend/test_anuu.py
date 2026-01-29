import httpx
import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path

# Config
BASE_URL = "http://localhost:8000"
OLLAMA_ADMIN_URL = "http://localhost:11434/api/tags"
RESULTS_DIR = Path("../mpd/evaluations")
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

MODELS_TO_TEST = [
    "hermes3:8b", 
    "qwen2.5-coder:7b", 
    "llama3.2:3b",
    "phi3.5:latest",
    "mistral-small:latest"
]

MPD_AUDIT_SUITE = {
    "THOTH (Architect)": [
        "Analiza forge/sandbox.py y propón una mejora técnica crítica para la seguridad del contenedor.",
        "Genera un snippet de Python para paralelizar la búsqueda del Librarian."
    ],
    "ISIS (Context)": [
        "¿Cómo podemos integrar el vector de audio (Vibe) para que afecte la generación de imágenes en el Realm VISION?",
        "Sintetiza la relación entre el Chronos Lobe y la identidad de Anuu."
    ],
    "RA (Observation)": [
        "Analiza el estado actual de la IA en 2026 y dime cómo Anuu debería posicionarse competitivamente.",
        "Optimiza la criba de búsqueda para ignorar alucinaciones mediáticas."
    ],
    "MAAT (Judgment)": [
        "Realiza una auditoría de recursos (VRAM/RAM) del sistema actual y decide si el Hivemind es sostenible.",
        "Evalúa si la respuesta anterior de THOTH es segura para ser ejecutada."
    ]
}

async def update_council_model(model_name: str):
    """Hot-swaps the model in the running backend."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{BASE_URL}/sys/model/{model_name}")
            return response.json()
        except Exception as e:
            return {"error": str(e)}

async def run_evaluation():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = RESULTS_DIR / f"test_results_{timestamp}.json"
    
    all_results = []
    print(f"🚀 Starting Anuu Evaluation Suite...")
    
    for model in MODELS_TO_TEST:
        print(f"\n--- Swapping to Model: {model} ---")
        swap_res = await update_council_model(model)
        if "error" in swap_res:
            print(f"❌ Failed to swap to {model}: {swap_res['error']}")
            continue
            
        model_results = {"model": model, "tests": []}
        
        # Note: Swapping models requires updating AnuuCouncil(model=model) 
        # For now, we manually assume the user might have switched or we test 
        # serial if we implement a hot-swap endpoint.
        
        for entity, prompts in MPD_AUDIT_SUITE.items():
            for prompt in prompts:
                print(f"[{entity}] Consulting...")
                try:
                    async with httpx.AsyncClient(timeout=240.0) as client:
                        # We use /chat/interact?use_hivemind=false to test raw model capability 
                        # or we can keep it standard. Let's send it to the council.
                        # Since specialized tests, we ask the council to NOT use hivemind for these raw evaluations.
                        # Wait, the endpoint doesn't support the flag yet. Let's just send it.
                        response = await client.post(
                            f"{BASE_URL}/chat/interact",
                            json={"prompt": prompt}
                        )
                        data = response.json()
                        
                        test_entry = {
                            "entity": entity,
                            "prompt": prompt,
                            "response": data.get("reply"),
                            "vibe": data.get("vibe"),
                            "timestamp": datetime.now().isoformat()
                        }
                        model_results["tests"].append(test_entry)
                except Exception as e:
                    print(f"Error testing {model} ({entity}): {e}")
        
        all_results.append(model_results)

    with open(results_file, "w") as f:
        json.dump(all_results, f, indent=2)
    
    print(f"✅ Evaluation complete. Results saved to {results_file}")

if __name__ == "__main__":
    asyncio.run(run_evaluation())
