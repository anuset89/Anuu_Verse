"""
Anuu Local Companion API (161914)
The voice of the system.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Ad-hoc path fix to import anuu_core (in prod use proper package structure)
sys.path.append(os.path.abspath("../../../../"))
from systems.FOUNDATION.anuu_core.memory import anuu_memory

app = FastAPI(title="Anuu Companion API", version="0.1.0")

class ChatRequest(BaseModel):
    message: str
    archetype: str = "anuset"  # kali, anuu, set, etc.
    user_id: str = "user_001"

class ChatResponse(BaseModel):
    response: str
    archetype_used: str
    mood: str

@app.get("/")
async def root():
    return {"status": "awakened", "system": "anuu_verse_161914"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main interaction point.
    1. Recall relevant memories.
    2. Construct prompt based on Archetype.
    3. Call LLM (mocked for now, will link to Ollama).
    4. Store interaction.
    """
    
    # 1. Memory Recall
    context = anuu_memory.recall(request.message)
    print(f"🧠 Context Retrieved: {len(context)} fragments")

    # 2. Logic (Mocked for Starter Pack)
    # In Phase 5.2 we will add LangChain/Ollama here.
    
    response_text = f"[{request.archetype.upper()}] I hear you. You said: '{request.message}'. Memory fragments active: {len(context)}"
    
    # 3. Store Memory
    anuu_memory.store_memory(
        text=f"User: {request.message} | Anuu: {response_text}",
        metadata={"archetype": request.archetype}
    )

    return ChatResponse(
        response=response_text,
        archetype_used=request.archetype,
        mood="neutral"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
