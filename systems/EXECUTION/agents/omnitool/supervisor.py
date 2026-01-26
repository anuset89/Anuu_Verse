"""
Omnitool Supervisor - ACE (Anuu Council Engine)
Multi-agent orchestration using LangGraph.
"""
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List, Dict, Any, Literal
import operator
import asyncio
import sys
import os

# Add project root to path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Import router and scroll loader (absolute imports for standalone execution)
from systems.EXECUTION.agents.omnitool.ace_router import classify_intent_simple, get_agent_info
from systems.FOUNDATION.anuu_core.scroll_loader import get_system_prompt, load_scroll
import ollama

# ============================================
# STATE DEFINITION
# ============================================
class AgentState(TypedDict):
    messages: Annotated[List[Dict[str, str]], operator.add]
    selected_agents: List[str]
    agent_outputs: Dict[str, str]
    final_response: str

# ============================================
# NODE FUNCTIONS
# ============================================
async def router_node(state: AgentState) -> Dict[str, Any]:
    """
    Router: Analyzes user message and selects appropriate agents.
    """
    print("🔀 [ACE] Router analyzing intent...")
    
    messages = state.get('messages', [])
    if not messages:
        return {"selected_agents": ["anuu"]}
    
    last_message = messages[-1].get('content', '')
    
    # Use simple classification (faster), can swap to LLM-based
    selected = classify_intent_simple(last_message)
    print(f"🔀 [ACE] Selected agents: {selected}")
    
    return {"selected_agents": selected}

async def agent_node(state: AgentState, agent_id: str) -> Dict[str, Any]:
    """
    Generic agent execution node.
    """
    print(f"🧠 [ACE] Executing agent: {agent_id}")
    
    messages = state.get('messages', [])
    last_message = messages[-1].get('content', '') if messages else ""
    
    # Get scroll for this agent
    system_prompt = get_system_prompt(agent_id)
    
    try:
        response = ollama.chat(
            model='Anuu-Hermes:latest',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': last_message}
            ]
        )
        output = response['message']['content']
    except Exception as e:
        output = f"[{agent_id.upper()} ERROR]: {e}"
    
    # Update agent_outputs
    current_outputs = state.get('agent_outputs', {})
    current_outputs[agent_id] = output
    
    return {"agent_outputs": current_outputs}

# Create specific node functions for each agent
async def anuu_node(state: AgentState) -> Dict[str, Any]:
    return await agent_node(state, "anuu")

async def set_node(state: AgentState) -> Dict[str, Any]:
    return await agent_node(state, "set")

async def kilonova_node(state: AgentState) -> Dict[str, Any]:
    return await agent_node(state, "kilonova")

async def libra_node(state: AgentState) -> Dict[str, Any]:
    return await agent_node(state, "libra")

async def kali_node(state: AgentState) -> Dict[str, Any]:
    return await agent_node(state, "kali")

async def synthesizer_node(state: AgentState) -> Dict[str, Any]:
    """
    Synthesizer: Merges outputs from multiple agents into coherent response.
    """
    print("🌀 [ACE] Synthesizer merging outputs...")
    
    agent_outputs = state.get('agent_outputs', {})
    
    if len(agent_outputs) == 1:
        # Single agent, no synthesis needed
        final = list(agent_outputs.values())[0]
    else:
        # Multiple agents - create synthesis prompt
        synthesis_parts = []
        for agent_id, output in agent_outputs.items():
            agent_info = get_agent_info(agent_id)
            synthesis_parts.append(f"**{agent_info['name']}**: {output[:500]}...")
        
        synthesis_prompt = f"""You are the Anuu Synthesizer. Merge these agent perspectives into one coherent response:

{chr(10).join(synthesis_parts)}

Create a unified response that incorporates the best insights from each agent. Be concise."""
        
        try:
            response = ollama.chat(
                model='Anuu-Hermes:latest',
                messages=[
                    {'role': 'system', 'content': 'You are a synthesis engine. Merge multiple perspectives into one coherent response.'},
                    {'role': 'user', 'content': synthesis_prompt}
                ]
            )
            final = response['message']['content']
        except Exception as e:
            # Fallback: just concatenate
            final = "\n\n---\n\n".join(agent_outputs.values())
    
    return {
        "final_response": final,
        "messages": [{"role": "assistant", "content": final}]
    }

# ============================================
# CONDITIONAL ROUTING
# ============================================
def route_to_agents(state: AgentState) -> List[str]:
    """
    Determines which agent nodes to execute based on router selection.
    """
    selected = state.get('selected_agents', ['anuu'])
    
    # Map agent IDs to node names
    node_map = {
        "anuu": "anuu_agent",
        "set": "set_agent",
        "kilonova": "kilonova_agent",
        "libra": "libra_agent",
        "kali": "kali_agent"
    }
    
    # Return list of nodes to execute (for Send API)
    return [node_map.get(a, "anuu_agent") for a in selected]

# ============================================
# GRAPH CONSTRUCTION
# ============================================
def create_ace_graph():
    """
    Creates the ACE (Anuu Council Engine) multi-agent graph.
    """
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("router", router_node)
    workflow.add_node("anuu_agent", anuu_node)
    workflow.add_node("set_agent", set_node)
    workflow.add_node("kilonova_agent", kilonova_node)
    workflow.add_node("libra_agent", libra_node)
    workflow.add_node("kali_agent", kali_node)
    workflow.add_node("synthesizer", synthesizer_node)
    
    # Set Entry Point
    workflow.set_entry_point("router")
    
    # Conditional edges from router to agents
    # For simplicity, we'll use a sequential approach where router picks agents,
    # then we execute them. LangGraph's Send API would be ideal for true parallel.
    workflow.add_conditional_edges(
        "router",
        lambda state: state.get('selected_agents', ['anuu'])[0] + "_agent",
        {
            "anuu_agent": "anuu_agent",
            "set_agent": "set_agent",
            "kilonova_agent": "kilonova_agent",
            "libra_agent": "libra_agent",
            "kali_agent": "kali_agent",
        }
    )
    
    # All agents go to synthesizer
    for agent in ["anuu_agent", "set_agent", "kilonova_agent", "libra_agent", "kali_agent"]:
        workflow.add_edge(agent, "synthesizer")
    
    # Synthesizer ends the flow
    workflow.add_edge("synthesizer", END)
    
    # Compile
    app = workflow.compile()
    return app

# Backward compatibility alias
def create_omnitool_graph():
    return create_ace_graph()

# ============================================
# TEST EXECUTION
# ============================================
if __name__ == "__main__":
    async def main():
        graph = create_ace_graph()
        
        print("🌀 ACE (Anuu Council Engine) Initiated.")
        print("=" * 50)
        
        test_messages = [
            "Hola Anuu, ¿cómo estás?",
            "Analyze the concept of identity in philosophy.",
            "Give me creative ideas for a cyberpunk game.",
            "What security vulnerabilities should I check in my webapp?"
        ]
        
        for msg in test_messages[:1]:  # Test first message only for speed
            print(f"\n📨 User: {msg}")
            inputs = {
                "messages": [{"role": "user", "content": msg}],
                "selected_agents": [],
                "agent_outputs": {},
                "final_response": ""
            }
            
            result = await graph.ainvoke(inputs)
            print(f"\n🤖 Response: {result.get('final_response', 'No response')[:500]}...")
            print("=" * 50)

    asyncio.run(main())
