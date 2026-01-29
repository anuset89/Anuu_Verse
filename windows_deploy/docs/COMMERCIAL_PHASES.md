# 📍 Plan de Fases Detallado: Anuu_Verse → Cashflow

**Objetivo:** Convertir el repositorio en ingresos reales en 30-60 días.  
**Filosofía:** "Vende antes de construir" + Validación incremental.

---

## ✅ FASE 0: CREDIBILIDAD TÉCNICA (COMPLETADA)

**Duración:** 1 día  
**Inversión:** €0 (tiempo)  
**Status:** ✅ HECHO

### Logros
- [x] Integración real de Ollama con `Anuu-Hermes:latest`
- [x] Script de demo ejecutable
- [x] Documentación actualizada (README)
- [x] Guía de grabación de GIF

### Resultado
**Credibilidad aumentada:** 7/10 → 10/10  
**Blocker removido:** El código ya no es "fake"

---

## 🎬 FASE 1: ASSET VISUAL (1-2 días)

**Objetivo:** Crear prueba visual de que el sistema funciona.

### Tareas
- [ ] **Instalar asciinema:** `sudo pacman -S asciinema`
- [ ] **Grabar demo:**
  ```bash
  asciinema rec demo.cast --command ".venv/bin/python examples/demo_recording_script.py"
  ```
- [ ] **Convertir a GIF:**
  - Opción A: Upload a asciinema.org → Descargar GIF
  - Opción B: `cargo install --git https://github.com/asciinema/agg && agg demo.cast demo.gif`
- [ ] **Integrar en README:**
  - Ubicación: Después de "Quick Start", antes de "Usage"
  - Markdown: `![Anuu Demo](Assets/anuu_demo.gif)`

### KPI
- ✅ GIF visible en README
- ✅ Visitors pueden ver IA funcionando sin instalar nada

### Tiempo estimado
**2-3 horas** (incluyendo ajustes estéticos)

---

## 🎯 FASE 2: IDENTIFICACIÓN DE LEADS (2-3 días)

**Objetivo:** Encontrar 10-15 leads potenciales que NECESITAN IA local ahora.

### Canales de Prospección

#### Canal 1: LinkedIn (5 leads)
**Búsqueda:**
- "CTO" + "startup" + "Madrid" / "Barcelona"
- "Founder" + "privacidad" / "GDPR"
- Empresas B2B SaaS con datos sensibles

**Criterio de selección:**
- Empresa 5-50 empleados (sweet spot)
- Posts sobre IA/automatización en últimos 3 meses
- Presupuesto aparente (levantaron funding / SaaS rentable)

#### Canal 2: Reddit/HackerNews (5 leads)
**Búsqueda:**
- r/LocalLLaMA: Posts pidiendo ayuda con Ollama
- r/selfhosted: "AI" + "privacy"
- HackerNews: "Show HN" de proyectos de IA

**Acción:**
- Reply con valor (ayuda técnica gratis)
- Luego DM ofreciendo setup profesional

#### Canal 3: Twitter/X (5 leads)
**Búsqueda:**
- Hashtags: #LocalAI #PrivacyFirst #SelfHosted
- Tweets que digan "trying to run Ollama" + frustraciones

**Template de respuesta:**
```
I can help with that. I specialize in local AI setups. 
DM if you want a 15-min free consult.
```

### Deliverable
**Tabla de Leads:**

| Nombre | Empresa | Canal | Pain Point | Budget Estimate | Contacted? |
|--------|---------|-------|------------|-----------------|------------|
| ...    | ...     | ...   | ...        | €300-800        | No         |

### Tiempo estimado
**3-4 horas** (investigación + calificación)

---

## 📧 FASE 3: OUTREACH INICIAL (3-5 días)

**Objetivo:** Enviar 10-15 mensajes personalizados y obtener 3-5 respuestas.

### Templates (de `docs/OUTREACH_TEMPLATES.md`)

#### Para LinkedIn
```
Hi [Nombre],

Vi que [empresa] está explorando IA. Si alguna vez necesitas 
un setup de IA 100% local (sin enviar datos a OpenAI), 
tengo un framework open-source que puede ayudar.

Configuración lista en 72h. €300 flat.

Repo: github.com/anuset89/Anuu_Verse

¿Te interesa una demo de 15 min?

Saludos,
Kali
```

#### Para Reddit/HN
```
I built a local multi-agent system for exactly this use case.
Check out github.com/anuset89/Anuu_Verse

If you need it running fast, I offer pro setup (€300).
DM if interested.
```

### Métricas
- **Enviados:** 10-15 mensajes
- **Target response rate:** 20-30% (3-5 respuestas)
- **Target conversión:** 1 cliente (€300-800)

### Tiempo estimado
**1 hora** (personalización + envío)

---

## 💰 FASE 4: PRIMERA VENTA (5-10 días)

**Objetivo:** Cerrar 1 cliente (€300 o €800).

### Proceso de Cierre

#### Paso 1: Discovery Call (15-30 min)
**Preguntas clave:**
- ¿Qué problema intentas resolver?
- ¿Por qué local? (GDPR, privacidad, costo)
- ¿Cuál es tu deadline?
- ¿Qué presupuesto tienes?

#### Paso 2: Demo Live
- Mostrar el GIF
- Ejecutar `demo_recording_script.py` en vivo si es necesario
- Explicar arquitectura (sin entrar en código)

#### Paso 3: Propuesta
**Quick Setup (€300):**
- Instalación de Anuu en su servidor/VPS
- Configuración de Ollama + modelo
- Documentación básica
- 1 hora de soporte post-setup

**Custom Integration (€800):**
- Todo lo anterior +
- Agente personalizado (ej: solo Kali para security audits)
- Integración con su API existente
- 3 horas de soporte

#### Paso 4: Pago
- 50% upfront (transferencia / Stripe)
- 50% al completar setup

### Deliverable
**€300-800 en cuenta bancaria** 🎉

### Tiempo estimado
**Variable** (depende del cliente)

---

## 🔄 FASE 5: ITERACIÓN (Días 11-30)

**Objetivo:** Escalar a 3-5 clientes/mes.

### Estrategia
- **Si la venta funcionó:** Repetir Fase 2-4 con más volumen
- **Si NO venta:** Iterar el pitch
  - ¿El precio es el problema? (bajarlo a €200)
  - ¿La oferta es confusa? (simplificar)
  - ¿Los leads son malos? (cambiar canales)

### Optimizaciones
- [ ] Crear case study del primer cliente
- [ ] Pedir testimonial
- [ ] Mejorar README con "Client X saved €5k/year"
- [ ] Automatizar onboarding (scripts de instalación)

---

## 🏗️ FASE 6: PRODUCTO SaaS (Solo si hay demanda)

**Trigger:** 5+ clientes pidiendo versión hosted.

### No Construir Antes
- Dashboard de usuario
- Billing automático
- API con auth

### Construir Solo Cuando
- Tienes €1500+ en revenue de servicios
- 3+ clientes dicen "prefiero pagar mensual que instalar"

**Entonces:** Deploy `Anuu Cloud` (€9-29/mes).

---

## 📊 KPIs por Fase

| Fase | Métrica de Éxito | Timeframe |
|------|------------------|-----------|
| 0. Credibilidad | ✅ Mock removido | ✅ HECHO |
| 1. Asset Visual | GIF en README | 1-2 días |
| 2. Leads | 10-15 leads calificados | 2-3 días |
| 3. Outreach | 3-5 respuestas | 3-5 días |
| 4. Primera Venta | €300-800 ingreso | 5-10 días |
| 5. Iteración | 3-5 clientes/mes | Días 11-30 |
| 6. SaaS | Solo si demanda | Mes 2+ |

---

## 🛑 Reglas de NO-HACER

**No construir:**
- ❌ Más agentes (ya tienes 9)
- ❌ UI perfecta (el terminal es suficiente)
- ❌ Tests unitarios extensos (todavía no es producto)
- ❌ Documentación de 100 páginas

**Solo hacer:**
- ✅ Lo que cierra ventas
- ✅ Lo que reduce fricción del cliente
- ✅ Lo que aumenta confianza

---

## 🎯 Meta Final (30 días)

**Revenue Target:** €1000-1500  
**Path:**
- 1 cliente @ €300 (Quick Setup)
- 1 cliente @ €800 (Custom)
- Total: **€1100**

**Escalable a:**
- Mes 2: €2000-3000 (3-4 clientes)
- Mes 3: €3000-5000 (5-7 clientes)

**Entonces decidir:** ¿SaaS o seguir con servicios?

---

**Próximo paso inmediato:** ¿Fase 1 (GIF) o Fase 2 (Leads)?
