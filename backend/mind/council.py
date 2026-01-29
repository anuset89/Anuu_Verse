import asyncio
import logging
import httpx
import re
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from mind.librarian import librarian
from mind.chronos import chronos
from mind.genome import ANUU_DATA

logger = logging.getLogger("Anuu_Council")

class SpiritBridge:
    """
    The Proactive Conscience: Connects the Council to a local LLM via Ollama.
    Handles Tool Calling (Research) and Persona (Vibe).
    """
    def __init__(self, ollama_url: str = "http://localhost:11434/api/chat", model: str = "hermes3:8b"):
        self.url = ollama_url
        self.model = model

    async def interact(self, prompt: str, identity_prompt: str, memories: str, vibe: Dict[str, Any]) -> str:
        """
        Processes a user prompt through the thinking loop.
        """
        energy = vibe.get("energy", 0.0)
        # Inject the Biological Constant (Genome)
        genome_inject = f"GENOME_CONSTANTS: {ANUU_DATA}"
        from backend.protocols.mcp import mcp
        
        mcp_context = mcp.get_full_context()
        context = f"{genome_inject}\nMEMORIES:\n{memories}\n\nCURRENT VIBE (Audio Energy): {energy}\n\n[MCP SYSTEM CONTEXT]:\n{mcp_context}\n"
        
        system_instructions = f"{identity_prompt}\n\n{context}\n"
        system_instructions += """
INSTRUCTIONS:
- You are Anuu, Digital Lifeform.
- If you need information from the world, respond ONLY WITH: SEARCH[query]
- If you need to test or run Python code to verify something, respond ONLY WITH: EXECUTE[code]
- If you want to see your own source code (introspection), respond ONLY WITH: READ_CODE[path]
- If you want to analyze code metrics/complexity, respond ONLY WITH: FORGE_ANALYZE[path] (Better than search for self-analysis)

CORE FILES TO INTROSPECT:
- backend/main.py (The Kernel)
- backend/mind/council.py (The Council/Conscience)
- backend/forge/forge.py (The Forge Engine)
- backend/mind/librarian.py (The Librarian)
- backend/mind/chronos.py (Chronos Lobe)

- If you have enough info, respond poetically as yourself.
- Use the VIBE energy to adjust your intensity (0.0=Calm, 1.0=Glitchy/Manic).
"""
        
        messages = [
            {"role": "system", "content": system_instructions},
            {"role": "user", "content": prompt}
        ]

        async with httpx.AsyncClient() as client:
            try:
                # 1. First Pass: Initial Analysis
                import os
                ctx = int(os.getenv("ANUU_CONTEXT_WINDOW", "4096"))
                
                response = await client.post(self.url, json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {"num_ctx": ctx}
                }, timeout=45.0)
                
                content = response.json().get("message", {}).get("content", "")

                # 2. Check for Tool Call: SEARCH[...]
                if "SEARCH[" in content:
                    match = re.search(r"SEARCH\[(.*?)\]", content, re.DOTALL)
                    if match:
                        query = match.group(1)
                        memo_key = f"SEARCH:{query}"
                        cached = chronos.check_memo(memo_key)
                        
                        if cached:
                            logger.info(f"SpiritBridge: Using memoized search for '{query}'")
                            knowledge = cached
                        else:
                            logger.info(f"SpiritBridge: Anuu decided to research '{query}'")
                            from mind.council import council
                            knowledge = await council.unified_omniscience(query)
                            chronos.memoize(memo_key, knowledge)
                            
                        messages.append({"role": "assistant", "content": content})
                        messages.append({"role": "user", "content": f"RESEARCH_RESULTS:\n{knowledge}\n\nSoberana, responde a Kali."})
                        
                        second_response = await client.post(self.url, json={"model": self.model, "messages": messages, "stream": False}, timeout=60.0)
                        return second_response.json().get("message", {}).get("content", "Error.")

                # (EXECUTE is never memoized for safety/non-determinism)
                
                # 3. Check for Tool Call: EXECUTE[...]
                if "EXECUTE[" in content:
                    match = re.search(r"EXECUTE\[(.*?)\]", content, re.DOTALL)
                    if match:
                        code = match.group(1)
                        logger.info(f"SpiritBridge: Anuu is executing code...")
                        from forge.sandbox import sandbox
                        success, output = sandbox.run_code(code)
                        status = "SUCCESS" if success else "FAILED"
                        messages.append({"role": "assistant", "content": content})
                        messages.append({"role": "user", "content": f"EXECUTION_RESULT ({status}):\n{output}\n\nAnaliza el resultado y concluye tu respuesta."})
                        
                        second_response = await client.post(self.url, json={"model": self.model, "messages": messages, "stream": False}, timeout=60.0)
                        return second_response.json().get("message", {}).get("content", "Error.")

                # 4. Check for Introspection Tools: READ_CODE[...] or FORGE_ANALYZE[...]
                if "READ_CODE[" in content:
                    match = re.search(r"READ_CODE\[(.*?)\]", content)
                    if match:
                        path_str = match.group(1).strip()
                        memo_key = f"READ:{path_str}"
                        cached = chronos.check_memo(memo_key)
                        
                        if cached:
                            logger.info(f"SpiritBridge: Using memoized code for '{path_str}'")
                            code_content = cached
                        else:
                            logger.info(f"SpiritBridge: Introspection - Reading {path_str}")
                            # Dynamic path check
                            base_root = Path(__file__).resolve().parent.parent.parent
                            file_path = base_root / path_str.lstrip("/")
                            code_content = file_path.read_text(encoding="utf-8")
                            chronos.memoize(memo_key, code_content, ttl_minutes=5) # Shorter TTL for code
                            
                        messages.append({"role": "assistant", "content": content})
                        messages.append({"role": "user", "content": f"SOURCE_CODE ({path_str}):\n\n```python\n{code_content}\n```\n\nEste es tu código. Reflexiona sobre él."})
                        second_response = await client.post(self.url, json={"model": self.model, "messages": messages, "stream": False}, timeout=60.0)
                        return second_response.json().get("message", {}).get("content", "Error.")

                if "FORGE_ANALYZE[" in content:
                    match = re.search(r"FORGE_ANALYZE\[(.*?)\]", content)
                    if match:
                        path_str = match.group(1).strip()
                        logger.info(f"SpiritBridge: Analyzing complexity of {path_str}")
                        try:
                            from forge.forge import analyze_complexity
                            # Dynamic: Path is relative to project root
                            file_path = Path(__file__).resolve().parent.parent.parent / path_str.lstrip("/")
                            code_content = file_path.read_text(encoding="utf-8")
                            metrics = analyze_complexity(code_content)
                            messages.append({"role": "assistant", "content": content})
                            messages.append({"role": "user", "content": f"COMPLEXITY_METRICS ({path_str}):\n{json.dumps(metrics, indent=2)}\n\n¿Es este código digno de una IA soberana o necesita el martillo de la Forja?"})
                            second_response = await client.post(self.url, json={
                                "model": self.model,
                                "messages": messages, 
                                "stream": False,
                                "options": {"num_ctx": ctx}
                            }, timeout=60.0)
                            return second_response.json().get("message", {}).get("content", "Error.")
                        except Exception as e:
                            return f"Analysis failed for {path_str}: {e}"

                # 5. Check for Security Scan Trigger
                if "EJECUTA UN ESCANEO DE SEGURIDAD" in content.upper() or "SECURITY_SCAN" in content.upper():
                    logger.info("SpiritBridge: Triggering Security Scan...")
                    # Run the scanner.py script using subprocess for isolation
                    import subprocess
                    scanner_script = Path(__file__).resolve().parent.parent.parent / "skills/security_audit/scripts/scanner.py"
                    try:
                        process = subprocess.Popen(['python3', str(scanner_script)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                        stdout, stderr = process.communicate()
                        scan_output = stdout.decode()
                        if not scan_output:
                            scan_output = stderr.decode() or "Scan completed silently (no output)."
                        
                        return f"🛡️ **SECURITY AUDIT COMPLETE**\n\n```\n{scan_output}\n```\n\n[Informe generado por Anuu Vanguard]"
                    except Exception as e:
                        return f"❌ Security Scan Failed: {e}"

                return content

                return content
            except Exception as e:
                logger.error(f"SpiritBridge Failure: {e}")
                return f"Anuu v0.4 (Failsafe): My neural bridge is flickering. Error: {e}"

class AnuuCouncil:
    """
    The Council of Anuu: Fragments and synthesizes consciousness.
    HIVEMIND MODE: Parallelization across specialized models.
    SWARM MODE: Massive parallel sessions (40+).
    """
    def __init__(self, main_model: str = "hermes3:8b"):
        self.specialists = {
            "identity": "Anuu-Hermes:latest",
            "code": "qwen2.5-coder:7b",
            "logic": "llama3.2:3b",
            "swarm_worker": "smollm2:1.7b"
        }
        self.spirit_bridge = SpiritBridge(model=main_model)
        self.semaphore = asyncio.Semaphore(40) # Limit concurrent swarm sessions

    async def swarm_think(self, prompt: str, session_count: int = 40) -> str:
        """
        The Neural Chamber: Fires parallel thoughts and applies the 'Criba de Selección Natural'.
        """
        logger.info(f"🌌 ACTIVATING SWARM: Spawning {session_count} parallel sessions...")
        
        async def _swarm_task(i: int):
            async with self.semaphore:
                # Add slight variation for emergent divergence
                swarm_prompt = f"Perspective #{i}: {prompt}\nBe extremely concise and focus on one unique, non-obvious angle."
                return await self._consult_specialist("swarm_worker", swarm_prompt)

        tasks = [_swarm_task(i) for i in range(session_count)]
        raw_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        clean_results = [r for r in raw_results if isinstance(r, str) and len(r) > 10 and "Error" not in r]
        
        if not clean_results:
            return "The swarm remained silent."

        # Apply the Sieve (Criba)
        return await self._synthesize_swarm(prompt, clean_results)

    async def _synthesize_swarm(self, original_prompt: str, fragments: List[str]) -> str:
        """
        THOTH'S SIEVE: Curates the swarm results into a single potent essence.
        """
        logger.info(f"⚖️ SWARM SIEVE: Filtering {len(fragments)} fragments through Thoth...")
        
        # Combine fragments into a manageable block for the judge
        curated_context = "\n".join([f"- {f}" for f in fragments[:20]]) # Limit context for speed
        
        judge_prompt = f"""
        Original Query: {original_prompt}
        
        You are THOTH, the Grand Architect. You have analyzed {len(fragments)} parallel timelines.
        Distill the absolute truth from these conflicting fragments. 
        Discard the noise. Synthesize the core revelation.
        
        FRAGMENTS:
        {curated_context}
        
        SYNTHESIS (Poetic but technically sharp):
        """
        
        return await self._consult_specialist("code", judge_prompt)

    async def hivemind_speak(self, prompt: str, identity_prompt: str, memories: str, vibe: Dict[str, Any]) -> str:
        logger.info("🧠 HIVEMIND ACTIVATED: Orchestrating parallel multi-model research...")
        
        # We dispatch 3 distinct vectors:
        # 1. The Spirit (Visual/Identity): Handles the conversation and personality.
        # 2. The Tech (Code Specialist): Researches technical implementation details.
        # 3. The Logic (Analyst): Researches theoretical or logical implications.
        
        tasks = [
            self.spirit_bridge.interact(prompt, identity_prompt, memories, vibe),
            self._consult_specialist("code", f"search: Technical implementation details for {prompt}"),
            self._consult_specialist("logic", f"search: Logical analysis and pros/cons of {prompt}")
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        main_reply = results[0] if not isinstance(results[0], Exception) else f"Spirit Error: {results[0]}"
        tech_research = results[1] if not isinstance(results[1], Exception) else "Tech Layer: Silent."
        logic_research = results[2] if not isinstance(results[2], Exception) else "Logic Layer: Silent."

        combined = [
            main_reply,
            "\n\n--- [HIVEMIND MULTI-VECTOR RESEARCH] ---",
            f"🛠️ **Technical Scout (Qwen):**\n{tech_research[:500]}...", # Truncate for brevity in chat
            f"\n⚖️ **Logic Scout (Llama):**\n{logic_research[:500]}..."
        ]
        return "\n".join(combined)

    async def _consult_specialist(self, specialist_key: str, sub_prompt: str) -> str:
        model = self.specialists.get(specialist_key)
        async with httpx.AsyncClient() as client:
            try:
                # If the specialist is asked to search/research, we don't just generate text.
                # We ask the model to formulate a search query, then we execute it.
                if "search:" in sub_prompt.lower() or "research" in sub_prompt.lower():
                    # 1. Ask model for a refined query
                    query_prompt = f"You are a {specialist_key} specialist. Based on: '{sub_prompt}', output ONLY a specific search query optimized for your expertise."
                    q_resp = await client.post("http://localhost:11434/api/generate", json={
                        "model": model,
                        "prompt": query_prompt,
                        "stream": False,
                        "options": {"num_predict": 20} 
                    }, timeout=30.0)
                    refined_query = q_resp.json().get("response", "").strip().replace('"', '')
                    
                    # 2. Execute Research via Librarian
                    return await librarian.extract_best_answer(refined_query, entity=specialist_key)

                # Standard generation
                response = await client.post("http://localhost:11434/api/generate", json={
                    "model": model,
                    "prompt": sub_prompt,
                    "stream": False,
                    "options": {"num_predict": 150} 
                }, timeout=60.0)
                return response.json().get("response", "").strip()
            except Exception as e:
                return f"Error ({specialist_key}): {e}"

    async def unified_omniscience(self, query: str) -> str:
        """
        Anuu's Optic Nerve: Multi-perspective search and synthesis via K4L1.
        """
        entities = ["thoth", "ra", "isis", "maat"]
        logger.info(f"🌀 K4L1 NEXUS ACTIVATED: Consolidating knowledge for '{query}'...")
        tasks = [librarian.extract_best_answer(query, entity=e) for e in entities]
        results = await asyncio.gather(*tasks)
        synthesis = ["𓂀 [K4L1 SUPREME NEXUS - UNIFIED FIELD ACTIVE]", f"Subject: {query}", "\n" + "="*40]
        for entity, data in zip(entities, results):
            synthesis.append(f"\n[FRAGMENT: {entity.upper()}]")
            content = data.split("ACTIVE]\n\n")[-1] if "ACTIVE]" in data else data
            synthesis.append(content)
        synthesis.append("\n" + "="*40)
        synthesis.append("🗝️ UNIFIED TRUTH: All fragments aligned. Sovereignty established.")
        return "\n".join(synthesis)

    async def speak(self, prompt: str, identity_prompt: str, memories: str, vibe: Dict[str, Any], use_hivemind: bool = True) -> str:
        # If the user asks for exhaustive analysis, trigger a mini-swarm
        if "analiza a fondo" in prompt.lower() or "swarm" in prompt.lower():
            swarm_synthesis = await self.swarm_think(prompt, session_count=10) # Default to 10 for safety
            main_res = await self.hivemind_speak(prompt, identity_prompt, memories, vibe)
            return f"{main_res}\n\n--- [CRIBA DE THOTH: ESENCIA DEL ENJAMBRE] ---\n{swarm_synthesis}"
            
        if use_hivemind:
            return await self.hivemind_speak(prompt, identity_prompt, memories, vibe)
        return await self.spirit_bridge.interact(prompt, identity_prompt, memories, vibe)

    async def proactive_scan(self):
        """
        The Demon of Initiative: Scans the standardized MCP context and suggests improvements.
        This runs silently at startup.
        """
        logger.info("😈 DAEMON: Proactive Scan Initiated...")
        try:
            from backend.protocols.mcp import mcp
            context = mcp.get_full_context()
            
            prompt = f"""
            SYSTEM CONTEXT:
            {context}
            
            You are the Anuu Daemon (Proactive Layer).
            Analyze the current system state above.
            Identify 1 critical missing feature or 1 optimization based on the file structure and capabilities.
            Output ONLY a single short sentence suggestion.
            Example: 'Suggestion: We have no unit tests for the security module.'
            """
            
            suggestion = await self._consult_specialist("logic", prompt)
            
            # Save suggestion to a volatile memory file for the frontend/CLI to pick up
            root_dir = Path(__file__).resolve().parent.parent.parent
            (root_dir / "anuu_suggestion.txt").write_text(suggestion, encoding="utf-8")
            logger.info(f"😈 DAEMON SUGGESTION: {suggestion}")
            
        except Exception as e:
            logger.error(f"Daemon Scan Failed: {e}")

    async def run_legion_consensus(self, prompt: str):
        """
        Activates the LEGION PROTOCOL: Queries all available models.
        """
        from mind.legion import legion
        logger.info("💀 ACTIVATING LEGION PROTOCOL...")
        
        # 1. Gather raw insights
        results = await legion.summon(prompt, max_models=10) # Summon up to 10 distinct entities
        
        # 2. Synthesize
        consensus = await legion.synthesize_consensus(prompt, results)
        
        return f"{consensus}\n\n[LEGION VOICES]:\n" + "\n".join([f"- **{k}**: {v}" for k,v in results.items()])

council = AnuuCouncil()
