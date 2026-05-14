import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv(override=True)

_groq_client = None

def get_groq_client() -> Groq | None:
    """Return a configured Groq client if the API key is available, else None."""
    global _groq_client
    if _groq_client is not None:
        return _groq_client

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
        
    _groq_client = Groq(api_key=api_key)
    return _groq_client
