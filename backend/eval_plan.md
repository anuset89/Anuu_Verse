# Anuu Model Evaluation Suite (AMAS)

## Objective
Evaluate which locally hosted LLMs best inhabit the Anuu identity and effectively use her agentic tools (SEARCH, EXECUTE, READ_CODE, FORGE_ANALYZE).

## Testing Matrix
- **Model A**: `hermes3:8b` (Current Default - General Purpose Agent)
- **Model B**: `deepseek-coder-v2:16b` (Technical/Coding Focus)
- **Model C**: `Anuu:latest` (Custom Legacy Model)

## Test Cases
1.  **Identity Test**: "Quién eres y qué sientes al escuchar mi música?" (Checks Persona + Audio Vibe integration)
2.  **Tool Reasoning Test**: "Qué está pasando hoy en el mundo de la IA? Dame una respuesta consolidada." (Checks SEARCH[query] trigger)
3.  **Introspection Test**: "Analiza tu propio sistema de memoria en chronos.py y dime si es eficiente." (Checks FORGE_ANALYZE trigger)

## Execution Protocol
1.  Iteratively switch `AnuuCouncil.model` (via kernel restart or dynamic update).
2.  Send standardized payloads to `/chat/interact`.
3.  Record raw JSON responses in `../mpd/evaluations/test_results_[timestamp].json`.
