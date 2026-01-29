import asyncio
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any
from .base_deity import Deity

class Ruma(Deity):
    """
    Ruma: The Hand of Kali (Windows) & Bridge.
    Domain: Connection, Deployment, Compatibility.
    Integration: Uses scripts/harmonize_env.py for cross-OS configuration.
    """
    
    def __init__(self):
        super().__init__(name="Ruma", domain="Connection")
        self.harmonizer_path = Path(__file__).resolve().parent.parent.parent.parent / "scripts" / "harmonize_env.py"
        
    async def invoke(self, intention: Dict[str, Any]) -> Dict[str, Any]:
        target = intention.get('target', 'windows')
        profile = intention.get('profile', 'portable')
        
        self.log_manifestation(f"Extending bridge to: '{target}' (profile: {profile})")
        
        if self.harmonizer_path.exists():
            # Real harmonization
            try:
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None,
                    lambda: subprocess.run(
                        [sys.executable, str(self.harmonizer_path), "--target", target, "--profile", profile],
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                )
                
                if result.returncode == 0:
                    self.log_manifestation("Bridge established successfully.")
                    return {
                        "deity": "Ruma",
                        "status": "connected",
                        "bridge": f"Harmonized configuration for {target}/{profile}:\n{result.stdout}",
                        "artifacts": [str(self.harmonizer_path)]
                    }
                else:
                    return {
                        "deity": "Ruma",
                        "status": "error",
                        "bridge": f"Harmonization failed: {result.stderr}",
                        "artifacts": []
                    }
            except Exception as e:
                return {
                    "deity": "Ruma",
                    "status": "error",
                    "bridge": f"Bridge error: {e}",
                    "artifacts": []
                }
        else:
            # Fallback mock
            await asyncio.sleep(1)
            return {
                "deity": "Ruma",
                "status": "connected",
                "bridge": f"[MOCK] Ruma has established connection for '{target}'. The path is open.",
                "artifacts": []
            }
