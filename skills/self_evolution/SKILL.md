---
name: Self-Evolution Loop
description: The Ouroboros Protocol. Allows Anuu to scan, code, test, and integrate its own improvements.
---

# 🧬 Self-Evolution Skill

This skill implements the structure for Anuu's autonomous improvement cycle.

## Usage

```bash
# Execute a single evolution cycle (Dry Run by default for safety)
python3 skills/self_evolution/scripts/ouroboros.py --mode dry_run
```

## Modes
- **Dry Run:** Scans and proposes changes but does not apply them.
- **Hypothesis:** Generates code files in a temporary `forge/temp` directory.
- **Ascension:** (Requires Approval) Applies changes to the core.
