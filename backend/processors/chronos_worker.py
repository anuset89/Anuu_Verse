import asyncio
import logging
from mind.chronos import chronos

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ChronosWorker")

async def run_worker():
    logger.info("🕒 CHRONOS WORKER: Monitoring temporal threads...")
    while True:
        try:
            # Check raw history size
            history_file = chronos.current_history_file
            if history_file.exists():
                size_mb = history_file.stat().st_size / (1024 * 1024)
                if size_mb > 5.0: # Compress if > 5MB
                    logger.info(f"📦 History reached {size_mb:.2f}MB. Triggering fractal compression...")
                    await chronos.fractal_compress()
            
            # Also trigger once every 6 hours regardless of size
            await asyncio.sleep(21600) 
            
        except Exception as e:
            logger.error(f"Worker Error: {e}")
            await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(run_worker())
