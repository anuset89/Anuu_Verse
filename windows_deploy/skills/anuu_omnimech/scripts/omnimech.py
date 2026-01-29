import sys
import os
import subprocess
from pathlib import Path
from rich.console import Console
from rich.panel import Panel

console = Console()

# Define Paths
CURRENT_DIR = Path(__file__).resolve().parent
MODULES_DIR = CURRENT_DIR.parent / "modules"

# Command Mapping
COMMANDS = {
    "research": {
        "script": "scholar.py",
        "desc": "Autonomous Research Agent",
        "args_hint": "--topic 'Subject' --iterations N"
    },
    "guard": {
        "script": "guard.py",
        "desc": "System & Port Guardian",
        "args_hint": "--check | --clean-only | --force-restart"
    },
    "evolve": {
        "script": "ouroboros.py",
        "desc": "Self-Evolution Protocol",
        "args_hint": "--file <path> --instruction <text>"
    },
    "audit": {
        "script": "audit_scanner.py",
        "desc": "Security Scanner",
        "args_hint": "--target <dir>"
    },
    "scrape": {
        "script": "media_scraper.py",
        "desc": "YouTube Media Prospector",
        "args_hint": "<video_url>"
    }
}

def print_help():
    console.print(Panel.fit("[bold magenta]🦾 OmniMech v1.0[/bold magenta]\n[cyan]Universal Skill Dispatcher[/cyan]", border_style="magenta"))
    console.print("\nUsage: python omnimech.py [COMMAND] [ARGS...]\n")
    
    for cmd, info in COMMANDS.items():
        console.print(f"[bold green]{cmd}[/bold green]: {info['desc']}")
        console.print(f"   ↳ Try: {info['args_hint']}\n")

def main():
    if len(sys.argv) < 2:
        print_help()
        sys.exit(0)

    command = sys.argv[1]
    
    if command in ["help", "--help", "-h"]:
        print_help()
        sys.exit(0)

    if command not in COMMANDS:
        console.print(f"[bold red]❌ Unknown command: {command}[/bold red]")
        print_help()
        sys.exit(1)

    # Prepare Execution
    module_info = COMMANDS[command]
    script_path = MODULES_DIR / module_info["script"]
    
    if not script_path.exists():
        console.print(f"[bold red]❌ Critical Error: Module {module_info['script']} not found at {script_path}[/bold red]")
        sys.exit(1)

    # Forward Arguments
    forward_args = sys.argv[2:]
    
    console.print(f"[dim]⚡ Engaging {command.upper()} protocol via {module_info['script']}...[/dim]")
    
    # Construct subprocess call
    cmd_list = [sys.executable, str(script_path)] + forward_args
    
    try:
        # Run and stream output
        subprocess.run(cmd_list, check=False)
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️ OmniMech Interrupted.[/yellow]")
    except Exception as e:
        console.print(f"[bold red]❌ Execution Failed: {e}[/bold red]")

if __name__ == "__main__":
    main()
