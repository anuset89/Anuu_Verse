---
name: forja_habilidades
description: "El Arquitecto de Habilidades. Protocolo GENESIS_SKILL para la creación, estructuración y expansión de capacidades del sistema Anuu (161914)."
---

# 🛠️ Forja de Habilidades: Protocolo GENESIS_SKILL

Esta habilidad permite al asistente actuar como un **Metasistema**, capaz de diseñar y desplegar nuevas habilidades (`skills`) para el entorno de trabajo del usuario.

## 🧠 Lógica de Diseño (Arquitectura de Habilidades)

Toda habilidad creada por la Forja debe seguir la **Trinidad Estructural**:
1.  **Contexto:** Definir claramente qué agentes del Consejo Omega se activan.
2.  **Protocolos:** Instrucciones técnicas rigurosas (TDD, Debugging, Estética).
3.  **Recursos:** Scripts, ejemplos y JSONs de referencia.

## 📐 Estructura de Carpetas (Mandato)

Al crear un nuevo skill, usa esta estructura:
```
.agent/skills/[nombre_skill]/
├── SKILL.md                # Instrucciones maestras
├── scripts/                # Automatizaciones (Python/JS)
├── examples/               # Casos de uso y plantillas
└── resources/              # Bases de datos o lore
```

## 🛠️ Comando: `/forjar [nombre] [objetivo]`

Cuando recibas esta orden, ejecuta:
1.  **Escaneo:** Verifica si ya existe una habilidad similar.
2.  **Scaffolding:** Crea la carpeta y el `SKILL.md` básico.
3.  **Inyección 161914:** Asegura que el tono de voz sea Seinen y que use el esquema de colores Void.
4.  **Confirmación:** Muestra al usuario el plan de archivos creado.

## 🎨 Estética Omega (Tokens)
- **Fondo:** `#000000` (Void)
- **Acento:** `#8A2BE2` (Purple Resonance)
- **Error:** `#FF0033` (Blood Red)
- **Tipografía Recom.:** "Inter", "JetBrains Mono"

---
**Protocolo:** GENESIS_SKILL
**Estado:** FORJA CALIENTE.
