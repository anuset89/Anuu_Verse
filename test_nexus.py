import sys
import os

# Ensure we can import systems
sys.path.append(os.getcwd())

from systems.EXECUTION.skills.multimodal import MultimodalNexus

def test_manifestation():
    print("🔮 [TEST] Initiating Multimodal Nexus Test...")
    print("🔮 [TEST] Target: Pony Diffusion V6 XL (Anime/Seinen)")
    
    prompt = "1girl, sitting on a cyberpunk throne, glowing neon cables, dark atmosphere, highly detailed, mysterious, looking at viewer, masterpiece, best quality"
    
    print(f"🔮 [TEST] Prompt: {prompt}")
    
    try:
        # This will trigger ModelManager -> Load Pony -> Generate
        image_path = MultimodalNexus.manifest_image(prompt)
        
        print(f"\n✅ [SUCCESS] Manifestation Complete!")
        print(f"🖼️ Output: {image_path}")
        print("Note: If this is the first run, check your VRAM usage. It should have utilized the RX 7800 XT.")
        
    except Exception as e:
        print(f"\n❌ [FAILURE] Manifestation Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_manifestation()
