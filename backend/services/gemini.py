import os
from google import genai


class _ModelWrapper:
    """Thin wrapper so callers can use model.generate_content(prompt)."""

    def __init__(self, client: genai.Client, model_name: str):
        self._client = client
        self._model_name = model_name

    def generate_content(self, contents):
        return self._client.models.generate_content(
            model=self._model_name,
            contents=contents,
        )


def get_gemini_client() -> genai.Client:
    """Return a configured genai.Client. Accepts GOOGLE_API_KEY or GEMINI_API_KEY."""
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Neither GOOGLE_API_KEY nor GEMINI_API_KEY is set in environment")
    return genai.Client(api_key=api_key)


def get_gemini_model(model_name: str = "gemini-2.0-flash") -> _ModelWrapper:
    return _ModelWrapper(get_gemini_client(), model_name)
