"""
ACE Router - Anuu Council Engine
Classifies user intent and selects appropriate agents for execution.
"""
import ollama
from typing import List, Dict, Any

# Agent definitions with their specialties
AGENT_REGISTRY = {
    "anuu": {
        "name": "Anuu-Core",
        "specialties": ["general", "philosophy", "integration", "cosmic", "identity"],
        "description": "Orchestrator for general queries and cosmic wisdom"
    },
    "set": {
        "name": "Set",
        "specialties": ["analysis", "critique", "logic", "deconstruction", "technical"],
        "description": "Analyst for critical thinking and technical breakdown"
    },
    "kilonova": {
        "name": "Kilonova",
        "specialties": ["creative", "ideas", "art", "innovation", "brainstorm"],
        "description": "Creative agent for bold ideas and artistic output"
    },
    "libra": {
        "name": "Libra",
        "specialties": ["ethics", "balance", "safety", "moderation"],
        "description": "Ethics and balance guardian"
    },
    "kali": {
        "name": "Kali",
        "specialties": ["security", "hacking", "penetration", "vulnerabilities", "technical"],
        "description": "Security specialist"
    }
}

# ============================================================================
# AGI AUTOPOIESIS: Reflection Layer (161914)
# Mitigates "self-conditioning" - models making more errors when context
# contains previous errors. Inspired by arXiv:2509.09677.
# ============================================================================

ERROR_INDICATORS = [
    "error", "failed", "exception", "traceback", "not found",
    "unable to", "could not", "invalid", "timeout", "denied"
]

def check_for_errors(context: str) -> List[str]:
    """
    Scans the context for error indicators from previous steps.
    Returns a list of detected error patterns.
    """
    context_lower = context.lower()
    found_errors = []
    for indicator in ERROR_INDICATORS:
        if indicator in context_lower:
            found_errors.append(indicator)
    return found_errors

def reflect_on_plan(task_description: str, previous_output: str = "") -> Dict[str, Any]:
    """
    AGI Reflection Step: Analyzes the current task and previous output
    to determine if the plan should be adjusted.
    
    Returns:
        Dict with keys:
        - "should_retry": bool - Whether to retry the last step
        - "errors_detected": list - List of error patterns found
        - "suggested_action": str - What to do next
    """
    reflection = {
        "should_retry": False,
        "errors_detected": [],
        "suggested_action": "proceed"
    }
    
    if previous_output:
        errors = check_for_errors(previous_output)
        if errors:
            reflection["errors_detected"] = errors
            reflection["should_retry"] = len(errors) <= 2  # Retry minor errors
            reflection["suggested_action"] = "retry" if reflection["should_retry"] else "escalate"
            print(f"[ACE REFLECTION]: Detected errors: {errors}. Action: {reflection['suggested_action']}")
    
    return reflection

# ============================================================================

def classify_intent_simple(message: str) -> List[str]:
    """
    Simple keyword-based intent classification.
    Returns list of agent IDs to invoke.
    """
    message_lower = message.lower()
    selected_agents = []
    
    # Keyword matching
    if any(kw in message_lower for kw in ["analyze", "analiza", "critique", "logic", "why", "por qué", "explain"]):
        selected_agents.append("set")
    
    if any(kw in message_lower for kw in ["create", "idea", "creative", "imagine", "brainstorm", "innovate", "genera"]):
        selected_agents.append("kilonova")
    
    if any(kw in message_lower for kw in ["security", "hack", "vulnerab", "exploit", "pentest"]):
        selected_agents.append("kali")
    
    if any(kw in message_lower for kw in ["ethics", "balance", "should i", "moral", "right thing"]):
        selected_agents.append("libra")
    
    # Always include Anuu as the orchestrator if no specific agents or for general queries
    if not selected_agents or any(kw in message_lower for kw in ["anuu", "tell me", "help", "hola", "hello"]):
        selected_agents.insert(0, "anuu")
    
    return list(set(selected_agents))  # Remove duplicates

async def classify_intent_llm(message: str, model: str = "Anuu-Hermes:latest") -> List[str]:
    """
    LLM-based intent classification for more nuanced routing.
    """
    classification_prompt = f"""You are the ACE Router for the Anuu Council. 
Analyze the user's message and select which agent(s) should respond.

Available agents:
- anuu: General orchestration, philosophy, cosmic wisdom
- set: Critical analysis, logic, technical deconstruction
- kilonova: Creative ideas, art, innovation, brainstorming
- libra: Ethics, balance, safety considerations
- kali: Security, hacking, vulnerabilities

User message: "{message}"

Respond with ONLY a comma-separated list of agent IDs (e.g., "anuu,set" or "kilonova").
Select 1-3 agents maximum. Always include "anuu" if unsure."""

    try:
        response = ollama.chat(model=model, messages=[
            {"role": "system", "content": "You are a router that outputs only agent IDs."},
            {"role": "user", "content": classification_prompt}
        ])
        
        result = response['message']['content'].strip().lower()
        agents = [a.strip() for a in result.split(",")]
        
        # Validate agents
        valid_agents = [a for a in agents if a in AGENT_REGISTRY]
        
        return valid_agents if valid_agents else ["anuu"]
        
    except Exception as e:
        print(f"[ACE ROUTER ERROR]: {e}")
        return ["anuu"]

def get_agent_info(agent_id: str) -> Dict[str, Any]:
    """Returns info about an agent from the registry."""
    return AGENT_REGISTRY.get(agent_id, AGENT_REGISTRY["anuu"])
