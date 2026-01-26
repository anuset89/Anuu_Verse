import sys
import os
import json

# Set working directory to project root
ROOT_DIR = "/home/kali/Anuu_Verse"
os.chdir(ROOT_DIR)

# Add ROOT_DIR to sys.path
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

# Import using absolute package path
from systems.EXECUTION.agents.companion_local.agent import AnuuCompanion

import asyncio

def test_self_improvement():
    print("--- FIRST INTERACTION ---")
    companion = AnuuCompanion()
    
    async def run_interactions():
        msg = "Explain the importance of identity in the Anuu_Verse."
        
        # Process interaction
        response = await companion.process(msg, archetype="anuu")
        print(f"User: {msg}")
        print(f"Response: {response}")
        
        # Check if log was created
        log_path = os.path.join(ROOT_DIR, "logs/introspection.jsonl")
        if os.path.exists(log_path):
            print("\n[SUCCESS] Introspection log detected.")
            with open(log_path, "r") as f:
                last_line = f.readlines()[-1]
                data = json.loads(last_line)
                print(f"Log content (last interaction): {json.dumps(data, indent=2)}")
        else:
            print("\n[FAILURE] Introspection log not found.")

        print("\n--- SECOND INTERACTION (Contextual Check) ---")
        # This should now include the insight from the first interaction in the context
        response2 = await companion.process("Tell me more about the Nexo.", archetype="anuu")
        print(f"Response with potential self-correction: {response2}")

    asyncio.run(run_interactions())

if __name__ == "__main__":
    test_self_improvement()
