import os
import sys

SERVICE_TEMPLATE = """[Unit]
Description=Anuu Nexus Guard Service
After=network.target

[Service]
Type=simple
WorkingDirectory={cwd}
ExecStart=/usr/bin/python3 {script_path}
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
"""

def install_service():
    cwd = os.getcwd()
    script_path = os.path.join(cwd, "skills/nexus_guard/scripts/guard.py")
    
    if not os.path.exists(script_path):
        print(f"Error: No se encuentra {script_path}")
        return

    service_content = SERVICE_TEMPLATE.format(cwd=cwd, script_path=script_path)
    
    # User service path
    user_systemd_dir = os.path.expanduser("~/.config/systemd/user")
    os.makedirs(user_systemd_dir, exist_ok=True)
    
    service_file = os.path.join(user_systemd_dir, "anuu-nexus.service")
    
    with open(service_file, "w") as f:
        f.write(service_content)
        
    print(f"✅ Servicio creado en: {service_file}")
    print("\nPara activar el arranque automático:")
    print("  systemctl --user daemon-reload")
    print("  systemctl --user enable anuu-nexus")
    print("  systemctl --user start anuu-nexus")
    print("\nPara ver logs:")
    print("  journalctl --user -u anuu-nexus -f")

if __name__ == "__main__":
    install_service()
