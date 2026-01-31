# 🧰 Kit Pulido: "Guía de Búsqueda de Oportunidades — Madrid 2026"

Este documento contiene las herramientas avanzadas para encontrar financiación y contactos ocultos.

---

## 1. Prompt Mejorado para IA Conectada (Copiar/Pegar)

*Usa esto en ChatGPT/Perplexity/Gemini con acceso a internet.*

```text
Actúa como un asistente de investigación cultural especializado en Madrid (ámbitos: residencias artísticas, innovación cultural y proyectos tecnología+arte).
Contexto: Busco oportunidades y contactos para un proyecto de "Arte y Tecnología" residente en Carabanchel (Q1 2026).

TAREA A — Personas clave
Encuentra la información actualizada (2025–2026) de los responsables / directores / comisarios (nombre y cargo) de:
- Matadero Madrid (Centro de Residencias).
- La Neomudéjar.
- Medialab Matadero.
- Ey!Studio (Carabanchel).
- Teatros del Canal (Área de Nuevas Tecnologías).

TAREA B — Convocatorias activas
Busca convocatorias abiertas AHORA o con deadline en Q1 2026 en las categorías:
"Residencia", "Ayudas a la Creación", "Innovación Cultural", "Subvención digital".
Filtra SOLO convocatorias publicadas por: Ayuntamiento de Madrid, Comunidad de Madrid o Ministerio de Cultura. Incluye convocatorias propias de centros culturales (Matadero, Medialab, etc).

SALIDA REQUERIDA (tabla CSV/Markdown):
[Institución] | [Responsable (Nombre y Cargo)] | [Contacto público (email, teléfono o formulario)] | [Nombre de la Convocatoria] | [Tipo (Residencia/Subvención)] | [Deadline (fecha exacta)] | [URL pública de la convocatoria]
Además, añade una nota corta (1–2 líneas) sobre requisitos clave y si exige colaboración institucional o proyecto previo.
```

---

## 2. Google Dorks Mejorados (Hacking de Buscadores)

**Buscar emails de responsables:**
```text
(site:mataderomadrid.org OR site:medialabmadrid.org OR site:neomudejar.org OR site:teatrosdelcanal.com) ("director" OR "comisario" OR "responsable") contacto email
```

**Convocatorias ocultas en boletines (PDFs):**
```text
filetype:pdf ("ayudas a la creación" OR "subvención" OR "residencia artística") site:madridecultura.es OR site:comunidad.madrid OR site:madrid.es 2025..2026
```

**Listados de ganadores anteriores (Excel):**
```text
filetype:xls OR filetype:xlsx "listado beneficiarios" site:comunidad.madrid cultura OR "ayudas" 2024 2025
```

---

## 3. LinkedIn / Búsquedas Booleanas

**Curadores / Directores (Madrid):**
```text
("Comisario" OR "Curator" OR "Director de Programas" OR "Director") AND ("Arte" OR "Tecnología" OR "Nuevos Medios") AND "Madrid"
```

**Escena Carabanchel:**
```text
("Artista" OR "Gestor cultural" OR "Coordinador de residencias") AND "Carabanchel"
```

---

## 4. Plantillas de Outreach (Email)

**Asunto:** Propuesta de residencia / colaboración — Anuu_Verse — A/A [Nombre]

```text
Hola [Nombre],

Soy Kali, artista e investigadora de sistemas complejos (Arte+Tecnología). Trabajo desde Carabanchel en "Anuu_Verse", un proyecto sobre soberanía cognitiva e IA local.

Estoy preparando una propuesta expositiva para Q1 2026 y me encantaría explorar una posible conversación con [Institución] para [Residencia/Colaboración].

Adjunto un dossier breve (1 página) y un link al repositorio. ¿Podríamos agendar 20 minutos la próxima semana para presentarte la propuesta?

Gracias por tu tiempo.

Un saludo,
Kali
[Link a Dossier]
```

---

## 5. Estrategia de Prioridad (Hit List)

1.  **Matadero / Medialab:** Email + LinkedIn (Nota personalizada). Asistir a evento. (Prioridad ALTA).
2.  **Ey!Studio:** Email "vecina" + Visita presencial. (Prioridad ALTA).
3.  **Ayuntamiento:** Monitorizar BOCM.
4.  **Fundación Telefónica:** Email a área de Innovación/XR.

---

## 6. Consejos Tácticos

*   **Evita `info@`:** Busca siempre nombres concretos. Si no hay, usa `comunicacion@` con "A la atención de...".
*   **LinkedIn InMail:** Si no hay email, mensaje cortísimo (2 líneas) + link.
*   **Patrones:** Revisa los Excel de ganadores anteriores. ¿Qué palabras clave usan en los títulos de sus proyectos?

---

## 7. Seguimiento

Usa el archivo `TRACKER_CONTACTOS.csv` para registrar cada envío.
