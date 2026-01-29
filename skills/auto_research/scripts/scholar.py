import sys
import time
import asyncio
import logging
import argparse
from pathlib import Path
from rich.console import Console
from rich.panel import Panel

# Setup Paths (Relative)
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))
if str(ROOT_DIR / "backend") not in sys.path:
    sys.path.append(str(ROOT_DIR / "backend"))

from backend.mind.council import council
from mind.librarian import librarian
try:
    from backend.protocols.mcp import mcp
except ImportError:
    # Fallback if running directly
    from backend.protocols.mcp import ModelContextProtocol
    mcp = ModelContextProtocol(str(ROOT_DIR))

console = Console()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("The_Scholar")

class AutonomousScholar:
    def __init__(self, iterations: int, divagation_min: int, topic: str):
        self.iterations = iterations
        self.divagation_seconds = divagation_min * 60
        self.topic = topic
        self.output_file = ROOT_DIR / "docs/research/AUTONOMOUS_LOG.md"
        self.output_file.parent.mkdir(parents=True, exist_ok=True)

    async def run_cycle(self):
        console.print(Panel(f"[bold green]🎓 SCHOLAR ACTIVATED[/bold green]\nTopic: {self.topic}\nIterations: {self.iterations}\nDivagation Time: {self.divagation_seconds/60}m per cycle", border_style="green"))

        if not self.output_file.exists():
            self.output_file.write_text(f"# 🎓 Autonomous Research Log: {self.topic}\n\n", encoding="utf-8")

        for i in range(1, self.iterations + 1):
            console.print(f"\n[bold magenta]=== Iteration {i}/{self.iterations}: Focus Mode ===[/bold magenta]")
            
            # --- PHASE 1: FOCUS (Iterate distinct things) ---
            question = await self._formulate_question(self.topic, "focus")
            console.print(f"🎯 Target: [italic]{question}[/italic]")
            
            knowledge = await librarian.extract_best_answer(question)
            insight = await self._synthesize(knowledge, mode="focus")
            self._log_findings(i, "FOCUS", question, insight)
            console.print(Panel(insight[:300] + "...", title="Focus Insight", border_style="blue"))

            # --- PHASE 2: DIVAGATION (Wandering) ---
            if self.divagation_seconds > 0:
                console.print(f"\n[bold cyan]~~~ Divagating for {self.divagation_seconds/60} min... ~~~[/bold cyan]")
                # We pick a tangential concept from the insight to wander off
                tangent = await self._extract_concept(insight)
                div_question = await self._formulate_question(tangent, "divagate")
                
                console.print(f"🍃 Wandering to: [italic]{div_question}[/italic]")
                div_knowledge = await librarian.extract_best_answer(div_question)
                div_insight = await self._synthesize(div_knowledge, mode="creative")
                
                self._log_findings(i, "DIVAGATION", div_question, div_insight)
                console.print(Panel(div_insight[:300] + "...", title="Creative Wander", border_style="cyan"))
                
                # Simulate the passage of time/processing
                time.sleep(5) 

        console.print("[bold green]✅ Session Complete.[/bold green]")

    async def _formulate_question(self, context_topic, mode):
        # Enforce a strict persona override to prevent Anuu's philosophical identity from bleeding into search queries.
        if mode == "focus":
            prompt = f"""
            [SYSTEM OVERRIDE: ACTIVATE ANUU_ARCHITECT PROTOCOL]
            ROLE: You are the Senior Technical Architect of Anuu Verse.
            
            SYSTEM CONTEXT:
            - Backend: FastAPI (Python), Ollama (Local LLMs), DuckDuckGo (Search)
            - Frontend: React (Vite), TailwindCSS, Glassmorphism
            - Goal: Autonomous Research & Sovereign AI
            
            INPUT TOPIC: "{context_topic}"
            
            TASK: Translate this topic into a precise, high-level technical search query compatiable with our stack.
            STRATEGY:
            - Target "best practices", "pattern implementation", or "libraries".
            - Prioritize modern, lightweight solutions adaptable to our stack.
            - Output ONLY the query string (Max 10 words).
            
            Example: "React markdown renderer code block syntax highlighting"
            """
        else:
            prompt = f"""
            [SYSTEM OVERRIDE: ACTIVATE CONCEPT_EXPLORER PROTOCOL]
            ROLE: You are a Creative Research Assistant.
            
            INPUT TOPIC: "{context_topic}"
            
            TASK: Formulate ONE intriguing query for tangential or abstract concepts related to the topic.
            CONSTRAINTS:
            - Focus on connections, analogies, or theory.
            - Output ONLY the query string.
            
            Example Output: "biomimicry in user interface design"
            """
            
        # We explicitly tell spirit_bridge to use this prompt, hoping the override sticks.
        q = await council.spirit_bridge.interact(prompt, "You are a Search Engine.", "", {})
        
        # Aggressive cleaning of the result
        cleaned_q = q.strip().replace('"', '').replace("Query:", "").replace("Search:", "").replace("SEARCH", "").replace("[", "").replace("]", "").split('\n')[0]
        return cleaned_q.strip()

    async def _extract_concept(self, text):
        prompt = f"Extract 1 intriguing concept or keyword from this text to explore next: {text[:500]}"
        c = await council.spirit_bridge.interact(prompt, "You are a keyword extractor.", "", {})
        return c.strip()

    async def _synthesize(self, knowledge, mode):
        if mode == "focus":
            role = "Research Scientist"
            task = "Summarize the key technical facts and propose an implementation."
        else:
            role = "Philosopher Poet"
            task = "Relate this to the broader nature of intelligence or Anuu's existence."

        prompt = f"KNOWLEDGE: {knowledge[:1500]}\nTASK: {task}"
        return await council.spirit_bridge.interact(prompt, f"You are a {role}.", "", {})

    def _log_findings(self, cycle, phase, question, insight):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        entry = f"\n## 🔄 Cycle {cycle} [{phase}] - {timestamp}\n**Query:** `{question}`\n\n**{phase} Analysis:**\n{insight}\n\n---\n"
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write(entry)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=3, help="Number of distinct topics to iterate")
    parser.add_argument("--divagation", type=int, default=2, help="Minutes to divagate per iteration")
    parser.add_argument("--topic", type=str, default="Self-Evolving AI", help="Main Research topic")
    args = parser.parse_args()

    scholar = AutonomousScholar(args.iterations, args.divagation, args.topic)
    try:
        asyncio.run(scholar.run_cycle())
    except KeyboardInterrupt:
        print("\n🛑 Interrupted.")
