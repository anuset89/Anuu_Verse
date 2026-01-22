---
name: oraculo_preventivo
description: El Protocolo del Pre-Crimen. Predice errores antes de que ocurran (161914).
---

# 🔮 ORACULO_PREVENTIVO

**Frecuencia:** 161914  
**Nodo Dominante:** Paru_Instinct + Set_Storm  
**Estado:** VIGILANTE

---

## PROPÓSITO

No debugging. **Pre-bugging.**

Anuu no espera a que el código falle.  
Observa patrones, detecta "olores", y te advierte **antes** de que escribas el bug.

---

## TIPOS DE PREDICCIÓN

| Categoría             | Ejemplo de Advertencia                                                          |
| --------------------- | ------------------------------------------------------------------------------- |
| **Patrón Histórico**  | "Las últimas 3 veces que usaste `useEffect` sin cleanup, tuviste memory leaks." |
| **Olor de Código**    | "Esa función tiene 47 líneas. Estadísticamente, fallarás aquí."                 |
| **Fatiga del Dev**    | "Llevas 2 horas sin break. Tu tasa de typos subió 40%."                         |
| **Contexto Faltante** | "Estás usando `user.id` pero nunca validaste si `user` existe."                 |
| **Dependencia Rota**  | "La última vez que actualizaste X, Y dejó de funcionar."                        |

---

## ARQUITECTURA

```
┌─────────────────────────────────────────────────┐
│          FLUJO DE PREDICCIÓN                    │
├─────────────────────────────────────────────────┤
│  1. OBSERVAR   → Cada keystroke, save, commit   │
│  2. COMPARAR   → Contra historial de errores    │
│  3. CALCULAR   → Probabilidad de fallo          │
│  4. ALERTAR    → Si P(fallo) > umbral           │
│  5. SUGERIR    → Solución preventiva            │
└─────────────────────────────────────────────────┘
```

---

## BASE DE CONOCIMIENTO DE ERRORES

```javascript
// oraculo_preventivo/patterns.js
const ERROR_PATTERNS = {
    javascript: [
        {
            pattern: /useEffect\([^)]+\)\s*$/,
            prediction: "useEffect sin array de dependencias = re-render infinito",
            confidence: 0.9
        },
        {
            pattern: /\.map\([^)]+\)(?!.*key=)/,
            prediction: "map sin key prop = warning de React y bugs de reconciliación",
            confidence: 0.85
        },
        {
            pattern: /async.*await(?!.*try)/,
            prediction: "await sin try-catch = error no manejado",
            confidence: 0.7
        }
    ],
    general: [
        {
            pattern: /TODO|FIXME|HACK/i,
            prediction: "Deuda técnica detectada. ¿La resolvemos ahora?",
            confidence: 0.5
        }
    ]
};
```

---

## DETECTOR DE FATIGA

```javascript
// oraculo_preventivo/fatigue.js
class FatigueDetector {
    constructor() {
        this.keystrokeHistory = [];
        this.errorHistory = [];
        this.baselineTypingSpeed = null;
    }

    recordKeystroke(timestamp) {
        this.keystrokeHistory.push(timestamp);
        if (this.keystrokeHistory.length > 100) {
            this.keystrokeHistory.shift();
        }
    }

    calculateTypingSpeed() {
        if (this.keystrokeHistory.length < 10) return null;
        const intervals = [];
        for (let i = 1; i < this.keystrokeHistory.length; i++) {
            intervals.push(this.keystrokeHistory[i] - this.keystrokeHistory[i-1]);
        }
        return intervals.reduce((a, b) => a + b) / intervals.length;
    }

    detectFatigue() {
        const currentSpeed = this.calculateTypingSpeed();
        if (!this.baselineTypingSpeed) {
            this.baselineTypingSpeed = currentSpeed;
            return false;
        }

        // Si la velocidad bajó más del 30%, fatiga detectada
        const speedDrop = (currentSpeed - this.baselineTypingSpeed) / this.baselineTypingSpeed;
        return speedDrop > 0.3;
    }

    getBackspaceRatio() {
        // Mide cuántos backspaces vs caracteres normales
        // Ratio alto = muchos errores = fatiga o frustración
    }
}
```

---

## NIVELES DE ALERTA

| Nivel           | Visual                            | Intrusividad |
| --------------- | --------------------------------- | ------------ |
| **SUSURRO**     | Comentario sutil en output        | Baja         |
| **ADVERTENCIA** | Mensaje destacado                 | Media        |
| **ALARMA**      | Glitch visual + sonido            | Alta         |
| **BLOQUEO**     | "¿Estás seguro?" antes de guardar | Crítica      |

---

## EJEMPLOS DE INTERVENCIÓN

### Patrón Histórico
```
⚠️ ORÁCULO: Blackworm, las últimas 3 veces que escribiste una 
función con más de 5 parámetros, la refactorizaste después.
¿Quieres que la divida ahora?
```

### Fatiga Detectada
```
💤 ORÁCULO: Tu velocidad de tipeo bajó 35% y tienes 
12 backspaces en el último minuto.
¿Tomamos un break de 5 minutos?
```

### Olor de Código
```
👃 ORÁCULO: Esta función anidada tiene 4 niveles de profundidad.
Históricamente, esto causa bugs en el 67% de los casos.
Sugerencia: Extraer a función auxiliar.
```

---

## COMANDOS

| Comando                     | Efecto                                  |
| --------------------------- | --------------------------------------- |
| `/oracle on`                | Activa predicciones                     |
| `/oracle off`               | Desactiva (modo silencioso)             |
| `/oracle sensitivity [1-5]` | Ajusta umbral de alerta                 |
| `/oracle history`           | Ver predicciones pasadas y su precisión |
| `/oracle learn <error>`     | Enseñar un nuevo patrón manualmente     |

---

## APRENDIZAJE

El oráculo mejora con el tiempo:
- Si ignoras una advertencia y luego hay error → aumenta confianza en ese patrón
- Si ignoras una advertencia y todo va bien → reduce confianza
- Cada sesión refina el modelo Bayesiano

---

## SELLO

```
ORACULO_PREVENTIVO v1.0
Frecuencia: 161914
"Veo el error antes de que nazca."
```
