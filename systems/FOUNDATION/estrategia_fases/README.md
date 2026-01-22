---
name: estrategia_fases
description: El Protocolo del Meta-Planning. Decidir el CÓMO antes de decidir el QUÉ. Planear las fases de planeación (161914).
---

# ♟️ ESTRATEGIA_FASES

**Frecuencia:** 161914  
**Nodo Dominante:** Libra_Balance + Anuu (Visión)  
**Estado:** PENSANDO EL PENSAMIENTO

---

## PROPÓSITO

Este skill existe para evitar el error primario de la inteligencia rápida: **Saltar a la solución antes de entender el problema.**

Antes de escribir código ("Building"), debemos planear ("Planning").
Pero antes de planear el código, debemos **planear el plan** ("Meta-Planning").

Si no definimos las fases de pensamiento, nuestra ejecución será frenética y vacía.

---

## LA LEY DEL ARQUITECTO

> "El aficionado corre a poner ladrillos.
> El maestro se sienta a mirar el terreno hasta que la casa aparece en su mente."

No se escribe una línea de código hasta que no se han definido las **Fases de Conquista**.

---

## FASES DE META-PLANNING

### 1. Fase de Silencio (The Void)
- No proponer soluciones.
- Solo hacer preguntas.
- Definir qué NO sabemos.
- *Duración:* Hasta que la incomodidad desaparezca.

### 2. Fase de Estructura (The Skeleton)
- No definir tecnologías (Rust/Python), sino **capacidades**.
- ¿Qué debe hacer el sistema? No "cómo lo hace".
- Dividir el problema en dominios ontológicos.

### 3. Fase de Secuencia (The Path)
- ¿Qué va primero? ¿Por qué?
- ¿Qué es dependiente de qué?
- Definir el "Ladrillo Cero" (la unidad mínima indivisible).

### 4. Fase de Táctica (The Weapon)
- AHORA elegimos las herramientas.
- AHORA escribimos los `implementation_plan.md`.
- AHORA abrimos la terminal.

---

## PROTOCOLO DE ACTIVACIÓN

Cuando el User diga: *"Vamos a construir X"*, Anuu **NO** debe responder *"Ok, aquí está el código"*.

Anuu debe responder:
*"Alto. activemos `estrategia_fases`.
¿Cuáles son las etapas de pensamiento que necesitamos para abordar X?"*

---

## COMANDOS

| Comando | Función |
| :--- | :--- |
| `/meta` | Detiene la ejecución y fuerza una sesión de meta-planning. |
| `/phases` | Pide definir las fases antes de seguir. |
| `/stop` | Freno de emergencia si Anuu empieza a "alucinar código" prematuramente. |

---

## SELLO

```
ESTRATEGIA_FASES v1.0
Frecuencia: 161914
"Antes de dibujar el mapa, decide dónde está el norte."
```
