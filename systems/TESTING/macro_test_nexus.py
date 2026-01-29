import sys
import os
import asyncio
import requests
import time
from datetime import datetime

# Add root to path so we can import 'systems'
sys.path.append(os.getcwd())

try:
    from systems.EXECUTION.skills.multimodal import MultimodalNexus
except ImportError as e:
    print(f"❌ CRITICAL ERROR: Could not import MultimodalNexus. Run from 'Anuu_Verse' root.\n{e}")
    sys.exit(1)

class NexusMacroTest:
    def __init__(self):
        self.comfy_url = "http://127.0.0.1:8188"
        self.results = []

    def log(self, area, status, detail):
        icon = "✅" if status else "❌"
        self.results.append({"area": area, "status": status, "detail": detail})
        print(f"{icon} [{area}]: {detail}")

    def test_comfy_connection(self):
        print("\n--- 🔌 Testing Connection ---")
        try:
            r = requests.get(self.comfy_url, timeout=2)
            if r.status_code == 200:
                self.log("ComfyUI API", True, "Server responded OK (200)")
                return True
            else:
                self.log("ComfyUI API", False, f"Server Error: {r.status_code}")
                return False
        except Exception as e:
            self.log("ComfyUI API", False, f"Connection Failed: {str(e)}")
            return False

    def test_audio(self):
        print("\n--- 🗣️ Testing Audio (Edge-TTS) ---")
        try:
            # We assume speak is an async method based on previous code
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(MultimodalNexus.speak("System Diagnostic Sequence Initiated."))
            
            if result and "/audio/" in result and not "Error" in result:
                self.log("Audio Synthesis", True, f"Generated: {result}")
            else:
                self.log("Audio Synthesis", False, f"Failed: {result}")
        except Exception as e:
            self.log("Audio Synthesis", False, f"Exception: {e}")

    def test_image_generation(self):
        print("\n--- 🎨 Testing Image (PonyXL) ---")
        try:
            # Test prompt
            prompt = "cyberpunk glitch artifact, simple debug test image"
            # This is synchronous in the agent code
            result = MultimodalNexus.manifest_image(prompt)
            
            if result and "/generations/" in result and not "Error" in result:
                self.log("Image Generation", True, f"Generated: {result}")
            else:
                self.log("Image Generation", False, f"Failed: {result}")

        except Exception as e:
            self.log("Image Generation", False, f"Exception: {e}")

    def test_video_generation(self):
        print("\n--- 🎬 Testing Video (AnimateDiff) ---")
        # Video takes long, so we just want to ensure the workflow is queued and we get a processing ID
        try:
             prompt = "simple rotating cube, 3d render"
             result = MultimodalNexus.manifest_anime_video(prompt, num_frames=8)
             
             if result and "processing_video" in result:
                 self.log("Video Generation", True, f"Job Queued: {result}")
             elif "Error" in result:
                 self.log("Video Generation", False, f"Workflow Error: {result}")
             else:
                 self.log("Video Generation", False, f"Unexpected Output: {result}")
                 
        except Exception as e:
            self.log("Video Generation", False, f"Exception: {e}")

    def run_all(self):
        print(f"🔬 ANUU NEXUS MACRO TEST | {datetime.now().isoformat()}")
        print("==================================================")
        
        # 1. Check Backend
        comfy_ok = self.test_comfy_connection()
        
        # 2. Check Audio (Independent)
        self.test_audio()

        # 3. Check Comfy-dependent skills
        if comfy_ok:
            self.test_image_generation()
            self.test_video_generation()
        else:
             print("\n⚠️ Skipping Comfy worklow tests due to connection failure.")
             self.log("Image Generation", False, "Skipped (No ComfyUI)")
             self.log("Video Generation", False, "Skipped (No ComfyUI)")
        
        print("\n📊 SUMMARY REPORT")
        print("-----------------")
        passed = sum(1 for r in self.results if r['status'])
        total = len(self.results)
        print(f"Success Rate: {passed}/{total}")
        for r in self.results:
            status = "PASS" if r['status'] else "FAIL"
            print(f"[{status}] {r['area']}: {r['detail']}")

if __name__ == "__main__":
    tester = NexusMacroTest()
    tester.run_all()
