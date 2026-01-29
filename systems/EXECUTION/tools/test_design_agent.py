
import asyncio
import os
import sys

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from systems.EXECUTION.agents.omnitool.supervisor import create_ace_graph

async def test_design_agent():
    print("🎨 Testing Design Agent Integration...")
    graph = create_ace_graph()
    
    # Test Query
    query = "Design a futuristic dashboard for Anuu Kilonova system"
    print(f"\n📨 Input: {query}")
    
    inputs = {
        "messages": [{"role": "user", "content": query}],
        "selected_agents": [],
        "agent_outputs": {},
        "final_response": ""
    }
    
    # Run Graph
    result = await graph.ainvoke(inputs)
    
    # Check Router Selection
    selected = result.get("selected_agents", [])
    print(f"🔀 Router Selected: {selected}")
    
    if "design" in selected:
        print("✅ PASS: Router selected 'design' agent.")
    else:
        print("❌ FAIL: Router did NOT select 'design' agent.")
        
    # Check Output
    final_response = result.get("final_response", "")
    if "**[THE ARCHITECT - DESIGN SYSTEM]**" in final_response or "Design System" in final_response:
        print("✅ PASS: Design System generated in output.")
        print(f"\nSample Output:\n{final_response[:300]}...")
    else:
        print("❌ FAIL: Design System missing from output.")
        print(f"Full Output: {final_response}")

if __name__ == "__main__":
    asyncio.run(test_design_agent())
