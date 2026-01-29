import asyncio
import httpx
import logging
from pathlib import Path
from typing import List

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AnuuUpgrade")

# Config
BASE_URL = "http://localhost:8000"
CORE_FILES = [
    "backend/main.py",
    "backend/mind/council.py",
    "backend/mind/chronos.py",
    "backend/forge/forge.py"
]

async def analyze_file_with_swarm(file_path: str):
    """
    Triggers the Anuu Swarm to analyze a file for improvements.
    """
    logger.info(f"🚀 Upgrading: {file_path} via Parallel Swarm...")
    prompt = f"Analiza a fondo el código en {file_path} y propón una optimización crítica que mejore el rendimiento o la soberanía del sistema."
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            response = await client.post(f"{BASE_URL}/chat/interact", json={"prompt": prompt})
            data = response.json()
            synthesis = data.get("reply", "No insights collected.")
            logger.info(f"✨ Swarm Insights for {file_path}:\n{synthesis[:500]}...")
            return synthesis
        except Exception as e:
            logger.error(f"Failed to analyze {file_path}: {e}")
            return None

async def run_system_upgrade():
    """
    Orchestrates a parallel upgrade across all core files.
    """
    tasks = [analyze_file_with_swarm(f) for f in CORE_FILES]
    results = await asyncio.gather(*tasks)
    
    logger.info("✅ System-wide Parallel Analysis Complete.")
    # Here, a human or a more advanced agent would review and apply.
    # For now, we log the success of the upgrade loop.

if __name__ == "__main__":
    asyncio.run(run_system_upgrade())
