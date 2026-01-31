# 🔍 Plantilla Universal: Análisis de Repositorio

**Prompt reutilizable para analizar cualquier proyecto GitHub y obtener feedback accionable.**

---

## 🎯 CÓMO USAR ESTA PLANTILLA

1. **Copia el prompt de abajo**
2. **Reemplaza las variables** `{{VARIABLE}}` con tus datos
3. **Pégalo en tu LLM** (Claude, GPT-4, Gemini, Perplexity)
4. **Archiva el análisis** en `docs/reviews/`
5. **Implementa top 3 prioridades**

---

## 📋 PROMPT UNIVERSAL

```
Eres un consultor senior especializado en:
- Open Source Strategy
- Developer Experience
- {{DOMAIN}} Product Development  # e.g., AI/ML, Web3, DevTools
- GitHub Best Practices
- Growth & Monetization

Analiza este repositorio: {{REPO_URL}}

CONTEXTO DEL PROYECTO:
- Nombre: {{PROJECT_NAME}}
- Descripción: {{ONE_LINE_DESCRIPTION}}
- Stack: {{TECH_STACK}}  # e.g., Python, React, Rust
- Concepto: {{CORE_CONCEPT}}  # Qué hace único al proyecto
- Objetivo: {{MAIN_GOAL}}  # e.g., "10k stars", "€2k MRR", "500 users"
- Fase actual: {{STAGE}}  # Pre-launch, Growth, Mature

ESTADO ACTUAL (lo que YA HEMOS HECHO):
{{ACHIEVEMENTS}}
# Ejemplo:
# ✅ README profesional
# ✅ Documentación completa
# ✅ Tests al 80%

LO QUE FALTA:
{{GAPS}}
# Ejemplo:
# - Docker support
# - Video demo
# - Community forum

---

TU TAREA:

Analiza el repositorio con esta estructura:

## 1. PRIMERA IMPRESIÓN (30 segundos test)
Abre {{REPO_URL}}
- ¿Entiendes PARA QUÉ sirve en 30 segundos?
- ¿Sabes QUÉ HACER después?
- Claridad del README: [1-10]

## 2. README AUDIT
Evalúa:
- Estructura: ¿Sigue patrón What → Why → How?
- Ejemplos: ¿Ejecutables? ¿Output esperado visible?
- Visuales: ¿GIFs, screenshots, diagramas?
- CTAs: ¿Llamadas a acción claras?
- Badges: ¿Informativos o decorativos?

Da 3 mejoras específicas con ejemplos de código/markdown.

## 3. DOCUMENTACIÓN
Navega por los docs principales:
{{MAIN_DOCS}}
# Ejemplo:
# - README.md
# - docs/getting-started.md
# - CONTRIBUTING.md

Evalúa:
- ¿Fácil navegar entre docs?
- ¿Contenido claro y actualizado?
- ¿Ejemplos de código reales?

Identifica 1 doc que FALTA o debería expandirse.

## 4. CÓDIGO Y ARQUITECTURA
Revisa:
{{KEY_DIRECTORIES}}
# Ejemplo:
# - src/core/
# - examples/
# - tests/

Evalúa:
- Claridad de estructura de carpetas
- Naming conventions consistentes
- Ejemplos funcionan out-of-the-box
- Tests presentes y útiles

Da 2 mejoras técnicas prioritarias.

## 5. COMUNIDAD
Analiza:
- **Issues:** Cantidad, etiquetas, actividad
- **Discussions:** Habilitadas, categorías, engagement
- **PRs:** Proceso claro, templates útiles
- **Activity:** Commits recientes, consistencia

Da 3 acciones para aumentar engagement en próximos 7 días.

## 6. MONETIZACIÓN {{IF_APPLICABLE}}
Si el proyecto busca ingresos, evalúa:
- ¿Modelo de negocio claro?
- ¿Pricing transparente?
- ¿CTAs para pagar/contratar?
- ¿Diferenciación vs competencia?

Sugiere 1 mejora al plan de ingresos.

## 7. BRANDING Y SEO
Evalúa:
- **Perfil del usuario:** Bio, foto, links
- **Descripción del repo:** Optimizada para búsqueda
- **Topics/Tags:** Relevantes y completos
- **About section:** Claro y conciso
- **Social Proof:** Stars, used by, testimonials

Sugiere mejoras de discoverabilidad.

## 8. COMPETENCIA
Busca 3-5 proyectos similares en el mismo espacio.

Compara:
- Features
- Documentación
- Stars/forks
- Approach

Sugiere cómo {{PROJECT_NAME}} puede diferenciarse mejor.

## 9. QUICK WINS
Lista 5 cambios que:
- Toman <1 hora implementar
- Tienen alto impacto en adopción/credibilidad

Formato requerido:
- [ ] **[Acción específica]**
  - ✨ Impacto: [por qué importa]
  - 🔧 Cómo: [pasos concretos, incluye snippets si aplica]
  - ⏱️ Tiempo: [minutos estimados]

## 10. PELIGROS (Red Flags)
Identifica problemas críticos que alejan usuarios:
- Código que no compila/ejecuta
- Docs rotos (links 404)
- Instalación muy compleja sin workaround
- Promesas incumplidas (features anunciadas no implementadas)
- Inactividad aparente

---

## FORMATO DE RESPUESTA

### EXECUTIVE SUMMARY
- **Estado actual:** [X/10]
- **Principal fortaleza:** [una línea]
- **Principal debilidad:** [una línea]
- **Sentimiento general:** [¿Adoptarías este proyecto?]

### ANÁLISIS DETALLADO
[Secciones 1-10 completadas]

### TOP 3 PRIORIDADES
1. **[Acción]**
   - Por qué: [impacto esperado]
   - Cómo: [pasos específicos]
   - Tiempo: [estimación]

2. **[Acción]**
   - Por qué: [...]
   - Cómo: [...]
   - Tiempo: [...]

3. **[Acción]**
   - Por qué: [...]
   - Cómo: [...]
   - Tiempo: [...]

### PROYECCIÓN
Si implementan las 3 prioridades en las próximas {{TIMEFRAME}}:
- Stars: [X → Y esperados]
- Adopción: [impacto cualitativo]
- Engagement: [issues, discussions, PRs esperados]

---

## RESTRICCIONES CRÍTICAS

- ❌ **NUNCA** des feedback genérico tipo "mejora la documentación"
- ✅ **SIEMPRE** da ejemplos concretos con snippets de código/markdown
- ❌ **NUNCA** asumas sin verificar navegando el repo
- ✅ **SIEMPRE** prioriza por impacto real, no por "nice to have"
- ✅ **SIEMPRE** incluye métricas estimadas cuando sea posible

---

Comienza tu análisis ahora.
```

---

## 🔧 VARIABLES A REEMPLAZAR

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `{{REPO_URL}}` | `https://github.com/user/project` | URL completa del repo |
| `{{PROJECT_NAME}}` | `MyAwesomeProject` | Nombre del proyecto |
| `{{ONE_LINE_DESCRIPTION}}` | `CLI tool for automated deployments` | Descripción de 1 línea |
| `{{TECH_STACK}}` | `Go, PostgreSQL, Docker` | Tecnologías principales |
| `{{CORE_CONCEPT}}` | `Zero-config deployments with AI` | Qué lo hace único |
| `{{MAIN_GOAL}}` | `Reach 1000 active users in 6 months` | Objetivo principal |
| `{{STAGE}}` | `Pre-launch` / `Growth` / `Mature` | Fase del proyecto |
| `{{ACHIEVEMENTS}}` | Lista de ✅ logros | Qué ya tienes |
| `{{GAPS}}` | Lista de `- [ ]` faltantes | Qué falta |
| `{{MAIN_DOCS}}` | `README.md, docs/api.md` | Docs principales |
| `{{KEY_DIRECTORIES}}` | `src/, tests/, examples/` | Carpetas clave |
| `{{DOMAIN}}` | `AI/ML`, `Web3`, `DevTools` | Dominio del proyecto |
| `{{TIMEFRAME}}` | `2 weeks` | Timeline para implementación |
| `{{IF_APPLICABLE}}` | Borrar si no aplica | Condicional |

---

## 📝 EJEMPLO DE USO

### Antes (plantilla):
```
- Nombre: {{PROJECT_NAME}}
- Stack: {{TECH_STACK}}
```

### Después (llenado):
```
- Nombre: FastDeploy
- Stack: Go, Kubernetes, Terraform
```

---

## 🗂️ WORKFLOW COMPLETO

### Paso 1: Preparar el Prompt
```bash
# Copia la plantilla
cat docs/ANALYSIS_PROMPT.md

# Reemplaza variables manualmente o con script
sed -i 's/{{PROJECT_NAME}}/MiProyecto/g' analysis_temp.txt
```

### Paso 2: Ejecutar Análisis
```
1. Pega el prompt en Claude/GPT-4/Perplexity
2. Espera respuesta completa
3. Copia el output
```

### Paso 3: Archivar Resultado
```bash
# Crea archivo con fecha
echo "[Output del LLM]" > docs/reviews/analysis_$(date +%Y%m%d).md

# Commit
git add docs/reviews/
git commit -m "docs: Add external analysis $(date +%Y-%m-%d)"
git push
```

### Paso 4: Crear Issues
```bash
# Para cada prioridad del Top 3:
# - Abre GitHub Issues
# - Copia la recomendación
# - Etiqueta: `enhancement`, `from-analysis`
```

### Paso 5: Implementar Quick Wins
```bash
# Haz los 5 quick wins en 1 sesión
# Commit por cada uno:
git commit -m "fix: [descripción del quick win]"
```

### Paso 6: Medir Impacto
```
Espera 7-14 días y revisa:
- Stars ganadas
- Issues/PRs nuevos
- Traffic (GitHub Insights)
```

---

## 📊 MÉTRICAS A TRACKEAR

Además del análisis cualitativo, pide estos números:

1. **Tiempo hasta entender:** [X minutos]
2. **Tiempo hasta ejecutar ejemplo:** [X minutos]
3. **Claridad README:** [1-10]
4. **Professional appearance:** [1-10]
5. **Likelihood to star:** [1-10]
6. **Likelihood to contribute:** [1-10]
7. **Likelihood to recommend:** [1-10]

---

## � FRECUENCIA RECOMENDADA

| Fase | Frecuencia | Razón |
|------|------------|-------|
| Pre-lanzamiento | 1 análisis | Antes de hacer público |
| Lanzamiento | +7 días | Validar primeras impresiones |
| Crecimiento | Mensual | Optimización continua |
| Maduro | Trimestral | Mantenimiento |

---

## 🎯 VARIANTES ESPECIALIZADAS

### Para ADOPCIÓN (más usuarios)
Añade al prompt:
```
ENFÓCATE ESPECIALMENTE EN:
- Primera impresión y onboarding
- Ejemplos y quickstart
- Comparación vs competencia
- Social proof y credibilidad
```

### Para CONTRIBUIDORES
Añade al prompt:
```
ENFÓCATE ESPECIALMENTE EN:
- Estructura de código clara
- Issues "good first issue"
- Contributing guide detallada
- Roadmap y prioridades visibles
```

### Para MONETIZACIÓN
Añade al prompt:
```
ENFÓCATE ESPECIALMENTE EN:
- Claridad del valor ofrecido
- Modelo de negocio visible
- Pricing y CTAs
- Diferenciación vs gratuitos
```

---

## 💡 TIPS PRO

1. **Combina analizadores:** Usa Claude para profundidad técnica, GPT-4 para estrategia, Perplexity para benchmarking vs competencia.

2. **Análisis iterativo:** Si la respuesta es vaga, replica:
   ```
   "El análisis es demasiado genérico. Por favor:
   1. Da ejemplos CONCRETOS de cambios
   2. Incluye snippets de código/markdown
   3. Prioriza por impacto medible
   4. Sé específico en los 'cómo'"
   ```

3. **Archiva TODO:** Cada análisis es valioso. Commits como `docs: analysis YYYYMMDD` crean historial útil.

4. **Implementa rápido:** El mejor análisis no sirve si no actúas. Implementa top 3 en <1 semana.

---

**Esta plantilla está diseñada para extraer máximo valor de cualquier análisis y ser reutilizable en todos tus proyectos.**

**Guárdala. Úsala. Itera.** 🟣
