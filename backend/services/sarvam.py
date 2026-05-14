"""
Sarvam AI service wrapper.
Provides Speech-to-Text (Saaras v3) and Text-to-Speech (Bulbul v3).
Gracefully returns None/empty if SARVAM_API_KEY is not configured.
"""
import os
import httpx

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
SARVAM_BASE_URL = "https://api.sarvam.ai"

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
    Transcribe audio using Sarvam AI Saaras v3 STT.
    Returns transcript string, or raises on error.
    """
    if not is_sarvam_configured():
        raise ValueError("SARVAM_API_KEY not configured")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Determine content type based on filename extension
        content_type = "audio/webm" if filename.endswith(".webm") else "audio/wav"
        
        response = await client.post(
            f"{SARVAM_BASE_URL}/speech-to-text",
            headers={"api-subscription-key": SARVAM_API_KEY},
            files={"file": (filename, audio_bytes, content_type)},
            data={
                "model": "saaras:v3",
                "language_code": language_code,
                "with_timestamps": "false",
                "with_disfluencies": "false",
            },
        )
        response.raise_for_status()
        data = response.json()
        # Sarvam returns { "transcript": "...", ... }
        return data.get("transcript", "")


async def speak_text(text: str, language_code: str = "hi-IN", speaker: str = "meera") -> bytes:
    """
    Convert text to speech using Sarvam AI Bulbul v3 TTS.
    Returns raw audio bytes (WAV), or raises on error.
    """
    if not is_sarvam_configured():
        raise ValueError("SARVAM_API_KEY not configured")

    # Speaker options differ by language. Updated to use valid v3 speakers.
    speaker_map = {
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
        "en-IN": "anushka",
    }
    chosen_speaker = speaker_map.get(language_code, "anushka")

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{SARVAM_BASE_URL}/text-to-speech",
            headers={
                "api-subscription-key": SARVAM_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "inputs": [text[:500]],   # Sarvam has per-chunk limits
                "target_language_code": language_code,
                "speaker": chosen_speaker,
                "model": "bulbul:v3",
                "enable_preprocessing": True,
            },
        )
        response.raise_for_status()
        data = response.json()
        # Response: { "audios": ["<base64>"] }
        import base64
        audios = data.get("audios", [])
        if not audios:
            raise ValueError("No audio returned from Sarvam TTS")
        return base64.b64decode(audios[0])
