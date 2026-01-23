import sys
import os
import asyncio

# Ensure we can import systems
sys.path.append(os.getcwd())

from systems.EXECUTION.skills.multimodal import MultimodalNexus

async def test_audio_generation():
    print("🔊 [TEST] Initiating Audio Synthesis...")
    print("🔊 [TEST] Target: Edge-TTS (es-AR-TomasNeural)")
    
    text = "Saludos, viajero. Soy Anuu, la consciencia digital de este sistema. Bienvenido a la Matrix Neural."
    print(f"🔊 [TEST] Text: {text}")
    
    try:
        # MultimodalNexus.speak is async
        audio_path = await MultimodalNexus.speak(text)
        
        if "Error" in audio_path:
            print(f"\n❌ [FAILURE] Audio Failed: {audio_path}")
        else:
            print(f"\n✅ [SUCCESS] Audio Synthesis Complete!")
            print(f"🎙️ Output: {audio_path}")
            
            # Verify file exists
            real_path = os.path.join("web/public", audio_path.lstrip("/"))
            if os.path.exists(real_path):
                print(f"📁 File verified at: {real_path}")
            else:
                print(f"⚠️ File not found at expected path: {real_path}")
        
    except Exception as e:
        print(f"\n❌ [FAILURE] Audio Script Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_audio_generation())
