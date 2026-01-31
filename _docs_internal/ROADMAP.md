# 🗺️ The Roadmap (Evolution Strategy)

**Phase:** Architecture & Foundation  
**Next Horizon:** Monetization & Presence

---

## 🏁 Phase 0: Zero Friction (Immediate)
*Objective: Remove barriers. Make Anuu usable by mere mortals.*

Based on the [Technical Audit 2026](reviews/TECHNICAL_POTENTIAL_AUDIT.md), we must prioritize accessibility.
- [ ] **Dockerization:** `docker-compose up` to launch Mem + API + Web.
- [ ] **Lite Mode:** Config presets for 8B models (low VRAM requirement).
- [ ] **Visual Proof:** Add screenshots and diagrams to README.

## 🏗️ Phase 1: The Local Companion (Foundation)
*Objective: Build the brain that lives in the 7800XT.*

We are building a robust, offline-first companion capable of deep memory and archetypal switching.

- **Core (`systems/FOUNDATION/anuu_core`):**
    - [ ] Unified JSON Schema for Anuu's memories.
    - [ ] Python parsers and validators.
- **Backend (`systems/EXECUTION/agents/companion_local`):**
    - [ ] FastAPI Server exposing `/chat` and `/memory`.
    - [ ] LangGraph orchestration for the Multi-Persona System.
    - [ ] VectorDB Integration (Chroma/Qdrant) for long-term recall.
- **Frontend:**
    - [ ] Minimal React Chat Interface (done in `web/`, needs hookup).

## 🎭 Phase 2: The Avatar (VTuber Integration)
*Objective: Give the ghost a face.*

Leveraging the RX 7800XT to drive a real-time Live2D or 3D avatar that reacts to the brain's output.

- **Pipeline (`systems/EXECUTION/agents/vtuber_local`):**
    - [ ] Bridge script: Chat Output → TTS → Audio → Lipsync.
    - [ ] Integration with Open-LLM-VTuber (ROCm optimized).
    - [ ] OBS / NDI injection for streaming.

## 💎 Phase 3: The Offer (API & SaaS)
*Objective: Share the frequency.*

Exposing Anuu's cognitive architecture as a service for others.

- **Cloud Bridge (`systems/EXECUTION/agents/api_cloud`):**
    - [ ] Secure Tunneling (Cloudflare) for local-to-public access.
    - [ ] Multi-tenant support (serving multiple users).
    - [ ] Webhook integration for Discord/Telegram bots.
- **SDK:**
    - [ ] `anuu-client` Python library for easy integration.

---

## 📂 Strategic Directory Structure

We are aligning the repository to support this growth:

```text
Anuu_Verse/
├── systems/
│   ├── FOUNDATION/anuu_core/      # JSON schemas & memory logic
│   ├── EXECUTION/agents/          # The active entities
│   │   ├── companion_local/       # FastAPI + LangGraph
│   │   ├── vtuber_local/          # TTS + Avatar Bridge
│   │   └── api_cloud/             # Deployable endpoints
│   └── ...
├── web/                           # React Frontends (Chat + Wiki)
└── docs/                          # The Grimoire (You are here)
```
