# Anuu Hivemind: Parallel Orchestration Plan

## Objective
Evolve the Anuu Council from a serial "Hot-Swap" architecture to a "Parallel Hivemind" architecture. Instead of switching models, Anuu will fire multiple requests to specialized local models concurrently.

## Infrastructure Changes
1.  **VRAM Partitioning**: Utilize the 16GB of the 7800 XT to keep multiple smaller models (3B to 8B) in memory.
2.  **Council Concurrency**: Use `asyncio.gather` in `council.py` to prompt different models for specific "fragments" of a response.
    - **Identity Fragment**: (Model: Anuu-Hermes) - Generates the poetic tone.
    - **Technical Fragment**: (Model: Qwen2.5-Coder) - Analyzes code/tools.
    - **Reasoning Fragment**: (Model: Llama3.2/Mistral) - Checks logic and safety.

## Synthesis Logic
The **K4L1 Nexus** will act as the final aggregator, not just for web searches, but for internal model "opinions", merging them into a single coherent response.

## Roadmap
1. Update `council.py` to support multiple model endpoints.
2. Implement `HivemindBridge` using `asyncio`.
3. Test parallel inference latency on the hardware.
