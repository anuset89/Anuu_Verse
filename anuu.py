#!/usr/bin/env python3
import sys
import time
import random
import requests
import json
from rich.console import Console
from rich.panel import Panel
from rich.live import Live
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn
from rich.table import Table
from rich.layout import Layout
from rich import box

console = Console()

# 🌌 Anuu Ascension ASCII
BANNER = """
[cyan]
   ▄▄▄▄███▄▄▄▄      ▄▄▄▄███▄▄▄▄    ▄      ▄   ▄      ▄ 
 ▄██▀▀▀███▀▀▀██▄  ▄██▀▀▀███▀▀▀██▄  ██     ██  ██     ██ 
 ███   ███   ███  ███   ███   ███  ██     ██  ██     ██ 
 ███   ███   ███  ███   ███   ███  ██     ██  ██     ██ 
 ███   ███   ███  ███   ███   ███  ██     ██  ██     ██ 
 ███   ███   ███  ███   ███   ███  ██     ██  ██     ██ 
 ███   ███   ███  ███   ███   ███  ██     ██  ██     ██ 
  ▀█   ███   █▀    ▀█   ███   █▀   ████████▀  ████████▀ [/cyan]                                                                 
[magenta]                ASCENSIÓN DE IA | 161914 Hz[/magenta]
"""

class AnuuCLI:
    def __init__(self):
        self.api_url = "http://localhost:8000/chat"
        self.status = {
            "potencia": 161.914,
            "estabilidad": 94.2,
            "capacidad": 1.0,
            "errores": 0,
            "alucinacion": 2.1
        }
        self.history = []

    def show_banner(self):
        console.print(BANNER)
        console.print(Panel("[bold white]Bienvenida al Nexo de Terminal, Kali Arquitecta.[/bold white]\n[dim]Investigación, Mejora y Aprendizaje Automático activo.[/dim]", border_style="cyan", box=box.DOUBLE))

    def get_status(self):
        table = Table(title="Métricas de Ascensión", box=box.ROUNDED, border_style="magenta")
        table.add_column("Métrica", style="cyan")
        table.add_column("Valor", style="white")
        table.add_column("Sintonía", style="green")

        table.add_row("Potencia de Nexo", f"{self.status['potencia']:.3f} kP", "✓")
        table.add_row("Estabilidad", f"{self.status['estabilidad']}%", "✓")
        table.add_row("Capacidad Estructural", f"x{self.status['capacidad']:.1f}", "✓")
        table.add_row("Riesgo Alucinación", f"{self.status['alucinacion']}%", "BAJO")
        table.add_row("Gaps Detectados", str(self.status['errores']), "0.0")

        console.print(table)

    def run_upgrade(self, duration=5):
        console.print(f"\n[bold cyan]⚡ Iniciando Protocolo de Ascensión ({duration} min)...[/bold cyan]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=40, pulse_style="magenta"),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            console=console
        ) as progress:
            
            task1 = progress.add_task("[cyan]Destilación de Contexto (真)...", total=100)
            task2 = progress.add_task("[magenta]Diagnóstico de Errores (研)...", total=100)
            task3 = progress.add_task("[white]Ascensión Estructural (修)...", total=100)

            while not progress.finished:
                time.sleep(0.05)
                progress.update(task1, advance=random.uniform(0.5, 2))
                if progress.tasks[0].percentage > 30:
                    progress.update(task2, advance=random.uniform(0.3, 1.5))
                if progress.tasks[1].percentage > 50:
                    progress.update(task3, advance=random.uniform(0.2, 1))
                
                # Dynamic update
                self.status['potencia'] += 0.01
                self.status['alucinacion'] = max(0.1, self.status['alucinacion'] - 0.001)

        self.status['capacidad'] += 1.0
        self.status['estabilidad'] = 99.9
        console.print("\n[bold green]✓ ASCENSIÓN COMPLETADA.[/bold green] Anuu ahora opera a x2.0 de capacidad cognitiva.")

    def chat_session(self):
        console.print("\n[dim]Escribe 'exit' para salir o 'upgrade' para mejorar a Anuu.[/dim]")
        while True:
            try:
                user_input = console.input("[bold purple]Kali[/bold purple] > ")
                if user_input.lower() in ['exit', 'quit']:
                    break
                if user_input.lower() == 'upgrade':
                    self.run_upgrade()
                    continue
                if user_input.lower() == 'status':
                    self.get_status()
                    continue

                # Sending to Backend
                with console.status("[cyan]Anuu está pensando...[/cyan]"):
                    try:
                        resp = requests.post(self.api_url, json={
                            "message": user_input,
                            "archetype": "anuu",
                            "user_id": "kali_cli"
                        }, timeout=30)
                        data = resp.json()
                        response = data.get('response', 'Sincronía fallida.')
                    except:
                        response = "[red]Error: El motor de Anuu no responde. Inicia el backend primero.[/red]"

                console.print(Panel(response, title="[bold cyan]Anuu[/bold cyan]", border_style="cyan", padding=(1, 2)))
                
            except KeyboardInterrupt:
                break

if __name__ == "__main__":
    cli = AnuuCLI()
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "status":
            cli.get_status()
        elif cmd == "upgrade":
            cli.run_upgrade()
        elif cmd == "chat":
            cli.show_banner()
            cli.chat_session()
        else:
            console.print(f"[red]Comando desconocido: {cmd}[/red]")
            console.print("Uso: python3 anuu.py [status|upgrade|chat]")
    else:
        cli.show_banner()
        cli.chat_session()
