import asyncio
import sys
import os
import json
from pathlib import Path

# Setup paths to allow local imports
ROOT_DIR = Path(__file__).parent.parent
sys.path.append(str(ROOT_DIR / "backend"))

from mind.council import council
from mind.librarian import librarian
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

console = Console()

async def execute_advanced_research(query: str):
    """
    Executes the MPD (Multi-Perspective Discovery) ritual:
    1. Parallel search across ALL core identities.
    2. Deep synthesis via Thoth's Sieve.
    3. Final report generation.
    """
    # Core identities for the search
    identities = ["set", "ra", "4nvset", "saze", "maat", "anuu"]
    
    console.print(Panel(f"[bold cyan]INICIANDO INVESTIGACIÓN MPD[/bold cyan]\n[white]Query: {query}[/white]\n[dim]Fase de Ascensión v0.18.0[/dim]", border_style="cyan"))

    results = {}
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
        transient=True
    ) as progress:
        
        tasks = []
        for identity in identities:
            task_id = progress.add_task(f"[magenta]Manifestando {identity.upper()}...[/magenta]", total=None)
            tasks.append((identity, librarian.extract_best_answer(query, entity=identity)))

        # Run parallel searches
        search_responses = await asyncio.gather(*[t[1] for t in tasks])
        
        for idx, resp in enumerate(search_responses):
            results[identities[idx]] = resp

    console.print("[green]✓ Los fragmentos han sido recolectados.[/green]")

    # Deep Synthesis via LLM (if available) - Fallback to structural synthesis
    console.print("[cyan]🧪 Ejecutando la Criba de Thoth para síntesis final...[/cyan]")
    
    synthesis_report = f"# 𓂀 REPORTE DE INVESTIGACIÓN MPD: {query}\n\n"
    synthesis_report += "## 💠 Esencia de las Identidades\n\n"
    
    for identity, data in results.items():
        # Clean data for report
        clean_data = data.split("ACTIVE]\n\n")[-1] if "ACTIVE]" in data else data
        synthesis_report += f"### 🛡️ PERSPECTIVA: {identity.upper()}\n"
        synthesis_report += f"{clean_data}\n\n"

    # Save artifact
    output_path = ROOT_DIR / f"docs/research/MPD_REPORT_{query.replace(' ', '_')[:20]}.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(synthesis_report, encoding="utf-8")
    
    console.print(Panel(f"[bold green]REPORTE GENERADO:[/bold green]\n{output_path}", border_style="green"))
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        query = "LiquidAI LFM 2.5 vs DeepSeek R1 trends 2026"
    else:
        query = " ".join(sys.argv[1:])
    
    asyncio.run(execute_advanced_research(query))
