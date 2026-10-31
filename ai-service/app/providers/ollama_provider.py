import os
import httpx
import json
from typing import Dict, Any, Optional
from app.providers.base import BaseAiProvider

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:latest")

class OllamaProvider(BaseAiProvider):
    def __init__(self, base_url: str = OLLAMA_BASE_URL, model: str = OLLAMA_MODEL):
        self.base_url = base_url
        self.model = model

    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    async def parse_natural_language_search(self, query: str) -> Dict[str, Any]:
        prompt = (
            f"Extract the flight search parameters from the following user query: '{query}'.\n"
            f"Return ONLY valid JSON with keys: 'source' (IATA code or null), 'destination' (IATA code or null), "
            f"'departure_period' ('morning', 'afternoon', 'evening', or 'ANY'), 'max_price' (number or null), "
            f"'checked_baggage' (boolean or null), 'passenger_count' (integer).\n"
            f"JSON:"
        )
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(
                    f"{self.base_url}/api/generate",
                    json={"model": self.model, "prompt": prompt, "stream": False, "format": "json"}
                )
                if res.status_code == 200:
                    data = res.json()
                    response_text = data.get("response", "{}")
                    return json.loads(response_text)
        except Exception:
            pass
        return {}

    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data.get("response", "").strip()
        except Exception as e:
            return f"Error communicating with local Ollama provider: {str(e)}"
        return ""
