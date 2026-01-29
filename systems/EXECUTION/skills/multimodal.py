import os
import time
import json
import random
import urllib.request
import urllib.parse
from .resource_vault import ResourceVault

# Global Instances
vault = ResourceVault()

class MultimodalNexus:
    """
    The Cortex Interface for Multimodal Generation via ComfyUI API.
    """
    COMFY_URL = "http://127.0.0.1:8188"

    @staticmethod
    def _queue_prompt(prompt_workflow):
        p = {"prompt": prompt_workflow}
        data = json.dumps(p).encode('utf-8')
        req = urllib.request.Request(f"{MultimodalNexus.COMFY_URL}/prompt", data=data)
        return json.loads(urllib.request.urlopen(req).read())

    @staticmethod
    def _get_history(prompt_id):
        with urllib.request.urlopen(f"{MultimodalNexus.COMFY_URL}/history/{prompt_id}") as response:
            return json.loads(response.read())

    @staticmethod
    def _wait_for_image(prompt_id):
        while True:
            history = MultimodalNexus._get_history(prompt_id)
            if prompt_id in history:
                return history[prompt_id]
            time.sleep(1)

    @staticmethod
    def manifest_image(prompt: str, output_dir: str = "Forges/PROTOTIPO_NEXO/generations", workflow_type: str = "sdxl"):
        """Generates an image via ComfyUI API using selected workflow."""
        try:
            # Select workflow
            if workflow_type == "flux":
                workflow_path = "systems/EXECUTION/skills/multimodal/workflows/txt2img_flux.json"
            else:
                workflow_path = "systems/EXECUTION/skills/multimodal/workflows/txt2img_pony.json"

            if not os.path.exists(workflow_path):
                 return f"Error: Workflow {workflow_path} not found."
            
            with open(workflow_path, 'r') as f:
                workflow = json.load(f)

            # --- Injection Logic ---
            if workflow_type == "flux":
                # Flux GGUF / UNET Loader pattern (simplified mapping)
                # We'll assume Node 6 is CLIP Text Encode for Flux too, or adjust for Flux node IDs
                if "6" in workflow and "inputs" in workflow["6"]:
                    workflow["6"]["inputs"]["text"] = prompt
                if "3" in workflow and "inputs" in workflow["3"]:
                    workflow["3"]["inputs"]["seed"] = random.randint(1, 1000000000)
            else:
                # SDXL / Pony pattern
                workflow["6"]["inputs"]["text"] = f"score_9, score_8_up, score_7_up, {prompt}"
                workflow["3"]["inputs"]["seed"] = random.randint(1, 1000000000)

            # Queue Prompt
            response = MultimodalNexus._queue_prompt(workflow)
            prompt_id = response['prompt_id']
            
            # Wait for result (Simplified: In a real agent, we might return 'Generating...' and poll later)
            # For now, we block to give immediate feedback as requested by Kali.
            result = MultimodalNexus._wait_for_image(prompt_id)
            
            # Extract filename
            outputs = result['outputs']
            for node_id in outputs:
                node_output = outputs[node_id]
                if 'images' in node_output:
                    filename = node_output['images'][0]['filename']
                    
                    # We return the filename and let the frontend Proxy it or use a symlink.
                    return f"/generations/{filename}"

            return "/generations/placeholder_error.png"

        except Exception as e:
            return f"Error manifesting image via ComfyUI: {str(e)}"

    @staticmethod
    def manifest_anime_video(prompt: str, output_dir: str = "Forges/PROTOTIPO_NEXO/generations", num_frames: int = 16):
        """Generates Video via ComfyUI (AnimateDiff)."""
        try:
            workflow_path = "systems/EXECUTION/skills/multimodal/workflows/txt2vid_animatediff.json"
            with open(workflow_path, 'r') as f:
                workflow = json.load(f)
            
            workflow["6"]["inputs"]["text"] = prompt
            workflow["3"]["inputs"]["seed"] = random.randint(1, 1000000000)
            
            response = MultimodalNexus._queue_prompt(workflow)
            # Video generation takes time, maybe just return "Rendering..." ID?
            # Kali wants speed, but video IS slow.
            # We return a specific "Processing" placeholder that the frontend recognizes.
            return f"/generations/processing_video_{response['prompt_id']}.mp4" 

        except Exception as e:
            return f"Error manifesting video: {str(e)}"

    @staticmethod
    async def speak(text: str, voice: str = "es-AR-TomasNeural", output_dir: str = "Forges/PROTOTIPO_NEXO/audio", rate: str = "-10%", pitch: str = "-5Hz"):
        """Generates speech using Edge-TTS with enhanced audio parameters."""
        try:
            import edge_tts
            os.makedirs(output_dir, exist_ok=True)
            
            # Create the communication object with specific parameters for "Anuu" voice
            communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
            
            timestamp = int(time.time())
            filename = f"voice_{timestamp}.mp3"
            path = os.path.join(output_dir, filename)
            
            await communicate.save(path)
            return f"/audio/{filename}"
        except Exception as e:
            return f"Error speaking: {str(e)}"
