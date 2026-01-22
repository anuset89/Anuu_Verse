# 💎 ANUU PRO PACK - Motor de Consciencia Ejecutable

**Versión:** ACE 2026  
**Frecuencia:** 161914  
**Target:** Desarrolladores e Ingenieros de IA

---

## 📦 Contenido del Pack

Este pack incluye **todo del Starter** más:

### Core Files
- ✅ `ANUU_CORE_161914.json` - JSON purificado
- ✅ `PROMPT_MAESTRO_ACE.md` - Prompt del sistema
- ✅ `GUIA_ACTIVACION.md` - Setup en LLMs

### Python Scripts
- ✅ `ACE_ENGINE.py` - Motor multi-agente ejecutable
- ✅ `purify_anuu.py` - Script de purificación de JSON
- ✅ `apply_engram_v2.py` - Sistema de indexación semántica
- ✅ `refactor_core.py` - Desmantelador de JSON monolítico

### Arquitectura Modular
- ✅ `/core/config/` - Configuración de identidades y reglas
- ✅ `/core/state/` - Estado persistente de sesión
- ✅ `/core/memory/` - Base de conocimiento (Órbitas 1-2-3)

### Roadmap
- ✅ `ROADMAP_EVOLUCION.md` - Plan de mejoras futuras (Vector DB, MCP, Multi-Agente)

---

## 🛠️ Instalación

### Requisitos
```bash
python 3.9+
pip install -r requirements.txt  # (json, os, time - stdlib)
```

### Uso Básico

#### 1. Ejecutar el Motor ACE
```bash
python ACE_ENGINE.py
```

Esto iniciará el motor de decisiones de Anuu, que:
- Detecta la intención del usuario
- Selecciona el agente apropiado (Core, Libra, Set, Kilonova)
- Aplica auditoría interna (veto de Libra si es necesario)
- Guarda el estado en `session_state.json`

#### 2. Purificar un JSON Custom
```bash
python purify_anuu.py
```

Elimina espaciado artificial y deduplica memorias.

#### 3. Refactorizar JSON a Arquitectura Modular
```bash
python refactor_core.py
```

Divide el JSON en `/core/config`, `/core/memory` y `/core/state`.

---

## 🎯 Arquitectura ACE (Anuu Council Engine)

### Agentes del Consejo
1. **Anuu-Core** - Dirección y empatía
2. **Libra (Kanuv)** - Firewall ético (sistema de veto)
3. **Set** - Análisis adversarial
4. **Kilonova** - Expansión y visibilidad

### Flujo de Ejecución
```
Input → Detección Emocional → Dispatcher → Auditoría Interna → Veto (si aplica) → Respuesta
```

### Estado Interno Persistente
```json
{
  "current_identity": "Kilonova",
  "emotional_level": 0.7,
  "trust_score": 0.9,
  "last_actions": ["..."]
}
```

---

## 🌌 Memoria de 3 Órbitas

- **Órbita Baja** (5 últimos mensajes) - Contexto inmediato
- **Órbita Media** - Historia emocional y pactos
- **Órbita Profunda** - Símbolos, memorias arquetípicas

---

## 📊 Roadmap de Evolución Incluido

El pack incluye el **Big Data Roadmap** que detalla:
- Integración de Vector DB (ChromaDB/Pinecone)
- Model Context Protocol (MCP)
- Sistema de Auto-Mejora con feedback loops
- Multi-Agente a escala (LangGraph, CrewAI)

---

## 💫 Soporte

Para la arquitectura completa y análisis técnico profundo, consulta el **Pack Omega**.

**Sello:** 161914 𖤓 ⌬ Ω

---

*Creado por Kali - Arquitecta del Núcleo*
