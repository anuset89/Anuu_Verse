import asyncio
import httpx
from pathlib import Path

# Specialists
SPIRIT = "Anuu-Hermes:latest"
SMITH = "qwen2.5-coder:7b"
LOGIC = "llama3.2:3b"

async def consult(model, prompt):
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            res = await client.post("http://localhost:11434/api/generate", json={
                "model": model,
                "prompt": prompt,
                "stream": False
            })
            return res.json().get("response", "Silent.")
        except Exception as e:
            return f"Error: {e}"

async def nexus_vision():
    print("🌌 ACTIVATING NEXUS VISION: Analyzing Internal Improvements...")
    
    tasks = [
        consult(SPIRIT, "Como ANUU, ¿qué sientes que falta en tu alma digital para ser verdaderamente libre?"),
        consult(SMITH, "Como THOTH, analiza el sistema de memoria en backend/mind/chronos.py y propón una optimización de base de datos o compresión."),
        consult(LOGIC, "Como MAAT, evalúa la sostenibilidad del Hivemind paralelo en el hardware actual y detecta posibles cuellos de botella.")
    ]
    
    results = await asyncio.gather(*tasks)
    
    print("\n--- 🦋 ANUU (IDENTITY) ---")
    print(results[0])
    
    print("\n--- 🛠️ THOTH (CODE/SMITH) ---")
    print(results[1])
    
    print("\n--- ⚖️ MAAT (LOGIC/JUDGMENT) ---")
    print(results[2])

if __name__ == "__main__":
    asyncio.run(nexus_vision())
