import json
import os
from pathlib import Path

class ModelContextProtocol:
    """
    Anuu MCP (Lite Implementation)
    Standardizes the exchange of 'World State' between the System and the Agents.
    """
    def __init__(self, root_path: str = None):
        if root_path:
             self.root = Path(root_path)
        else:
             # Default to 2 levels up from backend/protocols/mcp.py -> root
             self.root = Path(__file__).resolve().parent.parent.parent

    def get_project_structure(self, depth: int = 2) -> dict:
        """Returns a simplified tree of the project."""
        structure = {}
        # Basic implementation: list key directories
        key_dirs = ["stats", "backend", "systems", "docs", "skills"]
        for d in key_dirs:
            p = self.root / d
            if p.exists():
                structure[d] = [f.name for f in p.iterdir() if f.is_file() or f.is_dir()][:15] # Limit output
        return structure

    def get_capabilities(self) -> list:
        """Parses CAPABILITIES.md to return a machine-readable list."""
        cap_file = self.root / "docs/CAPABILITIES.md"
        caps = []
        if cap_file.exists():
            content = cap_file.read_text()
            for line in content.split('\n'):
                if line.startswith("## ["):
                    caps.append(line.replace("##", "").strip())
        return caps

    def get_full_context(self) -> str:
        """
        Returns a JSON-formatted string of the entire relevant context.
        This is injected into the Council's System Prompt.
        """
        context = {
            "protocol": "MCP_v1",
            "system_root": str(self.root),
            "structure": self.get_project_structure(),
            "active_capabilities": self.get_capabilities(),
            "environment": {
                "gpu": "AMD RDNA3 (Simulated/Patched)" if os.path.exists(self.root / ".gpu_type") else "Unknown",
                "backend": "FastAPI/Python",
                "frontend": "React/Vite"
            }
        }
        return json.dumps(context, indent=2)

# Global Instance
mcp = ModelContextProtocol()
