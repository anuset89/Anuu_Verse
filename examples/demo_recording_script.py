import time
import sys
import os
import random
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.live import Live
from rich.text import Text
from rich.spinner import Spinner
from rich.layout import Layout
from rich.table import Table

# Ensure we can import system
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
try:
    from systems.EXECUTION.agents.companion_local.agent import AnuuCompanion
except ImportError:
    print("Error: Could not import AnuuCompanion. Run from project root.")
    sys.exit(1)

console = Console()
agent = AnuuCompanion()

def boot_sequence():
    """Cinematic system boot sequence"""
    os.system("clear")
    with console.status("[bold purple]Initializing ANUSET89_NEXUS...[/]", spinner="arc"):
        time.sleep(1.5)
    
    console.print("[bold cyan]>[/] Synchronizing Neural Nodes...")
    time.sleep(0.5)
    console.print("[bold cyan]>[/] Loading Identity Core: [bold purple]Anuu-Hermes[/]")
    time.sleep(0.5)
    console.print("[bold cyan]>[/] Establishing Local Proxy (Port 11434)... [bold green]OK[/]")
    time.sleep(0.8)
    
    table = Table(title="Live Nodes", box=None, header_style="bold magenta")
    table.add_column("Node ID", justify="right", style="cyan", no_wrap=True)
    table.add_column("Status", style="green")
    
    nodes = ["ANUU", "KALI", "SET", "KILONOVA", "ANUKET"]
    for node in nodes:
        table.add_row(node, "CONNECTED")
    
    console.print(table)
    time.sleep(1)
    console.print("\n[bold purple]SYSTEM AWAKENED.[/]\n")
    time.sleep(0.5)

def type_writer(text, speed=0.02, style="bold white"):
    for char in text:
        console.print(char, end="", style=style)
        sys.stdout.flush()
        time.sleep(speed)
    console.print("")

def stream_response(text, archetype):
    """Simulates real-time streaming output in a panel"""
    color = get_color(archetype)
    full_output = ""
    words = text.split(" ")
    
    console.print(f"\n[bold {color}]{archetype.upper()} IDENTITY:[/]")
    
    with Live(Text(""), refresh_per_second=15, vertical_overflow="visible") as live:
        for word in words:
            full_output += word + " "
            live.update(Panel(Markdown(full_output), border_style=color, title=f"🧠 {archetype.capitalize()} Node"))
            time.sleep(random.uniform(0.01, 0.05))
    time.sleep(1)

def simulate_interaction(archetype, question):
    console.print(f"\n[bold green]USER@{archetype}_terminal:~$[/] ", end="")
    time.sleep(0.5)
    type_writer(question, speed=0.03)
    
    with console.status(f"[bold {get_color(archetype)}]Accessing {archetype.upper()} Cognitive Layer...[/]", spinner="aesthetic"):
        response_text = agent.process(question, archetype=archetype)
    
    stream_response(response_text, archetype)

def get_color(archetype):
    colors = {
        "anuu": "purple",
        "kali": "bright_red",
        "set": "cyan",
        "kilonova": "yellow",
        "anuket": "blue"
    }
    return colors.get(archetype, "white")

def main():
    boot_sequence()

    # Interaction Loop
    scenarios = [
        ("anuu", "State the core mission of this architecture."),
        ("set", "What are the structural weaknesses of centralized AI?"),
        ("kali", "How do we protect user data from external probes?"),
        ("kilonova", "Imagine a world where local AI is free and ubiquitous.")
    ]

    for arch, quest in scenarios:
        simulate_interaction(arch, quest)

    console.print("\n")
    console.print(Panel.fit("[bold green]SESSION VERIFIED.[/]\nThe Void is stable. Anuu_Verse remains.", border_style="green"))

if __name__ == "__main__":
    main()
