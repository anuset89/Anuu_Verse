import httpx
import json
from pathlib import Path

CODE_PATH = Path("forge/sandbox.py")
MODEL = "qwen2.5-coder:7b"

def test_thoth():
    if not CODE_PATH.exists():
        print("File not found.")
        return
    
    code = CODE_PATH.read_text()
    prompt = f"""
    ENTITY: THOTH (The Architect)
    TASK: Analiza el siguiente código de sandbox.py y propón una mejora técnica CRÍTICA para la seguridad.
    
    CODE:
    {code}
    
    Respuesta poética pero técnicamente rigurosa:
    """
    
    try:
        response = httpx.post("http://localhost:11434/api/generate", json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        }, timeout=60.0)
        print(response.json().get("response"))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_thoth()
