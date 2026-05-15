import asyncio
import os
import httpx
from dotenv import load_dotenv
import wave
import struct
import math

load_dotenv(".env", override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_BASE_URL = "https://api.sarvam.ai"

# generate a 1-second sine wave
framerate = 44100
t = 1.0
freq = 440.0
amp = 8000
with wave.open("test_real.wav", "w") as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(framerate)
    nframes = int(framerate * t)
    for i in range(nframes):
        val = int(amp * math.sin(2 * math.pi * freq * i / framerate))
        data = struct.pack('<h', val)
        f.writeframesraw(data)

async def test():
    print("Testing STT with saarika:v2.5 on WAV...")
    async with httpx.AsyncClient(timeout=30) as client:
        with open("test_real.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("test_real.wav", f, "audio/wav")},
                data={
                    "model": "saarika:v2.5",
                    "language_code": "en-IN"
                }
            )
            print("STT (saarika:v2.5):", res.status_code, res.text[:200])

    print("Testing STT with saaras:v3 on WAV...")
    async with httpx.AsyncClient(timeout=30) as client:
        with open("test_real.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("test_real.wav", f, "audio/wav")},
                data={
                    "model": "saaras:v3",
                    "language_code": "en-IN"
                }
            )
            print("STT (saaras:v3):", res.status_code, res.text[:200])

asyncio.run(test())
