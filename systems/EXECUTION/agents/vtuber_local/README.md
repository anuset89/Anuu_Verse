# Agent: Local VTuber Bridge

**Tech Stack:** Python, OBS WebSocket, TTS (Coqui/Edge), Live2D/3D.

This module bridges the gap between text (from Companion) and performance (Video/Audio).

## Pipeline
1. Receive text from Companion API.
2. Generate Audio (TTS) with emotional inflection.
3. Sync Lip-flap via Visemes.
4. Drive Avatar movement based on emotional tags.
5. Output to OBS.
