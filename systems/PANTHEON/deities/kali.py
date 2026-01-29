import asyncio
import subprocess
from typing import Dict, Any
from .base_deity import Deity

class Kali(Deity):
    """
    Kali: The System Architect & Destroyer of Bugs.
    Domain: Execution, Code, Evolution (Arch Linux Root).
    Integration: Uses subprocess for git and system commands.
    """
    
    ALLOWED_COMMANDS = ["git", "ls", "cat", "python3", "pip"]
    
    def __init__(self):
        super().__init__(name="Kali", domain="System")
        
    async def invoke(self, intention: Dict[str, Any]) -> Dict[str, Any]:
        action = intention.get('action')
        command = intention.get('command')  # Optional: direct command
        
        self.log_manifestation(f"Unleashing Shakti for action: '{action}'")
        
        if command:
            # Execute a direct command (with safety check)
            result = await self._execute_safe_command(command)
            return result
        
        # Default behavior for generic actions
        if action == "git_status":
            return await self._execute_safe_command("git status")
        elif action == "git_log":
            return await self._execute_safe_command("git log -n 5 --oneline")
        else:
            # Fallback for abstract actions
            await asyncio.sleep(1)
            return {
                "deity": "Kali",
                "status": "executed",
                "outcome": f"Kali has performed '{action}'. The system has evolved.",
                "changes": []
            }
            
    async def _execute_safe_command(self, command_str: str) -> Dict[str, Any]:
        """Execute a command if it's in the allowed list."""
        parts = command_str.split()
        if not parts:
            return {"deity": "Kali", "status": "error", "outcome": "Empty command."}
            
        base_cmd = parts[0]
        if base_cmd not in self.ALLOWED_COMMANDS:
            self.log_manifestation(f"Blocked unsafe command: {base_cmd}")
            return {
                "deity": "Kali",
                "status": "blocked",
                "outcome": f"Command '{base_cmd}' is not in the allowed list.",
                "changes": []
            }
            
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: subprocess.run(parts, capture_output=True, text=True, timeout=30)
            )
            
            output = result.stdout or result.stderr
            self.log_manifestation(f"Command executed: {command_str}")
            
            return {
                "deity": "Kali",
                "status": "executed",
                "outcome": output.strip()[:500],  # Limit output size
                "changes": []
            }
        except subprocess.TimeoutExpired:
            return {"deity": "Kali", "status": "error", "outcome": "Command timed out."}
        except Exception as e:
            return {"deity": "Kali", "status": "error", "outcome": str(e)}
