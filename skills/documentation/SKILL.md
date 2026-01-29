---
name: Documentation Keeper
description: A skill to maintain, update, and log system capabilities and features in the SKILLS_MAP.md and CAPABILITIES.md files.
---

# 📜 Documentation Keeper Skill

This skill ensures that every new technical capability or upgrade is logged in a central "Source of Truth" to prevent knowledge decay.

## 1. Capabilities Log (`docs/CAPABILITIES.md`)
Whenever a new feature is added (like "Multimodal Search" or "Hivemind"), it must be logged here.

**Format:**
```markdown
## [v0.X.Y] Feature Name
- **Date:** YYYY-MM-DD
- **Owner:** [Identity, e.g., Anuu, Thoth]
- **Description:** Brief description of what it does.
- **Files Modified:** List of key files.
- **Command:** How to trigger it.
```

## 2. Skills Map (`docs/SKILLS_MAP.md`)
Maps available "Tools" or "Skills" directory to their function.

## 3. Usage
When you add a feature, run this:

1. **Check if `docs/CAPABILITIES.md` exists.** If not, create it.
2. **Append the new feature entry.**
3. **Update `README.md`** if it's a major user-facing feature.

## 4. Current State (Auto-Generated)
*This section is for the agent to update implicitly.*
