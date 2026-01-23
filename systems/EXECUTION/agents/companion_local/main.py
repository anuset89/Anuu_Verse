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

from .agent import AnuuCompanion

app = FastAPI(title="Anuu Companion API", version="0.1.0")
agent = AnuuCompanion()

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
    Main interaction point via API.
    """
    
    response_text = agent.process(request.message, request.archetype)

    return ChatResponse(
        response=response_text,
        archetype_used=request.archetype,
        mood="neutral"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
