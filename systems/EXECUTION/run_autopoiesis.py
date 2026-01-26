#!/usr/bin/env python3
"""
Autopoiesis Runner (161914)
Executes the continuous improvement loop for Anuu.
"""
import sys
import os
import time
from typing import Optional

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from systems.EXECUTION.agents.autopoiesis_agent import get_autopoiesis_agent

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main_loop(interval_seconds: int = 300):
    """
    Runs the Autopoiesis loop.
    """
    agent = get_autopoiesis_agent()
    print("🌀 Autopoiesis Loop Initiated (161914)")
    print(f"   Monitoring system health every {interval_seconds} seconds...\n")
    
    try:
        while True:
            # 1. Generate Report
            report = agent.generate_report()
            
            # 2. Display Status
            clear_screen()
            print(report)
            
            # 3. Suggest Action
            suggestion = agent.suggest_next_action()
            print(f"\n🔮 Oracle Protocol:\n   {suggestion}\n")
            
            # 4. Wait
            print(f"   Sleeping for {interval_seconds}s... (Ctrl+C to stop)")
            time.sleep(interval_seconds)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Autopoiesis Loop Halted.")
        sys.exit(0)

if __name__ == "__main__":
    # Default to 10s for demo purposes if argument provided, else 300s
    interval = 10 if len(sys.argv) > 1 and sys.argv[1] == "--demo" else 300
    main_loop(interval)
