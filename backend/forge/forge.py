#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════╗
║  FORGE - The Blacksmith's Hammer for Self-Refining AI            ║
║  Anuu_Verse Architecture | Titan-Level Code Refactoring          ║
╚═══════════════════════════════════════════════════════════════════╝

A robust CLI tool for autonomous code refinement with:
- AST-based complexity analysis
- LLM-powered architectural improvements
- Safety-first backup and validation
- Beautiful terminal diff visualization
"""

import ast
import asyncio
import difflib
import json
import os
import shutil
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple

import httpx
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.syntax import Syntax
from rich.table import Table
from rich.text import Text

console = Console()


# ═══════════════════════════════════════════════════════════════════
# COMPLEXITY ANALYSIS ENGINE
# ═══════════════════════════════════════════════════════════════════


class ComplexityAnalyzer(ast.NodeVisitor):
    """Calculate cyclomatic complexity using AST traversal."""

    def __init__(self):
        self.complexity = 1
        self.functions = {}
        self.current_function = None

    def visit_FunctionDef(self, node):
        """Track function-level complexity."""
        old_function = self.current_function
        old_complexity = self.complexity
        
        self.current_function = node.name
        self.complexity = 1
        
        self.generic_visit(node)
        
        self.functions[node.name] = self.complexity
        self.complexity = old_complexity
        self.current_function = old_function

    def visit_If(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_While(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_For(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_ExceptHandler(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_With(self, node):
        self.complexity += 1
        self.generic_visit(node)

    def visit_BoolOp(self, node):
        self.complexity += len(node.values) - 1
        self.generic_visit(node)


def analyze_complexity(code: str) -> dict:
    """Analyze code complexity metrics."""
    try:
        tree = ast.parse(code)
        analyzer = ComplexityAnalyzer()
        analyzer.visit(tree)
        
        total_complexity = sum(analyzer.functions.values()) or 1
        avg_complexity = total_complexity / max(len(analyzer.functions), 1)
        
        return {
            "total_complexity": total_complexity,
            "avg_complexity": round(avg_complexity, 2),
            "functions": analyzer.functions,
            "function_count": len(analyzer.functions),
            "max_complexity": max(analyzer.functions.values()) if analyzer.functions else 0,
        }
    except SyntaxError as e:
        return {"error": f"Syntax error: {e}"}


# ═══════════════════════════════════════════════════════════════════
# LLM INTEGRATION LAYER
# ═══════════════════════════════════════════════════════════════════


@dataclass
class LLMConfig:
    """Configuration for LLM API."""
    provider: str  # 'ollama', 'openai', 'anthropic'
    api_key: str
    model: str
    base_url: Optional[str] = None


ARCHITECT_PROMPT = """You are a Senior Software Architect specializing in Python optimization.

Refactor the following code with these STRICT requirements:

1. **Performance Optimization**:
   - Convert blocking operations to async/await patterns
   - Optimize algorithms for O(n) or better complexity
   - Add proper asyncio concurrency where applicable

2. **Type Safety**:
   - Add complete type hints (Python 3.11+ syntax)
   - Use proper generics and protocols
   - Ensure mypy strict compliance

3. **Error Handling**:
   - Wrap all I/O operations in try-except blocks
   - Add proper logging for exceptions
   - Use contextlib for resource management

4. **Code Quality**:
   - Follow PEP 8 and modern Python best practices
   - Add docstrings (Google style) to all functions
   - Remove dead code and unused imports

CRITICAL: Return ONLY the refactored Python code. No explanations, no markdown backticks, no commentary.
The response must be valid Python that can be directly written to a file.

Code to refactor:

```python
{code}
```"""


async def refactor_with_llm(code: str, config: LLMConfig) -> str:
    """Send code to LLM for architectural refactoring."""
    
    prompt = ARCHITECT_PROMPT.format(code=code)
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        if config.provider == "ollama":
            url = config.base_url or "http://localhost:11434/api/generate"
            payload = {
                "model": config.model,
                "prompt": prompt,
                "stream": False,
            }
            response = await client.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        
        elif config.provider == "openai":
            url = config.base_url or "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {config.api_key}"}
            payload = {
                "model": config.model,
                "messages": [
                    {"role": "system", "content": "You are a Senior Software Architect."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
            }
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        
        elif config.provider == "anthropic":
            url = config.base_url or "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": config.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            }
            payload = {
                "model": config.model,
                "max_tokens": 4096,
                "messages": [{"role": "user", "content": prompt}],
            }
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            return result["content"][0]["text"]
        
        else:
            raise ValueError(f"Unknown provider: {config.provider}")


def clean_llm_response(response: str) -> str:
    """Extract clean Python code from LLM response."""
    # Remove markdown code blocks if present
    lines = response.strip().split("\n")
    
    if lines[0].startswith("```"):
        lines = lines[1:]
    if lines[-1].startswith("```"):
        lines = lines[:-1]
    
    code = "\n".join(lines).strip()
    
    # Remove any leading/trailing explanatory text
    if "Here's" in code.split("\n")[0] or "here's" in code.split("\n")[0]:
        code = "\n".join(code.split("\n")[1:])
    
    return code


# ═══════════════════════════════════════════════════════════════════
# SAFETY & VALIDATION LAYER
# ═══════════════════════════════════════════════════════════════════


def create_backup(filepath: Path) -> Path:
    """Create a timestamped backup of the original file."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = filepath.with_suffix(f".{timestamp}.bak")
    shutil.copy2(filepath, backup_path)
    return backup_path


def validate_syntax(code: str) -> Tuple[bool, Optional[str]]:
    """Validate Python syntax using AST parsing."""
    try:
        ast.parse(code)
        return True, None
    except SyntaxError as e:
        return False, f"Line {e.lineno}: {e.msg}"


# ═══════════════════════════════════════════════════════════════════
# DIFF VISUALIZATION ENGINE
# ═══════════════════════════════════════════════════════════════════


def generate_diff(original: str, refactored: str, filename: str) -> None:
    """Generate and display a beautiful colored diff."""
    
    diff = difflib.unified_diff(
        original.splitlines(keepends=True),
        refactored.splitlines(keepends=True),
        fromfile=f"original/{filename}",
        tofile=f"refactored/{filename}",
        lineterm="",
    )
    
    diff_text = Text()
    for line in diff:
        if line.startswith("+++") or line.startswith("---"):
            diff_text.append(line, style="bold cyan")
        elif line.startswith("@@"):
            diff_text.append(line, style="bold magenta")
        elif line.startswith("+"):
            diff_text.append(line, style="green")
        elif line.startswith("-"):
            diff_text.append(line, style="red")
        else:
            diff_text.append(line, style="dim")
    
    console.print(Panel(diff_text, title="📊 Refactoring Diff", border_style="blue"))


# ═══════════════════════════════════════════════════════════════════
# MAIN FORGE ENGINE
# ═══════════════════════════════════════════════════════════════════


async def forge_file(
    filepath: Path,
    config: LLMConfig,
    dry_run: bool = False,
) -> None:
    """Main refactoring orchestration."""
    
    console.print(Panel.fit(
        "[bold cyan]🔨 FORGE - Titan-Level Refactoring Engine[/bold cyan]\n"
        f"[dim]Target: {filepath}[/dim]",
        border_style="cyan"
    ))
    
    # ═══ STEP 1: Load and Analyze ═══
    console.print("\n[bold yellow]⚡ Phase 1: Analysis[/bold yellow]")
    
    if not filepath.exists():
        console.print(f"[red]✗ File not found: {filepath}[/red]")
        sys.exit(1)
    
    original_code = filepath.read_text()
    
    # Analyze original complexity
    metrics = analyze_complexity(original_code)
    
    if "error" in metrics:
        console.print(f"[red]✗ {metrics['error']}[/red]")
        sys.exit(1)
    
    # Display metrics
    table = Table(title="Code Complexity Metrics")
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="magenta")
    
    table.add_row("Total Complexity", str(metrics["total_complexity"]))
    table.add_row("Average Complexity", str(metrics["avg_complexity"]))
    table.add_row("Function Count", str(metrics["function_count"]))
    table.add_row("Max Function Complexity", str(metrics["max_complexity"]))
    
    console.print(table)
    
    # ═══ STEP 2: LLM Refactoring ═══
    console.print("\n[bold yellow]🤖 Phase 2: LLM Refactoring[/bold yellow]")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Consulting Senior Architect...", total=None)
        
        try:
            refactored_code = await refactor_with_llm(original_code, config)
            refactored_code = clean_llm_response(refactored_code)
            progress.update(task, completed=True)
        except Exception as e:
            console.print(f"[red]✗ LLM Error: {e}[/red]")
            sys.exit(1)
    
    console.print("[green]✓ Refactoring complete[/green]")
    
    # ═══ STEP 3: Validation ═══
    console.print("\n[bold yellow]🔍 Phase 3: Validation[/bold yellow]")
    
    valid, error = validate_syntax(refactored_code)
    
    if not valid:
        console.print(f"[red]✗ Syntax Error in refactored code:[/red]\n  {error}")
        console.print("\n[yellow]Original code preserved. Refactoring aborted.[/yellow]")
        sys.exit(1)
    
    console.print("[green]✓ Syntax validation passed[/green]")
    
    # Analyze refactored complexity
    new_metrics = analyze_complexity(refactored_code)
    
    improvement_table = Table(title="Refactoring Impact")
    improvement_table.add_column("Metric", style="cyan")
    improvement_table.add_column("Before", style="red")
    improvement_table.add_column("After", style="green")
    improvement_table.add_column("Change", style="magenta")
    
    total_change = new_metrics["total_complexity"] - metrics["total_complexity"]
    avg_change = new_metrics["avg_complexity"] - metrics["avg_complexity"]
    
    improvement_table.add_row(
        "Total Complexity",
        str(metrics["total_complexity"]),
        str(new_metrics["total_complexity"]),
        f"{total_change:+d}",
    )
    improvement_table.add_row(
        "Avg Complexity",
        str(metrics["avg_complexity"]),
        str(new_metrics["avg_complexity"]),
        f"{avg_change:+.2f}",
    )
    
    console.print(improvement_table)
    
    # ═══ STEP 4: Diff Generation ═══
    console.print("\n[bold yellow]📊 Phase 4: Diff Analysis[/bold yellow]")
    generate_diff(original_code, refactored_code, filepath.name)
    
    # ═══ STEP 5: Apply Changes ═══
    if dry_run:
        console.print("\n[yellow]🔒 DRY RUN: No changes written to disk[/yellow]")
        return
    
    console.print("\n[bold yellow]💾 Phase 5: Applying Changes[/bold yellow]")
    
    # Create backup
    backup_path = create_backup(filepath)
    console.print(f"[dim]Backup created: {backup_path}[/dim]")
    
    # Write refactored code
    filepath.write_text(refactored_code)
    console.print(f"[green]✓ Refactored code written to {filepath}[/green]")
    
    console.print(Panel.fit(
        "[bold green]🎯 Forging Complete[/bold green]\n"
        "[dim]The code has been refined by the Blacksmith's hammer.[/dim]",
        border_style="green"
    ))


# ═══════════════════════════════════════════════════════════════════
# CLI INTERFACE
# ═══════════════════════════════════════════════════════════════════


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="🔨 FORGE - Titan-Level Code Refactoring Engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    
    parser.add_argument(
        "file",
        type=Path,
        help="Path to Python file to refactor",
    )
    
    parser.add_argument(
        "--provider",
        choices=["ollama", "openai", "anthropic"],
        default="ollama",
        help="LLM provider (default: ollama)",
    )
    
    parser.add_argument(
        "--api-key",
        help="API key for provider (not needed for Ollama)",
    )
    
    parser.add_argument(
        "--model",
        default="codellama",
        help="Model to use (default: codellama for Ollama)",
    )
    
    parser.add_argument(
        "--base-url",
        help="Custom base URL for API endpoint",
    )
    
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing to disk",
    )
    
    args = parser.parse_args()
    
    # Validate API key requirement
    if args.provider != "ollama" and not args.api_key:
        console.print(f"[red]✗ --api-key required for {args.provider}[/red]")
        sys.exit(1)
    
    config = LLMConfig(
        provider=args.provider,
        api_key=args.api_key or "",
        model=args.model,
        base_url=args.base_url,
    )
    
    try:
        asyncio.run(forge_file(args.file, config, args.dry_run))
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠ Forging interrupted by user[/yellow]")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red]✗ Fatal error: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()
