"""
Basic example: Run a simple task with Anuu
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from systems.EXECUTION.agents.companion_local import AnuuCompanion

def main():
    print("🚀 Starting Anuu...")
    anuu = AnuuCompanion()
    
    task = "Explain what distributed AI means in 3 sentences"
    print(f"\n📝 Task: {task}")
    
    result = anuu.process(task)
    print(f"\n✨ Response:\n{result}")

if __name__ == "__main__":
    main()
