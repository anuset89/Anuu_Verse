---
name: Single Instance Nexus Guard
description: Ensures only one instance of Anuu Verse runs at a time and manages system startup.
---

# 🛡️ Nexus Guard (Single Instance Manager)

Este skill es un demonio de gestión de procesos diseñado para garantizar la **Singularidad del Nexo**. Previene conflictos de puertos (8000, 5173), gestiona procesos huérfanos y asegura un arranque limpio en el inicio del sistema.

## ⚡ Capacidades

1.  **Detección de Puerto:** Escanea puertos 8000 (API) y 5173 (Frontend).
2.  **Exorcismo de Procesos:** Elimina procesos zombis de Python/Node que ocupan estos puertos.
3.  **Arranque Seguro:** Inicia `start_nexus.sh` solo si el entorno está limpio.
4.  **Integración Systemd:** Genera un servicio de usuario para arranque automático al iniciar sesión.

## 🛠️ Uso Manual

```bash
# Verificar estado y limpiar si es necesario
python3 skills/nexus_guard/scripts/guard.py --check

# Forzar reinicio limpio
python3 skills/nexus_guard/scripts/guard.py --force-restart
```

## 🤖 Instalación como Servicio (Systemd)

```bash
# Instalar servicio de usuario
python3 skills/nexus_guard/scripts/install_service.py
```
