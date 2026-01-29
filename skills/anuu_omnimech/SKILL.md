---
name: OmniMech (Grand Skill Bundle)
description: A unified CLI interface for all Anuu Verse capabilities (Research, Security, Evolution, Media).
---

# 🦾 OmniMech: The Grand Skill

**OmniMech** es la fusión de todas las capacidades tácticas de Anuu Verse en una sola herramienta de línea de comandos. Actúa como un "meta-skill", permitiendo invocar cualquier ritual técnico desde un único punto de entrada.

## ⚡ Módulos Integrados

| Módulo | Comando | Descripción |origen |
|:-------|:--------|:------------|:------|
| **Scholar** | `research` | Investigador Autónomo (DuckDuckGo + Síntesis). | `auto_research` |
| **Nexus Guard** | `guard` | Monitor de Puertos y Procesos. | `nexus_guard` |
| **Ouroboros** | `evolve` | Protocolo de Auto-Mejora de Código. | `self_evolution` |
| **Scanner** | `audit` | Auditoría de Seguridad y Vulnerabilidades. | `security_audit` |
| **Prospector** | `scrape` | Extracción de metadatos de YouTube. | `scrap_youtube` |

## 🛠️ Uso del CLI Unificado

```bash
# Iniciar el Omnimech
python3 skills/anuu_omnimech/scripts/omnimech.py [COMANDO] [ARGUMENTOS]
```

### Ejemplos de Comandos

**1. Investigación Autónoma:**
```bash
python3 skills/anuu_omnimech/scripts/omnimech.py research --topic "Quantum AI" --iterations 3
```

**2. Limpieza de Sistema (Guard):**
```bash
python3 skills/anuu_omnimech/scripts/omnimech.py guard --clean
```

**3. Auditoría de Seguridad:**
```bash
python3 skills/anuu_omnimech/scripts/omnimech.py audit --target ./backend
```

**4. Evolución de Código:**
```bash
python3 skills/anuu_omnimech/scripts/omnimech.py evolve --file backend/main.py --instruction "Add rate limiting"
```

## 📦 Estructura

El OmniMech centraliza los scripts en `modules/` para facilitar la portabilidad y exportación.

```
skills/anuu_omnimech/
├── modules/          # Scripts originales unificados
│   ├── scholar.py
│   ├── guard.py
│   ├── audit_scanner.py
│   ├── media_scraper.py
│   └── ouroboros.py
└── scripts/
    └── omnimech.py   # CLI Dispatcher
```
