import subprocess
import json
import os

def detect_gpu():
    """Detects AMD GPU and returns detailed info."""
    try:
        # Check for rocminfo
        res = subprocess.run(["rocminfo"], capture_output=True, text=True)
        if res.returncode == 0:
            output = res.stdout
            if "gfx1100" in output or "AMD" in output:
                # Basic parsing to find the name
                for line in output.split("\n"):
                    if "Marketing Name:" in line:
                        return {"type": "AMD", "model": line.split(":")[1].strip(), "supported": True}
                return {"type": "AMD", "model": "Unknown AMD GPU", "supported": True}
        
        # Check for clinfo as fallback
        res = subprocess.run(["clinfo"], capture_output=True, text=True)
        if res.returncode == 0:
            if "AMD" in res.stdout:
                return {"type": "AMD", "model": "Generic AMD (clinfo)", "supported": True}
                
    except Exception:
        pass
    
    return {"type": "Unknown", "model": "None/CPU", "supported": False}

if __name__ == "__main__":
    gpu_info = detect_gpu()
    # Write to a file that Pinokio can read or just output JSON
    print(json.dumps(gpu_info))
    
    # Also create a small marker for the shell script
    if gpu_info["supported"]:
        with open(".gpu_type", "w") as f:
            f.write("AMD")
    else:
        with open(".gpu_type", "w") as f:
            f.write("CPU")
