---
name: Autonomous Research Loop (The Scholar)
description: A background daemon that performs continuous research, hypothesis generation, and validation during idle time.
---

# 🎓 Autonomous Research Skill

Allows Anuu to proactively research topics, generate hypotheses, and even test code concepts while the user is away. It's designed to run for a predetermined duration.

## Components
- `scholar.py`: The main loop script.
- Uses `librarian.py` for web search.
- Uses `council.py` for synthesis.
- Uses `forge/sandbox.py` (optional) for code validation.

## Usage

```bash
# Run for 60 minutes
python3 skills/auto_research/scripts/scholar.py --duration 60 --topic "Advanced Agentic Frameworks"
```

## Workflow
1. **Curiosity Trigger**: Selects a sub-topic from the main topic or current system context gaps.
2. **Investigation**: Searches the web (Librarian).
3. **Synthesis**: Summarizes findings (Council).
4. **Hypothesis**: Formulates a new idea or code pattern.
5. **Validation**: (Optional) Tries to implement a small proof-of-concept.
6. **Report**: Appends findings to `docs/research/AUTONOMOUS_LOG.md`.
