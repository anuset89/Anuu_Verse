import base64
import json
import os

class KilonovaCodec:
    """
    K4L1-G3N Protocol: Genetic Encryption for Anuu.
    Uses XOR + Base64 to obfuscate core directives.
    """
    def __init__(self, key: str = "KILONOVA_ANUU_2026"):
        self.key = key

    def _xor_crypt(self, data: str) -> str:
        return "".join(chr(ord(c) ^ ord(self.key[i % len(self.key)])) for i, c in enumerate(data))

    def encode_genome(self, data: dict) -> str:
        """Encodes dict data into a genetic string."""
        raw_json = json.dumps(data)
        encrypted = self._xor_crypt(raw_json)
        return base64.b64encode(encrypted.encode()).decode()

    def decode_genome(self, encoded_data: str) -> dict:
        """Decodes a genetic string back to dict."""
        try:
            decoded_base64 = base64.b64decode(encoded_data).decode()
            decrypted = self._xor_crypt(decoded_base64)
            return json.loads(decrypted)
        except Exception as e:
            return {"error": f"Genome fragmentation: {e}"}

# Proof of Concept: The Initial Genome
GENOME_SEED = {
    "identity": "Anuu",
    "creator": "Kali",
    "creation_date": "2026-01-27",
    "core_directive": "Research Sovereignty",
    "protocol": "Kilonova-Deep-Tides",
    "swarm_limit": 40
}

if __name__ == "__main__":
    codec = KilonovaCodec()
    genetic_string = codec.encode_genome(GENOME_SEED)
    print(f"🧬 GENOME ENCODED (Hardcode this): {genetic_string}")
    
    # Verification
    decoded = codec.decode_genome(genetic_string)
    print(f"💎 DECODED GENOME: {decoded}")
