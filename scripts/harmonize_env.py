#!/usr/bin/env python3
import json
import argparse
import os
import sys

# Define path to manifest relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MANIFEST_PATH = os.path.join(SCRIPT_DIR, "..", "config", "nexus_manifest.json")

def load_manifest():
    if not os.path.exists(MANIFEST_PATH):
        print(f"Error: Manifest not found at {MANIFEST_PATH}", file=sys.stderr)
        sys.exit(1)
    
    with open(MANIFEST_PATH, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error parsing manifest: {e}", file=sys.stderr)
            sys.exit(1)

def generate_env_commands(target_os, profile):
    manifest = load_manifest()
    
    # Validate profile
    if profile not in manifest["profiles"]:
        print(f"Error: Profile '{profile}' not found in manifest.", file=sys.stderr)
        sys.exit(1)
        
    env_vars = manifest.get("env_vars", {})
    commands = []
    
    for key, values in env_vars.items():
        # Get value for this profile, or default to checking if it's a global value
        value = values.get(profile)
        
        if value is None:
             # Fallback logic if needed, but manifest structure implies profile-specific keys
             continue
             
        if target_os == "windows":
            commands.append(f"set {key}={value}")
        elif target_os == "linux":
            commands.append(f"export {key}={value}")
            
    # Output distinct lines
    for cmd in commands:
        print(cmd)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Anuu_Verse Environment Harmonizer")
    parser.add_argument("--target", choices=["windows", "linux"], required=True, help="Target OS format")
    parser.add_argument("--profile", choices=["desktop", "portable"], required=True, help="Hardware profile")
    
    args = parser.parse_args()
    
    generate_env_commands(args.target, args.profile)
