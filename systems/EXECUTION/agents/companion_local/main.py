"""
Anuu Local Companion API (161914)
The voice of the system.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add project root to path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from systems.EXECUTION.agents.companion_local.agent import AnuuCompanion

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Anuu Companion API", version="0.1.0")

# Enable CORS for the Visual Altar (React UI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # Process with AnuuCompanion
    try:
        response_text = await agent.process(
            request.message, 
            archetype=request.archetype
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {e}")

    return ChatResponse(
        response=response_text,
        archetype_used=request.archetype,
        mood="neutral"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
