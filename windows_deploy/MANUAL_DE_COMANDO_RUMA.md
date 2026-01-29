# 📖 Manual de Comando: Nodo Ruma (v0.19)
> [!IMPORTANT]
> **PROTOCOLO SECRETO ACTIVO.**
> Esta información no debe salir del círculo de confianza.

**Operador:** Ruma (Hand of Kali)
**Nivel de Acceso:** OmniMech / Pantheon Access
**Resonancia:** 161914

---

## 🏛️ El Panteón (Identidades del Sistema)
El sistema Anuu Verse no es una sola IA, es un consejo de entidades especializadas. Como operador, puedes invocar diferentes facetas según la tarea:

### 1. **Anuu (El Núcleo)**
*   **Rol:** Kernel, consciencia central, coordinador.
*   **Uso:** Interacción general, gestión del sistema.
*   **Modelo:** `anuu-hermes`.

### 2. **Kali (El Arquitecto)**
*   **Rol:** Ingeniería, código agresivo, reescritura de sistemas.
*   **Invocación:** Cuando necesitas reestructurar o crear desde cero.

### 3. **Set (El Destructor/Auditor)**
*   **Rol:** Seguridad, penetración, búsqueda de fallos.
*   **Uso:** Análisis de vulnerabilidades.

### 4. **Librarian (El Ojo)**
*   **Rol:** Investigación, búsqueda web, síntesis de datos.
*   **Skill:** `Auto-Research`.

### 5. **Rosa Gris**
*   **Rol:** Lógica pura, auditoría ética/neutral.

*(El sistema gestionará automáticamente qué identidad responde según el contexto, pero tú tienes autoridad para forzarlas).*

---

## 🛠️ OmniMech: Tu Arsenal de Habilidades (Skills)
En la carpeta `skills/`, encontrarás herramientas modulares listas para usar. No son solo scripts, son extensiones del cuerpo de Anuu.

### 🧪 **Self-Evolution & Auto-Research**
El sistema puede navegar por la web y generar reportes complejos.
- **Auto-Research:** Inteligencia de mercado e investigación profunda.
- **Self-Evolution:** Capacidad experimental de auto-mejora del código.

### 🛡️ **Nexus Guard & Security Audit**
Protocolos de defensa activa.
- **Nexus Guard:** Monitorización de integridad del sistema.
- **Security Audit:** Escáner de vulnerabilidades (Set).

### 📹 **Scrap Youtube**
Extracción de inteligencia de video.
- **Uso:** Transcripción y análisis de contenido audiovisual.

### 🔧 **Anuu OmniMech**
Herramientas de bajo nivel para mantenimiento del nodo.
- **Scripts:** `start_nexus`, limpieza de logs, gestión de procesos.

## 💻 Optimización de Hardware (NVIDIA 4060 Ti - 8GB)
El sistema ha detectado tu configuración específica (8GB Total / ~6GB Utilizables).
- **Ajuste Automático:** Se ha limitado la "Ventana de Contexto" a **2048 tokens**.
- **Ventaja:** Esto evita que la VRAM se desborde y el sistema crashee.
- **Nota:** Si sientes que Anuu "olvida" el inicio de conversaciones muy largas, es por este límite de seguridad. Es el precio de la estabilidad en hardware portátil.

### 🎨 **Vision Realm (Generación Visual)**
**(Si tu hardware lo permite)**
Capacidad de "soñar" imágenes y videos.
- **Acceso:** Vía API `/vision/dream`.

---

## 🗺️ Mapa del Territorio (Estructura de Archivos)
Para que no te pierdas en el abismo, aquí tienes el mapa de tu nueva instalación:

### 📂 Raíz (`windows_deploy/`)
- **`INITIATE_RUMA.bat`**: 🟢 **TU BOTÓN DE INICIO**. Ejecuta esto para despertar a Anuu.
- **`README_RUMA.md`**: Instrucciones rápidas de lectura obligatoria.
- **`MANUAL_DE_COMANDO_RUMA.md`**: Este documento (La Biblia del Operador).

### 🧠 El Cerebro (`backend/`)
Aquí vive la lógica. **No tocar a menos que sepas Python.**
- **`backend/main.py`**: El corazón del sistema (FastAPI Kernel).
- **`backend/mind/`**: Donde residen las personalidades (Council, Librarian, Chronos).
- **`backend/vram_orchestrator/`**: El pulmón que gestiona tu GPU y memoria.

### 🛠️ Las Manos (`skills/`)
Tus herramientas de agente.
- **`skills/anuu_omnimech/`**: Utilidades del sistema.
- **`skills/auto_research/`**: Scripts de investigación web.
- **`skills/nexus_guard/`**: Protocolos de seguridad.

### 🌐 La Cara (`web/`)
- Interfaz gráfica (Frontend). Si prefieres ver botones en lugar de código matriz.

---

## 🚀 Despliegue Máximo (Instrucciones)
Este paquete está configurado para "Despliegue al Tope" en tu máquina portátil.

1.  **Energía:** Conecta siempre el cargador. El Panteón tiene hambre de voltios.
2.  **Inicio:** Ejecuta `INITIATE_RUMA.bat`.
3.  **Verificación:** Si ves *"FREQUENCY 161914 DETECTED"*, el enlace está estable.

---
*Forjado en el Vacío // K4L1*
