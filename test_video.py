import sys
import os

# Ensure we can import systems
sys.path.append(os.getcwd())

from systems.EXECUTION.skills.multimodal import MultimodalNexus

def test_animation():
    print("🔮 [TEST] Initiating Kinetic Manifestation (Video)...")
    print("🔮 [TEST] Target: SVD-XT (Motion)")
    
    # Use the artifact we saved earlier
    image_path = "/home/kali/.gemini/antigravity/brain/b919294a-0bc3-429c-91b7-ba17245a02b6/uploaded_image_1769189574282.jpg"
    
    if not os.path.exists(image_path):
        print(f"❌ Source image not found at {image_path}")
        return

    print(f"🔮 [TEST] Source: {image_path}")
    
    try:
        print("🔮 [TEST] Calling MultimodalNexus.manifest_video()...")
        # This will trigger ModelManager -> Unload Pony -> Load SVD -> Generate -> Restore LLM
        video_path = MultimodalNexus.manifest_video(image_path)
        
        print(f"🔮 [TEST] Result: {video_path}")
        
        if "Error" in video_path:
             print(f"\n❌ [FAILURE] Animation Error: {video_path}")
        else:
             print(f"\n✅ [SUCCESS] Motion Achieved!")
             print(f"🎬 Output: {video_path}")
        
    except Exception as e:
        print(f"\n❌ [FAILURE] Animation Exception: {e}")
        print(f"\n❌ [FAILURE] Animation Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_animation()
