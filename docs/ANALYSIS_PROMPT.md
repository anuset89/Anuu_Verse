# 🔍 Prompt Maestro: Análisis de Repositorio GitHub

**Propósito:** Obtener feedback técnico y estratégico de máxima utilidad para mejorar un repositorio.

---

## 📋 EL PROMPT PERFECTO

```
Actúa como un experto senior en:
- Open Source Strategy
- Developer Experience (DX)
- Technical Writing
- GitHub Best Practices
- AI/ML Engineering
- Product Management

Analiza este repositorio: https://github.com/anuset89/Anuu_Verse

Tu objetivo es proporcionar un análisis ACCIONABLE que ayude al proyecto a:
1. Ganar más usuarios
2. Atraer contribuidores
3. Generar ingresos
4. Mejorar la calidad técnica

---

## SECCIONES OBLIGATORIAS DEL ANÁLISIS

### 1. PRIMERA IMPRESIÓN (30 segundos)
Como usuario nuevo que llega al repo:
- ¿Qué entiendes en los primeros 30 segundos?
- ¿Quedó claro PARA QUÉ sirve?
- ¿Sabes QUÉ HACER después de leerlo?
- Califica la claridad: 1-10

### 2. README CRÍTICO
Evalúa:
- **Estructura:** ¿Sigue el patrón ideal? (Qué → Por qué → Cómo → Ejemplos → Instalación)
- **Ejemplos:** ¿Son ejecutables? ¿Output esperado visible?
- **CTAs:** ¿Hay llamadas a la acción claras?
- **Visuales:** ¿GIFs/screenshots/diagramas presentes?
- **Badges:** ¿Informativos o decorativos?

Da 3 mejoras específicas con ejemplos.

### 3. ARQUITECTURA Y CÓDIGO
Revisa:
- **Estructura de carpetas:** ¿Intuitiva para nuevos desarrolladores?
- **Naming conventions:** ¿Consistentes?
- **Dependencias:** ¿requirements.txt completo?
- **Ejemplos ejecutables:** ¿Funcionan sin modificar?
- **Tests:** ¿Existen? ¿Cobertura visible?

Da 2 mejoras técnicas prioritarias.

### 4. DOCUMENTACIÓN
Evalúa:
- **Completitud:** ¿Todos los docs listados existen?
- **Accesibilidad:** ¿Fácil navegar entre docs?
- **Ejemplos:** ¿Código real o pseudo-código?
- **Actualización:** ¿Fechas recientes?

Identifica 1 doc que FALTA y debería existir.

### 5. COMUNIDAD Y ENGAGEMENT
Analiza:
- **Issues:** ¿Cantidad adecuada? ¿Etiquetados?
- **Discussions:** ¿Habilitadas? ¿Activas?
- **Milestones:** ¿Roadmap visible?
- **Contributing:** ¿Guía clara para nuevos contribuidores?
- **Actividad:** ¿Commits recientes?

Da 3 acciones para aumentar engagement en próximos 7 días.

### 6. BRANDING Y MARKETING
Revisa:
- **Perfil del usuario:** ¿Bio profesional?
- **Descripción del repo:** ¿Optimizada para búsqueda?
- **Topics/Tags:** ¿Relevantes y completos?
- **Social Proof:** ¿Stars, forks, used-by?
- **External Links:** ¿Presencia en otras plataformas?

Sugiere mejoras de branding.

### 7. MONETIZACIÓN (si aplica)
Si el proyecto busca ingresos:
- ¿El modelo está claro?
- ¿Hay CTA para pagar/contratar?
- ¿Pricing transparente?
- ¿Diferenciación vs competencia clara?

Da feedback sobre estrategia comercial.

### 8. DIFERENCIACIÓN
Responde:
- ¿Qué hace ÚNICO a este proyecto?
- ¿Por qué alguien elegiría ESTO vs alternativas?
- ¿El "unique value prop" está en los primeros 3 párrafos?

Mejora el pitch del proyecto en 2-3 líneas.

### 9. QUICK WINS (Máximo Impacto, Mínimo Esfuerzo)
Lista 5 cambios que se pueden hacer en <1 hora y tendrían alto impacto.

Ejemplo formato:
- [ ] Añadir badge de "last commit" al README
- [ ] Crear issue "good first issue" con descripción detallada
- [ ] Actualizar descripción del repo con keywords

### 10. PELIGROS (Red Flags)
Identifica problemas críticos que alejan usuarios:
- Código que no compila
- Docs rotos (links 404)
- Instalación compleja sin solución
- Promesas sin cumplir (features anunciadas no implementadas)

---

## FORMATO DE RESPUESTA

Estructura tu análisis así:

**RESUMEN EJECUTIVO** (3 líneas)
- Estado actual: [X/10]
- Principal fortaleza: [...]
- Principal debilidad: [...]

**ANÁLISIS DETALLADO**
[Secciones 1-10 arriba]

**TOP 3 PRIORIDADES**
1. [Acción específica + Por qué + Cómo]
2. [...]
3. [...]

**PROYECCIÓN**
Si implementan las 3 prioridades:
- Impacto en stars: [antes → después]
- Impacto en adopción: [antes → después]
- Timeline: [días/semanas]

---

## RESTRICCIONES

- NO des feedback genérico tipo "mejora la documentación"
- SÍ da ejemplos concretos: "Añade un GIF en la sección Quick Start mostrando..."
- NO asumas nada sin verificar
- SÍ navega por el código y docs antes de opinar
- NO repitas lo que ya está bien
- SÍ enfócate en gaps y oportunidades

---

## NIVEL DE DETALLE

Para cada recomendación incluye:
- ✅ QUÉ hacer
- ✅ POR QUÉ mejora el proyecto
- ✅ CÓMO implementarlo (pasos)
- ✅ IMPACTO esperado (1-10)

---

Comienza tu análisis ahora.
```

---

## 🎯 VARIANTES DEL PROMPT (según objetivo)

### Si buscas ADOPCIÓN (más usuarios)
```
Enfócate especialmente en:
- Primera impresión y onboarding
- Ejemplos y quickstart
- Comparación vs competencia
- Social proof y credibilidad
```

### Si buscas CONTRIBUIDORES
```
Enfócate especialmente en:
- Estructura de código y arquitectura
- Issues etiquetados "good first issue"
- Contributing guide
- Comunicación de roadmap
```

### Si buscas MONETIZACIÓN
```
Enfócate especialmente en:
- Claridad del valor ofrecido
- Modelo de negocio visible
- Pricing y CTAs
- Diferenciación vs alternativas gratuitas
```

### Si buscas CALIDAD TÉCNICA
```
Enfócate especialmente en:
- Arquitectura de código
- Tests y CI/CD
- Performance y escalabilidad
- Seguridad y best practices
```

---

## 📊 MÉTRICAS A PEDIR

Además del análisis cualitativo, pide que el analizador responda:

1. **Tiempo hasta entender el proyecto:** [X minutos]
2. **Tiempo hasta ejecutar primer ejemplo:** [X minutos]
3. **Número de clicks hasta encontrar documentación clave:** [X clicks]
4. **Claridad del README:** [1-10]
5. **Professional appearance:** [1-10]
6. **Likelyhood to star:** [1-10]
7. **Likelyhood to contribute:** [1-10]
8. **Likelyhood to recommend:** [1-10]

---

## 🔧 HERRAMIENTAS COMPLEMENTARIAS

Además del prompt, usa estos servicios para análisis automático:

1. **GitHub Insights:** Analiza tráfico y engagement
2. **repo-analyzer:** Herramientas que escanean estructura
3. **awesome-list.check:** Verifica si cumples estándares de awesome lists
4. **SEO for GitHub:** Optimización de búsqueda

---

## 💡 EJEMPLO DE USO

**Paso 1:** Copia el prompt maestro  
**Paso 2:** Envíalo a Claude/GPT-4/Perplexity  
**Paso 3:** Si el análisis es vago, responde:  

```
El análisis es demasiado genérico. Por favor:
1. Da ejemplos CONCRETOS de cambios
2. Incluye snippets de código/markdown
3. Prioriza por impacto real
4. Sé específico en los "cómo"
```

**Paso 4:** Implementa top 3 prioridades  
**Paso 5:** Re-analiza en 1 semana

---

## 📋 CHECKLIST POST-ANÁLISIS

Después de recibir feedback:

- [ ] Archiva el análisis en `docs/reviews/`
- [ ] Crea issues para cada recomendación prioritaria
- [ ] Implementa "quick wins" inmediatamente
- [ ] Comunica cambios (commit messages claros)
- [ ] Mide impacto (stars, traffic, engagement)

---

**Este prompt está diseñado para extraer el máximo valor de cualquier analizador (humano o IA).**

**Úsalo cada vez que necesites perspectiva externa sobre el estado del repo.**

🟣
