"""
Sarvam AI service wrapper.
Provides Speech-to-Text (Saaras v3) and Text-to-Speech (Bulbul v2).
Gracefully returns None/empty if SARVAM_API_KEY is not configured.

IMPORTANT: API key is read dynamically at call-time (not at import time)
so that environment variables loaded by uvicorn/Render are always picked up.
"""
import os
import base64
import httpx

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


def _get_api_key() -> str:
    """Read API key dynamically so it's always up-to-date from the environment."""
    return os.environ.get("SARVAM_API_KEY", "").strip()


def is_sarvam_configured() -> bool:
    """Return True if Sarvam API key is present in the environment."""
    key = _get_api_key()
    configured = bool(key)
    if not configured:
        print("[Sarvam] WARNING: SARVAM_API_KEY is not set or empty in environment.")
    return configured


async def transcribe_audio(audio_bytes: bytes, language_code: str = "en-IN", filename: str = "audio.webm") -> str:
    """
    Transcribe audio using Sarvam AI Saaras v3 STT.
    Returns transcript string, or raises on error.
    Supports: webm, mp4, m4a, ogg, wav, mp3, flac, aac.
    """
    api_key = _get_api_key()
    if not api_key:
        raise ValueError("SARVAM_API_KEY not configured in environment")

    # Determine content type from filename extension
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "webm"
    content_type_map = {
        "webm": "audio/webm",
        "mp4":  "audio/mp4",
        "m4a":  "audio/mp4",
        "ogg":  "audio/ogg",
        "wav":  "audio/wav",
        "mp3":  "audio/mpeg",
        "flac": "audio/flac",
        "aac":  "audio/aac",
    }
    content_type = content_type_map.get(ext, "audio/webm")

    print(f"[Sarvam STT] Sending {len(audio_bytes)} bytes as {content_type} (lang={language_code})")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{SARVAM_BASE_URL}/speech-to-text",
            headers={"api-subscription-key": api_key},
            files={"file": (filename, audio_bytes, content_type)},
            data={
                "model": "saaras:v3",
                "language_code": language_code,
            },
        )

        print(f"[Sarvam STT] Response: {response.status_code} — {response.text[:300]}")

        if not response.is_success:
            raise ValueError(f"Sarvam STT failed: {response.status_code} - {response.text[:200]}")

        data = response.json()
        transcript = data.get("transcript", "") or data.get("text", "")
        print(f"[Sarvam STT] Transcript: '{transcript}'")
        return transcript


async def speak_text(text: str, language_code: str = "en-IN", speaker: str = "") -> bytes:
    """
    Convert text to speech using Sarvam AI Bulbul v2 TTS.
    Returns raw audio bytes (WAV), or raises on error.
    """
    api_key = _get_api_key()
    if not api_key:
        raise ValueError("SARVAM_API_KEY not configured in environment")

    chosen_speaker = speaker if speaker else SPEAKER_MAP.get(language_code, "anushka")

    # Truncate to API limit
    text_chunk = text[:500]

    print(f"[Sarvam TTS] Synthesising {len(text_chunk)} chars in {language_code} with speaker={chosen_speaker}")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{SARVAM_BASE_URL}/text-to-speech",
            headers={
                "api-subscription-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "inputs": [text_chunk],
                "target_language_code": language_code,
                "speaker": chosen_speaker,
                "model": "bulbul:v2",
                "enable_preprocessing": True,
                "speech_sample_rate": 22050,
            },
        )

        print(f"[Sarvam TTS] Response: {response.status_code}")

        if not response.is_success:
            raise ValueError(f"Sarvam TTS failed: {response.status_code} - {response.text[:200]}")

        data = response.json()
        audios = data.get("audios", [])
        if not audios:
            raise ValueError("No audio returned from Sarvam TTS")

        return base64.b64decode(audios[0])
