import sys
import os

# Ensure we can import systems
sys.path.append(os.getcwd())

from systems.EXECUTION.skills.multimodal import MultimodalNexus

def test_anime_surprise():
    print("🔮 [TEST] Initiating Anime Surprise Manifestation...")
    print("🔮 [TEST] Target: AnimateDiff (SD1.5)")
    
    # "Surprise Me" Prompt (High Action/Sakuga)
    prompt = "masterpiece, best quality, highly detailed, ultra-detailed, 1girl, solo, holding sword, katana, glowing weapon, lightning, electricity, dynamic angle, fighting stance, intense expression, wind, flying debris, ruins, dark night, rain, wet clothes, particle effects, ray tracing, unreal engine 5, sakuga, anime style"
    
    print(f"🔮 [TEST] Prompt: {prompt}")
    
    try:
        # This will trigger ModelManager -> Unload previous -> Load AnimateDiff -> Generate -> Restore LLM
        video_path = MultimodalNexus.manifest_anime_video(prompt, num_frames=8)
        
        print(f"\n✅ [SUCCESS] Anime Manifestation Complete!")
        print(f"🎬 Output: {video_path}")
        
    except Exception as e:
        print(f"\n❌ [FAILURE] Animation Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_anime_surprise()
