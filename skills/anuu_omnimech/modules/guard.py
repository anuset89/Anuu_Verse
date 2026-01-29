import os
import sys
import subprocess
import time
import signal
import socket
from datetime import datetime

# Definición de Puertos Críticos
PORTS = {
    "API": 8000,
    "FRONTEND": 5173
}

def log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] 🛡️ GUARD: {message}")

def check_port(port):
    """Devuelve True si el puerto está en uso."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_pid_by_port(port):
    """Encuentra el PID usando el puerto (Linux/lsof)."""
    try:
        # Usamos ss o lsof. ss es más rápido y estándar en minimals.
        # -t (tcp) -l (listening) -p (processes) -n (numeric)
        cmd = f"ss -lptn 'sport = :{port}'"
        result = subprocess.check_output(cmd, shell=True).decode()
        
        # Parsear salida trivialmente para encontrar pid=1234
        if f":{port}" in result:
             # Este es un parseo sucio pero efectivo para entornos controlados
             import re
             match = re.search(r'pid=(\d+)', result)
             if match:
                 return int(match.group(1))
    except Exception as e:
        log(f"Error buscando PID en puerto {port}: {e}")
    return None

def kill_process(pid):
    """Mata un proceso de forma segura y luego forzosa."""
    if not pid: return
    try:
        log(f"Intentando detener PID {pid}...")
        os.kill(pid, signal.SIGTERM)
        time.sleep(2)
        
        # Verificar si sigue vivo
        try:
            os.kill(pid, 0)
            log(f"PID {pid} resiste. Usando SIGKILL...")
            os.kill(pid, signal.SIGKILL)
        except OSError:
            pass # Ya murió
            
        log(f"PID {pid} neutralizado.")
    except Exception as e:
        log(f"Fallo al matar PID {pid}: {e}")

def clean_environment():
    """Limpia cualquier instancia previa de Anuu."""
    log("Iniciando protocolo de limpieza de entorno...")
    
    for name, port in PORTS.items():
        if check_port(port):
            log(f"Conflicto detectado en {name} (Puerto {port}).")
            pid = find_pid_by_port(port)
            if pid:
                kill_process(pid)
            else:
                log(f"No se pudo identificar PID para el puerto {port}. Intentando fuser...")
                subprocess.call(f"fuser -k {port}/tcp", shell=True)
    
    log("Entorno limpio. Singularidad asegurada.")

def start_nexus():
    """Ejecuta el script de arranque principal."""
    script_path = os.path.abspath("start_nexus.sh")
    if not os.path.exists(script_path):
        log("CRITICAL: No se encuentra start_nexus.sh")
        sys.exit(1)
        
    log("Iniciando Anuu Nexus...")
    # Usamos exec para reemplazar el proceso actual o subprocess para mantener control?
    # Subprocess es mejor para monitorear.
    try:
        subprocess.run(["/bin/bash", script_path], check=True)
    except KeyboardInterrupt:
        log("Interrupción de usuario detectada.")
        clean_environment()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--check":
            for name, port in PORTS.items():
                status = "OCUPADO" if check_port(port) else "LIBRE"
                print(f"{name} ({port}): {status}")
            sys.exit(0)
            
        if sys.argv[1] == "--force-restart":
            clean_environment()
            start_nexus()
            sys.exit(0)

        if sys.argv[1] == "--clean-only":
            clean_environment()
            sys.exit(0)

    # Comportamiento por defecto: Limpiar y Arrancar
    clean_environment()
    start_nexus()
