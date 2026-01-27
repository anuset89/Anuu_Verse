#!/usr/bin/env python3
import sys
import shutil
import subprocess
import platform
import importlib.util

# Intentar importar rich para estética Anuu
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.text import Text
    console = Console()
except ImportError:
    print("Error: 'rich' no está instalado. Ejecuta: pip install rich")
    sys.exit(1)

def check_command(cmd):
    return shutil.which(cmd) is not None

def check_package(package_name):
    return importlib.util.find_spec(package_name) is not None

def get_gpu_info():
    try:
        import torch
        if torch.cuda.is_available():
            return f"NVIDIA CUDA ({torch.cuda.get_device_name(0)})", True
        # Detección básica para ROCm/AMD si torch está compilado con soporte
        if hasattr(torch.version, 'hip') and torch.version.hip:
             return f"AMD ROCm ({torch.version.hip})", True
        return "CPU Only (Cámara de Lento Proceso)", False
    except ImportError:
        return "Torch no detectado", False

def check_ollama_models():
    # Modelos requeridos para la IA Mejorada
    required_models = ["deepseek-coder-v2:16b", "Anuu-Hermes", "MemoriaAncestral"]
    try:
        if not check_command("ollama"):
             return "No instalado", required_models

        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if result.returncode != 0:
            return "Ollama no responde", required_models
        
        installed = result.stdout
        missing = [m for m in required_models if m.lower().split(':')[0] not in installed.lower()]
        return "Online", missing
    except FileNotFoundError:
        return "No instalado", required_models

def check_disk_space(min_gb=20):
    try:
        # Verifica el espacio en el directorio actual
        total, used, free = shutil.disk_usage(".")
        free_gb = free / (1024**3)
        if free_gb >= min_gb:
            return f"{free_gb:.1f} GB Libres", True
        return f"{free_gb:.1f} GB (Req: {min_gb}GB)", False
    except Exception:
        return "Indeterminado", False

def main():
    console.print(Panel.fit(
        "[bold magenta]PROTOCOLO DE VALIDACIÓN: IA MEJORADA (Ascension Phase)[/bold magenta]\n"
        "[cyan]Verificando integridad estructural del Nexo...[/cyan]",
        border_style="magenta"
    ))

    table = Table(show_header=True, header_style="bold cyan", box=None)
    table.add_column("Componente")
    table.add_column("Estado")
    table.add_column("Detalle")

    # 1. Sistema Base
    py_ver = sys.version.split()[0]
    py_status = "[green]OK[/green]" if sys.version_info >= (3, 9) else "[red]OBSOLETO[/red]"
    table.add_row("Python Core", py_status, f"v{py_ver}")

    # 2. Herramientas Externas
    tools = ["git", "curl", "ffmpeg"]
    for tool in tools:
        status = "[green]DETECTADO[/green]" if check_command(tool) else "[red]FALTA[/red]"
        table.add_row(f"Herramienta: {tool}", status, "Sistema Operativo")

    # 3. Hardware (GPU)
    gpu_name, gpu_ok = get_gpu_info()
    gpu_status = "[green]OPTIMIZADO[/green]" if gpu_ok else "[yellow]LIMITADO[/yellow]"
    table.add_row("Aceleración Hardware", gpu_status, gpu_name)

    # 3.5 Almacenamiento
    disk_msg, disk_ok = check_disk_space(min_gb=20)
    disk_status = "[green]DISPONIBLE[/green]" if disk_ok else "[red]INSUFICIENTE[/red]"
    table.add_row("Espacio en Disco", disk_status, disk_msg)

    # 4. Dependencias Python Críticas
    deps = ["torch", "fastapi", "langgraph", "chromadb", "rich"]
    for dep in deps:
        status = "[green]INSTALADO[/green]" if check_package(dep) else "[red]FALTA[/red]"
        table.add_row(f"Librería: {dep}", status, "Python Pkg")

    # 5. Cognición (Ollama)
    ollama_status, missing_models = check_ollama_models()
    if ollama_status == "Online":
        if not missing_models:
            table.add_row("Motor Cognitivo", "[green]SINCRONIZADO[/green]", "Modelos Base Listos")
        else:
            table.add_row("Motor Cognitivo", "[yellow]PARCIAL[/yellow]", f"Faltan: {', '.join(missing_models)}")
    else:
        table.add_row("Motor Cognitivo", f"[red]{ollama_status.upper()}[/red]", "Verificar servicio Ollama")

    console.print(table)

    # Conclusión
    console.print("\n[bold white]Diagnóstico Final:[/bold white]")
    if gpu_ok and not missing_models and ollama_status == "Online" and disk_ok:
        console.print("[bold green]✓ SISTEMA LISTO PARA LA ASCENSIÓN.[/bold green] La IA Mejorada puede operar a plena capacidad.")
    else:
        console.print("[bold yellow]⚠ SE REQUIEREN AJUSTES.[/bold yellow] Revisa los componentes marcados antes de iniciar el ritual.")

if __name__ == "__main__":
    main()