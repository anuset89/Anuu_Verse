import subprocess
import os

class DesignTool:
    def __init__(self):
        self.script_path = ".agent/skills/ui-ux-pro-max/scripts/search.py"

    def design_system(self, query: str, project_name: str = "Anuu Project") -> str:
        """
        Generates a complete Design System using the UI/UX Pro Max skill.
        If the query relates to Anuu, it automatically injects Kilonova style keywords.
        """
        # Auto-optimization for Anuu styling
        if "anuu" in query.lower() or "kilonova" in query.lower() or "cosmic" in query.lower():
            query += " anuu kilonova cosmic nebula glassmorphism massive-scale"
        
        command = [
            "python3",
            self.script_path,
            query,
            "--design-system",
            "-p", project_name,
            "-f", "markdown"  # Force markdown for better chat display
        ]
        
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            return f"Error creating Design System: {e.stderr}"

    def search_domain(self, query: str, domain: str = "style") -> str:
        """
        Searches specific domains (style, color, typography, ux)
        """
        command = [
            "python3",
            self.script_path,
            query,
            "--domain", domain,
            "--max-results", "3"
        ]
        
        try:
            result = subprocess.run(
                command, 
                capture_output=True, 
                text=True, 
                check=True
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            return f"Error searching design domain: {e.stderr}"

if __name__ == "__main__":
    tool = DesignTool()
    print("Testing Design System Gen...")
    print(tool.design_system("anuu control center"))
