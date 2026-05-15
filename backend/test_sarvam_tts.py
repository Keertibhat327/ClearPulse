import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv(".env", override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_BASE_URL = "https://api.sarvam.ai"

async def test():
    for lang in ["en-IN", "hi-IN", "ta-IN", "te-IN"]:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(
                f"{SARVAM_BASE_URL}/text-to-speech",
                headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
                json={
                    "inputs": ["Hello world"],
                    "target_language_code": lang,
                    "speaker": "anushka", # or meera
                    "model": "bulbul:v2",
                    "enable_preprocessing": True,
                    "speech_sample_rate": 22050,
                }
            )
            print(f"TTS {lang}:", res.status_code, res.text[:200])

asyncio.run(test())
