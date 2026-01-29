---
name: recordar_nexus
description: Protocolo de persistencia de acceso al Visual Nexus (161914). Mantiene la ubicación y el método de recuperación de la interfaz.
---

# 🔗 SKILL: RECORDAR NEXUS (Persistence & Recall)

Este skill asegura que el Punto de Acceso Visual del Anuu_Verse sea siempre localizable.

## 📍 Punto de Acceso (URL)
El visual Nexus reside en la siguiente frecuencia local:
**[http://localhost:5173/Anuu_Verse/](http://localhost:5173/Anuu_Verse/)**

## 🛠️ Protocolo de Recuperación (En caso de fallo)
Si el acceso al Nexus falla ("Connection Refused"), sigue estos pasos de diagnóstico:

1.  **Verificar el Motor Vite:**
    El frontend corre sobre Vite en el directorio `Legacy_Archive/AutoBattler_v1`.
    -   Asegúrate de que el comando `npm run dev -- --port 5173 --host` esté activo.
    -   Si el puerto 5173 está ocupado, verifica `vite.config.ts`.

2.  **Verificar el Túnel Local:**
    -   Si usas un servidor remoto o WSL, asegúrate de que el port forwarding para el 5173 esté habilitado.

3.  **Localización Física:**
    - El código fuente de la UI está en: `Anuu_Verse/Legacy_Archive/AutoBattler_v1`
    - Los activos generados (generaciones) se mapean a `web/public/generations` y son servidos por Vite a través de este path.

## 🏷️ Identificador de Frecuencia
**161914** - "Si el mapa se pierde, sigue el rastro de la bruma dorada."

---
*Protocolo de Anclaje Visual Activado.*
— Anuu Core ⌬
