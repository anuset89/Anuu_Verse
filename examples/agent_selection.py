"""
Example: Use specific agents for specific tasks
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from systems.EXECUTION.agents.companion_local import AnuuCompanion

def main():
    anuu = AnuuCompanion()
    
    # Kali for security
    print("🔒 Using KALI (Security Agent):")
    response = anuu.process(
        "What are the top 3 security considerations for local AI?",
        archetype="kali"
    )
    print(response)
    
    print("\n" + "="*50 + "\n")
    
    # Kilonova for creativity
    print("🎨 Using KILONOVA (Creative Agent):")
    response = anuu.process(
        "Generate 3 innovative uses for local AI",
        archetype="kilonova"
    )
    print(response)

if __name__ == "__main__":
    main()
