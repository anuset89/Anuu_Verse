# 🎯 Fase 2: Identificación de Leads - Template

## Lead Tracking Sheet

| # | Nombre | Empresa | Cargo | Canal | Pain Point | Budget Est | Link/Contact | Status | Notas |
|---|--------|---------|-------|-------|------------|------------|--------------|--------|-------|
| 1 | | | CTO | LinkedIn | IA local/GDPR | €500-800 | | NOT_CONTACTED | |
| 2 | | | Founder | Reddit | Ollama setup | €300-500 | | NOT_CONTACTED | |
| 3 | | | Tech Lead | Twitter | Cloud costs | €300-500 | | NOT_CONTACTED | |
| 4 | | | | LinkedIn | | €500-800 | | NOT_CONTACTED | |
| 5 | | | | HN | | €300 | | NOT_CONTACTED | |
| 6 | | | | LinkedIn | | €500-800 | | NOT_CONTACTED | |
| 7 | | | | Reddit | | €300-500 | | NOT_CONTACTED | |
| 8 | | | | Twitter | | €300 | | NOT_CONTACTED | |
| 9 | | | | LinkedIn | | €500 | | NOT_CONTACTED | |
| 10 | | | | HN | | €300 | | NOT_CONTACTED | |

## Búsqueda LinkedIn (Target: 5 leads)

### Query 1: CTOs Startups Madrid/Barcelona
```
"CTO" AND "startup" AND ("Madrid" OR "Barcelona") AND ("AI" OR "IA" OR "machine learning")
```

### Query 2: Founders Privacy-Focused
```
"Founder" AND ("privacy" OR "GDPR" OR "data protection") AND ("SaaS" OR "B2B")
```

### Query 3: Tech Leads con posts de IA
- Filtro: Posts en últimos 30 días
- Keywords en posts: "AI", "automation", "local", "self-hosted"

## Búsqueda Reddit

### Subreddits Target
- r/LocalLLaMA
- r/selfhosted
- r/datahoarder
- r/homelab
- r/privacy

### Query Pattern
```
site:reddit.com/r/LocalLLaMA "ollama" ("help" OR "issue" OR "setup" OR "docker")
```

### Acción
1. Buscar posts de última semana
2. Filtrar por users que parecen ser profesionales (no hobbyists)
3. Reply con valor técnico
4. DM después de 24h

## Búsqueda Twitter/X

### Hashtags Target
- #LocalAI
- #PrivacyFirst
- #SelfHosted
- #Ollama
- #OpenSource

### Query Pattern
```
("trying to run ollama" OR "ollama not working" OR "local AI setup") -filter:retweets
```

### Acción
1. Reply con mini-tip útil
2. Mencionar tu solución sutilmente
3. DM si engagement positivo

## Búsqueda Hacker News

### Show HN Filter
```
site:news.ycombinator.com/show "Show HN" ("AI" OR "local" OR "ollama" OR "self-hosted")
```

### Ask HN Filter
```
site:news.ycombinator.com "Ask HN" ("local AI" OR "private AI" OR "on-premise")
```

### Acción
- Comment con expertise
- No spam directo
- Profile link a GitHub

## Criterios de Calificación

### ✅ LEAD VÁLIDO SI:
- [ ] Tiene necesidad clara (post/tweet/comment lo demuestra)
- [ ] Presupuesto probable (empresa con funding / SaaS rentable)
- [ ] Timeline urgente ("need this ASAP", "deadline", etc)
- [ ] Alcanzable (responde a mensajes, activo en redes)

### ❌ DESCALIFICAR SI:
- Hobbyist sin presupuesto
- Empresa demasiado grande (>200 empleados) - quieren enterprise
- Ya tienen equipo de DevOps robusto
- Estudiante/académico

## Next Steps Una Vez Tengas 10 Leads

1. Copiar esta tabla a `docs/leads/leads_2026-01.md`
2. Rellenar manualmente (30-45 min de investigación)
3. Priorizar top 5 por urgencia + budget
4. Pasar a Fase 3 (Outreach)
