import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv(".env", override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_BASE_URL = "https://api.sarvam.ai"

async def test():
    if not SARVAM_API_KEY:
        print("NO API KEY")
        return
        
    print("Testing TTS...")
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            f"{SARVAM_BASE_URL}/text-to-speech",
            headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
            json={
                "inputs": ["Hello"],
                "target_language_code": "en-IN",
                "speaker": "anushka",
                "model": "bulbul:v2"
            }
        )
        print("TTS:", res.status_code, res.text)
        
    print("Testing STT...")
    async with httpx.AsyncClient(timeout=30) as client:
        # Create a dummy wav file
        with open("dummy.wav", "wb") as f:
            f.write(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00")
        with open("dummy.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text-translate", # or speech-to-text
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("dummy.wav", f, "audio/wav")},
                data={
                    "model": "saarika:v2.5",
                    "prompt": ""
                }
            )
        print("STT (saarika:v2.5 via translate):", res.status_code, res.text[:200])

        with open("dummy.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("dummy.wav", f, "audio/wav")},
                data={
                    "model": "saarika:v2.5",
                    "language_code": "hi-IN",
                }
            )
        print("STT (saarika:v2.5 via normal):", res.status_code, res.text[:200])

        with open("dummy.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("dummy.wav", f, "audio/wav")},
                data={
                    "model": "saaras:v1",
                    "language_code": "hi-IN",
                }
            )
        print("STT (saaras:v1):", res.status_code, res.text[:200])

asyncio.run(test())
