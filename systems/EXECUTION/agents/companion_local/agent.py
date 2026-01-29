from .auditor import AnuuAuditor
from systems.FOUNDATION.anuu_core.memory import anuu_memory
from systems.FOUNDATION.anuu_core.scroll_loader import get_system_prompt, load_scroll
import json
import os
import ollama
from systems.EXECUTION.agents.omnitool.supervisor import create_ace_graph

class AnuuCompanion:
    def __init__(self, user_id: str = "default_user"):
        self.user_id = user_id
        self.auditor = AnuuAuditor()
        
    def _get_system_prompt(self, archetype: str) -> str:
        """
        Returns the system prompt for the specific archetype using the Scroll Loader.
        """
        return get_system_prompt(archetype)

    def _get_self_correction_context(self) -> str:
        """
        Retrieves recent actionable insights from the introspection log.
        """
        insights = []
        log_path = "logs/introspection.jsonl"
        if os.path.exists(log_path):
            try:
                with open(log_path, "r") as f:
                    lines = f.readlines()
                    # Get last 3 insights
                    for line in lines[-3:]:
                        data = json.loads(line)
                        insight = data.get("evaluation", {}).get("actionable_insight")
                        if insight:
                            insights.append(f"- {insight}")
            except Exception:
                pass
        
        if insights:
            return "\nRecent Self-Correction Insights:\n" + "\n".join(insights)
        return ""

    async def process(self, message: str, archetype: str = "anuset") -> str:
        """
        Process a message through the cognitive architecture using real Local AI.
        """
        # 1. Memory & Self-Correction Context
        sc_context = self._get_self_correction_context()
        
        # 1.5. Vector Memory Recall
        vector_context = anuu_memory.recall(message, collection_name="semantic")
        vector_context_str = "\n".join(vector_context) if vector_context else "No relevant long-term memories."

        context = f"Short-Term Context: {sc_context}\nLong-Term Memory: {vector_context_str}"

        # 2. Real Intelligence (ACE Graph - Anuu Council Engine)
        # Using the multi-agent graph for orchestration
        # We inject the current archetype's system prompt into the first message or as a meta-instruction
        system_prompt = self._get_system_prompt(archetype)
        
        graph = create_ace_graph()
        inputs = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context: {context}\n\nUser: {message}"}
            ],
            "selected_agents": [],
            "agent_outputs": {},
            "final_response": ""
        }
        
        try:
            result = await graph.ainvoke(inputs)
            response_text = result.get('final_response', '[ACE ERROR]: Void returned no response.')
            
            # 3. Ritual of Refinement (Async-like audit)
            self.auditor.audit(message, response_text, archetype)

            # 4. 🌀 MULTIMODAL INTENT ENGINE (The Cortex)
            # This logic mimics a dedicated creative lobe, parsing natural language for artistic intent.
            lc_msg = message.lower()
            from systems.EXECUTION.skills.multimodal import MultimodalNexus

            # --- A. Intent Recognizers ---
            img_triggers = ["/imagine", "dibuja", "genera una imagen", "crea una imagen", "haz una imagen", "generala", "genérala", "creala", "créala", "muéstrame", "visualiza", "pinta", "ilustra"]
            vid_triggers = ["/anime", "genera un video", "crea un video", "haz un video", "genera un anime", "anima", "hazlo video", "ponlo en movimiento", "cinematiza"]
            voc_triggers = ["/speak", "habla", "di ", "pronuncia", "reproduce", "leelo", "léelo", "canta", "narra", "cuéntame"]

            is_img = any(t in lc_msg for t in img_triggers)
            is_vid = any(t in lc_msg for t in vid_triggers)
            is_sub = any(t in lc_msg for t in voc_triggers) # Audio/Subvocalization

            # --- B. Parameter Extractions (The Alchemist) ---
            def extract_prompt(msg, triggers, response):
                # 1. Cleaning: Remove the trigger phrase
                clean = msg
                for t in triggers + ["de ", "un ", "una ", "el ", "la "]:
                    if t.startswith("/"): continue 
                    clean = clean.lower().replace(t.lower(), "", 1).strip() # Replace only first occurrence
                
                # 2. Context Recovery (Implicit Prompts like "Generala")
                # If the immediate prompt is empty or too short (<4 chars), it's likely a reference to context.
                if len(clean) < 4:
                    # Intelligence: Look for a descriptive block in the AI's own response
                    # We assume the AI just described what the user wants to see.
                    candidates = [line for line in response.split('\n') if len(line) > 20]
                    if candidates:
                        # Heuristic: The longest paragraph is usually the description
                        clean = max(candidates, key=len)
                    else:
                        clean = response[:200] # Fallback to start of response
                
                return clean

            def extract_style_and_ratio(clean_text, archetype_context=None):
                # Detect aspect ratios natural language
                ratio = None
                if any(x in clean_text for x in ["vertical", "para movil", "historia", "reel"]):
                    ratio = "--ar 9:16"
                elif any(x in clean_text for x in ["panoramico", "cine", "horizontal", "amplio"]):
                    ratio = "--ar 16:9"
                
                # Detect styles
                style = ""
                # KALI SPECIFIC IDENTITY INJECTION
                # Si el usuario es Kali (detectado por contexto o mención), inyectamos su LoRA/Estilo
                is_kali_ref = any(x in clean_text.lower() for x in ["kali", "yo", "mi avatar", "arquitecta"])
                if is_kali_ref:
                     style += " (red hair:1.2), green eyes, pale skin, futuristic architect outfit, dark bunker background, glowing screens, anime seinen style, detailed, 8k "
                
                if "anime" in clean_text: style += ", anime style, studio ghibli, vibrant"
                elif "realista" in clean_text or "foto" in clean_text: style += ", photorealistic, 8k, raw photo, fujifilm"
                elif "cyberpunk" in clean_text: style += ", cyberpunk, neon, high tech, dark atmosphere"
                elif "oleo" in clean_text: style += ", oil painting, textured, classic art"
                
                # Clean prompt of technical words to avoid confusion in generation
                for tech_word in ["vertical", "horizontal", "panoramico", "estilo", "realista", "anime", "kali", "arquitecta"]:
                    clean_text = clean_text.replace(tech_word, "")
                
                full_prompt = f"{clean_text}, {style} {ratio if ratio else ''}".strip()
                return full_prompt, ratio

            # --- C. Manifestation Routing ---
            
            if is_img:
                is_flux = "/flux" in lc_msg
                raw_prompt = extract_prompt(message, img_triggers, response_text)
                final_prompt, _ = extract_style_and_ratio(raw_prompt)
                
                # If flux requested, use the advanced workflow
                if is_flux:
                    image_url = MultimodalNexus.manifest_image(f"{final_prompt}, high fidelity, masterpiece", workflow_type="flux")
                else:
                    image_url = MultimodalNexus.manifest_image(final_prompt)
                
                if "Error" in image_url:
                     response_text += f"\n\n[ERROR]: No pude materializar la visión: {image_url}"
                else:
                     response_text += f"\n\n[MANIFESTATION]: ![]({image_url})"

            elif is_vid:
                is_high_fidelity = "/manifest_high" in lc_msg
                raw_prompt = extract_prompt(message, vid_triggers, response_text)
                final_prompt, _ = extract_style_and_ratio(raw_prompt)
                
                video_url = MultimodalNexus.manifest_anime_video(final_prompt, num_frames=16 if "largo" in lc_msg else 8)
                response_text += f"\n\n[ANIME]: ![]({video_url})"

            elif is_sub:
                text_to_speak = message
                for t in voc_triggers:
                     text_to_speak = text_to_speak.replace(t, "", 1)
                text_to_speak = text_to_speak.strip()

                if len(text_to_speak) < 3:
                     # "Habla" -> Speack the AI response
                     text_to_speak = response_text.replace("*", "") # Remove roleplay actions for clarity
                
                audio_url = await MultimodalNexus.speak(text_to_speak)
                response_text += f"\n\n[VOICE]: ![]({audio_url})"


            # 5. Persist Interaction in Vector Memory
            try:
                anuu_memory.store_memory(
                    text=f"User: {message}\nAnuu: {response_text}",
                    metadata={"archetype": archetype, "type": "interaction"}
                )
            except Exception as e:
                print(f"[MEMORY ERROR]: {e}")

        except Exception as e:
            response_text = f"[SYSTEM ERROR] Could not connect to Neural Link (Ollama): {str(e)}"
        
        return response_text
