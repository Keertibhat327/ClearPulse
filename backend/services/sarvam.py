"""
Sarvam AI service wrapper.
Provides Speech-to-Text (Saaras v2) and Text-to-Speech (Bulbul v2).
Gracefully returns None/empty if SARVAM_API_KEY is not configured.
"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv(override=True)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
SARVAM_BASE_URL = "https://api.sarvam.ai"

# bulbul:v2 speakers (verified working)
SPEAKER_MAP = {
    "en-IN": "anushka",
    "hi-IN": "anushka",
    "ta-IN": "anushka",
    "te-IN": "anushka",
    "bn-IN": "anushka",
    "kn-IN": "anushka",
    "ml-IN": "anushka",
    "mr-IN": "anushka",
    "gu-IN": "anushka",
    "pa-IN": "anushka",
    "or-IN": "anushka",
}

SUPPORTED_LANGUAGES = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "ta-IN": "Tamil",
    "te-IN": "Telugu",
    "bn-IN": "Bengali",
    "kn-IN": "Kannada",
    "ml-IN": "Malayalam",
    "mr-IN": "Marathi",
    "gu-IN": "Gujarati",
    "pa-IN": "Punjabi",
    "or-IN": "Odia",
}


def is_sarvam_configured() -> bool:
    return bool(SARVAM_API_KEY)


async def transcribe_audio(audio_bytes: bytes, language_code: str = "hi-IN", filename: str = "audio.wav") -> str:
    """
    Transcribe audio using Sarvam AI Saaras v2 STT.
    Returns transcript string, or raises on error.
    """
    if not is_sarvam_configured():
        raise ValueError("SARVAM_API_KEY not configured")

    # Determine content type based on filename extension
    if filename.endswith(".webm"):
        content_type = "audio/webm"
    elif filename.endswith(".mp4") or filename.endswith(".m4a"):
        content_type = "audio/mp4"
    elif filename.endswith(".ogg"):
        content_type = "audio/ogg"
    else:
        content_type = "audio/wav"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{SARVAM_BASE_URL}/speech-to-text",
            headers={"api-subscription-key": SARVAM_API_KEY},
            files={"file": (filename, audio_bytes, content_type)},
            data={
                "model": "saaras:v3",
                "language_code": language_code,
            },
        )

        if not response.is_success:
            error_text = response.text
            print(f"[Sarvam STT] Error {response.status_code}: {error_text}")
            raise ValueError(f"Sarvam STT failed: {response.status_code} - {error_text[:200]}")

        data = response.json()
        # Sarvam returns { "transcript": "...", ... }
        transcript = data.get("transcript", "")
        if not transcript:
            # Try alternative key
            transcript = data.get("text", "")
        return transcript


async def speak_text(text: str, language_code: str = "en-IN", speaker: str = "") -> bytes:
    """
    Convert text to speech using Sarvam AI Bulbul v2 TTS.
    Returns raw audio bytes (WAV), or raises on error.
    """
    if not is_sarvam_configured():
        raise ValueError("SARVAM_API_KEY not configured")

    # Use speaker from map if not provided
    chosen_speaker = speaker if speaker else SPEAKER_MAP.get(language_code, "anushka")

    # Truncate text to avoid API limits (500 chars per chunk)
    text_chunk = text[:500]

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{SARVAM_BASE_URL}/text-to-speech",
            headers={
                "api-subscription-key": SARVAM_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "inputs": [text_chunk],
                "target_language_code": language_code,
                "speaker": chosen_speaker,
                "model": "bulbul:v2",   # v2 is stable and works with anushka
                "enable_preprocessing": True,
                "speech_sample_rate": 22050,
            },
        )

        if not response.is_success:
            error_text = response.text
            print(f"[Sarvam TTS] Error {response.status_code}: {error_text}")
            raise ValueError(f"Sarvam TTS failed: {response.status_code} - {error_text[:200]}")

        data = response.json()
        # Response: { "audios": ["<base64>"] }
        import base64
        audios = data.get("audios", [])
        if not audios:
            raise ValueError("No audio returned from Sarvam TTS")
        return base64.b64decode(audios[0])
