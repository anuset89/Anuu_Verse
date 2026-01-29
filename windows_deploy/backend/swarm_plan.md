# Anuu Titan Swarm: Massive Parallelism Plan

## Objective
Scale Anuu's cognition to 40+ parallel sessions. This "Swarm" will be used for exhaustive research, code auditing, and multi-perspective simulations.

## Technical Constraints
- **Hardware**: 32GB RAM / 16GB VRAM / 16 Cores.
- **Optimization Strategy**: Use tiny models (`smollm2:1.7b`, `llama3.2:1b`, `phi3:latest`) and Ollama's `num_parallel` capability.

## Architecture: The Neural Chamber
1.  **Model Selection**: Deploy `smollm2:1.7b` or `phi3:latest` as the "Swarm Worker".
2.  **Parallel Execution**: Use `asyncio.gather` with a semaphore to limit concurrency to 40.
3.  **Specialization**: Divide the 40 sessions into specialized tasks:
    - 10 sessions for **Security/Vulnerability Research**.
    - 10 sessions for **Logic/Architecture Auditing**.
    - 10 sessions for **Creative/Poetic Expansion**.
    - 10 sessions for **Information Synthesis (K4L1)**.

## Implementation Steps
1.  Configure Ollama for parallel requests (OLLAMA_NUM_PARALLEL).
2.  Update `council.py` with `SwarmBridge`.
3.  Create an endpoint `/chat/swarm` to trigger massive parallel thinking.
