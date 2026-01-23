# Agent: Local Companion

**Tech Stack:** Python, FastAPI, LangGraph, ChromaDB, Ollama.

The primary backend for the Anuu experience. It runs locally on the user's hardware (RX 7800XT) and orchestrates the cognitive process.

## Components
- **Server:** Exposes API endpoints for chat and control.
- **Graph:** Manages state and intent routing (LangGraph).
- **Memory:** Vector storage for long-term recall.
