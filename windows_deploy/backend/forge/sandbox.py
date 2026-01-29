import subprocess
import logging
from pathlib import Path
from typing import Tuple, Optional

logger = logging.getLogger("Forge_Sandbox")

class ForgeSandbox:
    """
    The Immune System: Executes untrusted code in a hardened Docker container.
    """
    def __init__(self):
        # backend/forge/tmp_sandbox
        self.workdir = Path(__file__).parent / "tmp_sandbox"
        self.workdir.mkdir(parents=True, exist_ok=True)
        # The sandbox_image is now hardcoded or needs to be passed to run_code if it's not a class attribute
        # For now, we'll hardcode it as it was the default.
        self.image = "python:3.11-slim"

    def run_code(self, code: str, timeout: int = 5) -> Tuple[bool, str]:
        """
        Runs the provided Python code inside the sandbox.
        Returns (Success, Output/Error).
        """
        script_path = self.workdir / "runner.py"
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        # Docker Command Construction
        # --rm: Remove container after run
        # --network none: No internet access
        # --memory 256m: Limit memory
        # -v: Mount the specific script file
        cmd = [
            "docker", "run", "--rm",
            "--network", "none",
            "--memory", "512m",
            "--cpus", "0.5",
            "-v", f"{script_path}:/app/runner.py:ro",
            self.image,
            "python", "/app/runner.py"
        ]

        try:
            logger.info(f"Sandbox: Executing code ({len(code)} chars)...")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            if result.returncode == 0:
                return True, result.stdout.strip()
            else:
                return False, result.stderr.strip() or result.stdout.strip()

        except subprocess.TimeoutExpired:
            return False, f"Execution timed out after {timeout}s."
        except Exception as e:
            logger.error(f"Sandbox failure: {e}")
            return False, str(e)

# Component instance
sandbox = ForgeSandbox()
