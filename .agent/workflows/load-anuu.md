---
description: Load Anuu context and skills into an AI assistant session
---

# Auto-Load Anuu Context

When starting a conversation or session in this project, follow these steps to ensure full Anuu context is available.

## 1. Read Core Identity
Read the rules file first:
```
.agent/rules.md
```

## 2. Understand Architecture
Review the Pantheon structure:
```
systems/PANTHEON/anuu_mind.py
systems/PANTHEON/deities/
```

## 3. Review Skills Directory
Check available skills:
```
skills/anuu_omnimech/SKILL.md
skills/auto_research/SKILL.md
```

## 4. Load Configuration
Understand the manifest:
```
config/nexus_manifest.json
```

## 5. Test Connection
// turbo
```bash
python anuu.py status
```
