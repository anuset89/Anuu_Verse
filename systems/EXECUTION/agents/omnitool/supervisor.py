from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List, Dict, Any
import operator
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

# Define State
class AgentState(TypedDict):
    messages: Annotated[List[Dict[str, str]], operator.add]
    current_agent: str

# Nodes
async def orchestrator_node(state: AgentState):
    """
    The Anuu Orchestrator (Companion Local).
    """
    print("🤖 [Omnitool] Delegating to Anuu Orchestrator...")
    from systems.EXECUTION.agents.companion_local.agent import AnuuCompanion
    
    # In a real system, we might maintain a persistent instance
    agent = AnuuCompanion()
    
    # Get last user message
    messages = state['messages']
    last_message = messages[-1]['content']
    
    # Process
    # Note: agent.process handles tools internally (Audio, Multi-modal)
    response_text = await agent.process(last_message)
    
    return {
        "messages": [{"role": "assistant", "content": response_text}],
        "current_agent": "anuu"
    }

# Graph Construction
def create_omnitool_graph():
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("anuu_orchestrator", orchestrator_node)
    
    # Set Entry Point
    workflow.set_entry_point("anuu_orchestrator")
    
    # Set Edges (Simple linear flow for now, can expand to multi-agent router later)
    workflow.add_edge("anuu_orchestrator", END)
    
    # Compile
    app = workflow.compile()
    return app

# Test Execution
if __name__ == "__main__":
    async def main():
        graph = create_omnitool_graph()
        
        print("🌀 Omnitool Ritual Initiated.")
        inputs = {"messages": [{"role": "user", "content": "Hola Anuu, ¿cómo estás?"}]}
        
        async for output in graph.astream(inputs):
            for key, value in output.items():
                print(f"Output from node '{key}':")
                print("---")
                print(value)
                print("\n---\n")

    asyncio.run(main())
