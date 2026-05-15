import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv(".env", override=True)
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_BASE_URL = "https://api.sarvam.ai"

async def test():
    print("Testing TTS with bulbul:v2...")
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            f"{SARVAM_BASE_URL}/text-to-speech",
            headers={"api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json"},
            json={
                "inputs": ["This is a test of the text to speech system."],
                "target_language_code": "en-IN",
                "speaker": "anushka",
                "model": "bulbul:v2"
            }
        )
        if res.status_code == 200:
            print("TTS SUCCESS")
        else:
            print("TTS FAILED:", res.status_code, res.text)
            
    # download a small valid test wav file
    os.system("curl -s -L https://github.com/mathworks/example-audio-files/raw/master/speech_diga_digits.wav -o test_speech.wav")
    
    print("Testing STT with saarika:v2.5 on WAV...")
    async with httpx.AsyncClient(timeout=30) as client:
        with open("test_speech.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("test_speech.wav", f, "audio/wav")},
                data={
                    "model": "saarika:v2.5", # or saarika:v1
                    "language_code": "en-IN"
                }
            )
            print("STT (saarika:v2.5):", res.status_code, res.text)
            
    print("Testing STT with saaras:v3 on WAV...")
    async with httpx.AsyncClient(timeout=30) as client:
        with open("test_speech.wav", "rb") as f:
            res = await client.post(
                f"{SARVAM_BASE_URL}/speech-to-text",
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": ("test_speech.wav", f, "audio/wav")},
                data={
                    "model": "saaras:v3", # or saarika:v1
                    "language_code": "en-IN"
                }
            )
            print("STT (saaras:v3):", res.status_code, res.text)

asyncio.run(test())
