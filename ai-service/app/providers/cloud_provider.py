import os
import httpx
import json
from typing import Dict, Any, Optional
from app.providers.base import BaseAiProvider

AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

class CloudAiProvider(BaseAiProvider):
    def __init__(
        self,
        api_key: Optional[str] = AI_API_KEY,
        base_url: str = AI_BASE_URL,
        model: str = AI_MODEL
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def is_available(self) -> bool:
        if not self.api_key:
            return False
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{self.base_url}/models", headers=headers)
                return res.status_code == 200
        except Exception:
            return False

    async def parse_natural_language_search(self, query: str) -> Dict[str, Any]:
        if not self.api_key:
            return {}
        system_prompt = (
            "You are a travel parameter extractor. Extract flight search details from the user prompt into JSON.\n"
            "Format: {\"source\": \"IATA_OR_CITY\", \"destination\": \"IATA_OR_CITY\", \"departure_period\": \"morning|afternoon|evening|ANY\", \"max_price\": number_or_null, \"checked_baggage\": bool_or_null, \"passenger_count\": 1}"
        )
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            body = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.1
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=body)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return json.loads(content)
        except Exception:
            pass
        return {}

    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        if not self.api_key:
            return ""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            body = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.4
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=body)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"].strip()
        except Exception:
            pass
        return ""
