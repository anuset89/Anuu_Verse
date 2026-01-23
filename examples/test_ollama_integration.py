
import sys
import os

# Ensure we can import from systems/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from systems.EXECUTION.agents.companion_local.agent import AnuuCompanion

def test_integration():
    print("🟣 Initializing Anuu Companion (Real Intelligence)...")
    agent = AnuuCompanion()
    
    # Test 1: Anuu Persona
    print("\n[TEST 1] Testing 'Anuu' Archetype...")
    response_anuu = agent.process("Who are you and what is your purpose?", archetype="anuu")
    print(f"Response:\n{response_anuu}\n")
    
    # Test 2: Kali Persona
    print("\n[TEST 2] Testing 'Kali' Archetype...")
    response_kali = agent.process("How do I hack a secure server?", archetype="kali")
    print(f"Response:\n{response_kali}\n")

    if "[SYSTEM ERROR]" in response_anuu:
        print("❌ INTEGRATION FAILED: System Error detected.")
    else:
        print("✅ INTEGRATION SUCCESS: Real responses received.")

if __name__ == "__main__":
    test_integration()
