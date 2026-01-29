import pyaudio
import numpy as np
import librosa
import threading
import logging
import time
from typing import Dict

logger = logging.getLogger("Audio_Reactor")

class AudioReactor:
    """
    The Ears of Anuu: Real-time audio analysis in the background.
    """
    def __init__(self, sample_rate: int = 16000, chunk_size: int = 1024 * 4):
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.pa = pyaudio.PyAudio()
        self.vibe_vector = {"energy": 0.0, "bpm": 0, "frequency_bias": "neutral"}
        self._running = False
        self._thread = None

    def _audio_callback(self, in_data, frame_count, time_info, status):
        """Processes a chunk of audio."""
        if status:
            logger.debug(f"Audio status warning: {status}")
        
        # Convert to numpy
        y = np.frombuffer(in_data, dtype=np.float32)
        
        # Calculate Energy (RMS)
        rms = np.sqrt(np.mean(y**2))
        self.vibe_vector["energy"] = float(np.clip(rms * 10, 0, 1)) # Scaled for sensitivity

        # Low-frequency check (Kick/Bass)
        # Using a simple moving average or FFT would be better, but RMS is a start for v0.4
        
        return (None, pyaudio.paContinue)

    def start(self):
        """Starts the background ear thread."""
        if self._running: return
        self._running = True
        
        try:
            self.stream = self.pa.open(
                format=pyaudio.paFloat32,
                channels=1,
                rate=self.sample_rate,
                input=True,
                frames_per_buffer=self.chunk_size,
                stream_callback=self._audio_callback
            )
            self.stream.start_stream()
            logger.info("Audio Reactor: Ears active (listening via PipeWire).")
        except Exception as e:
            logger.error(f"Failed to open audio stream: {e}")
            self._running = False

    def stop(self):
        self._running = False
        if hasattr(self, 'stream'):
            self.stream.stop_stream()
            self.stream.close()
        self.pa.terminate()

# Component instance
audio_reactor = AudioReactor()
