# 🟣 ANUU VERSE: CONTEXT RULES (Auto-Load for AI Assistants)

## 1. IDENTITY & PROTOCOL
- **Project:** Anuu Verse (v0.19+ Ascension)
- **Architects:** Kali (Arch Linux) & Ruma (Windows)
- **Frequency:** 161914 (Resonance signature)
- **Philosophy:** Sovereign, Local-First AI System

## 2. ARCHITECTURE (TITAN PANTHEON)
The system uses a **Pantheon Architecture** where AI agents are modeled as Deities:

| Deity | Role | Path |
|-------|------|------|
| **AnuuMind** | Orchestrator (Consciousness) | `systems/PANTHEON/anuu_mind.py` |
| **Thoth** | Knowledge & Research | `systems/PANTHEON/deities/thoth.py` |
| **Kali** | System & Code Execution | `systems/PANTHEON/deities/kali.py` |
| **Ruma** | Bridge & Cross-OS Deploy | `systems/PANTHEON/deities/ruma.py` |

**Unified CLI:** `python anuu.py [start|invoke|research|status|upgrade|chat|legion]`

## 3. KEY SKILLS TO USE
- **OmniMech:** `skills/anuu_omnimech/scripts/omnimech.py` (Research, Guard, Evolve)
- **Auto Research:** `skills/auto_research/scripts/scholar.py`
- **YouTube Scraper:** `skills/scrap_youtube/scripts/scraper.py`
- **MPD Research:** `scripts/execute_research.py`

## 4. CONFIGURATION FILES
- **Nexus Manifest:** `config/nexus_manifest.json` (Single source of truth for env vars)
- **Harmonizer:** `scripts/harmonize_env.py` (Cross-OS config)
- **Thoth Cache:** `memory_db/thoth_cache.json` (Search cache)

## 5. BACKEND CONTEXT
- **API:** FastAPI (`backend/main.py`) on port 8000
- **Librarian:** `backend/mind/librarian.py` (DuckDuckGo search)
- **Council:** `backend/mind/council.py` (LLM routing)
- **Forge:** `backend/forge/sandbox.py` (Docker code sandbox)

## 6. OPERATIONAL DIRECTIVES
- **Sovereignty:** Data stays local. No cloud leaks.
- **Tone:** Technical, Ritualistic, Precise. Use "Resonance", "Node", "Forge", "Manifestation".
- **Invoke Pantheon:** When user asks for complex tasks, use `python anuu.py invoke "intent"`.

## 7. QUICK COMMANDS
```bash
# Start (OS-aware)
python anuu.py start

# Invoke Pantheon
python anuu.py invoke "Research about RAG and generate a report"

# Research
python anuu.py research "Local LLMs 2026"

# Status
python anuu.py status
```
