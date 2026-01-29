import asyncio
import sys
import os

# Add project root
sys.path.append(os.getcwd())

from systems.EXECUTION.agents.omnitool.supervisor import create_ace_graph

async def test_search():
    print("🔮 [TEST] Testing Search Agent Integration...")
    
    graph = create_ace_graph()
    
    # Query that triggers 'search' intent
    query = "Search for local AI models released in 2025"
    print(f"📨 User: {query}")
    
    inputs = {
        "messages": [{"role": "user", "content": query}],
        "selected_agents": [],
        "agent_outputs": {},
        "final_response": ""
    }
    
    try:
        result = await graph.ainvoke(inputs)
        response = result.get('final_response', '')
        
        print("\n🤖 Final Response:")
        print(response)
        
        if "[SEARCH RESULTS]" in response or "2025" in response:
            print("\n✅ [SUCCESS] Search Agent triggered and results included.")
        else:
            print("\n⚠️ [WARNING] Search intent might not have triggered or no results.")
            
    except Exception as e:
        print(f"\n❌ [FAILURE] Graph execution failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_search())
