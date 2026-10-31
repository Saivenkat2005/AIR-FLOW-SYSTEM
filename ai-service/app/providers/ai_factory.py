import os
from typing import Optional
from app.providers.base import BaseAiProvider
from app.providers.ollama_provider import OllamaProvider
from app.providers.deterministic_provider import DeterministicProvider
from app.providers.cloud_provider import CloudAiProvider

class AiProviderFactory:
    _cached_provider: Optional[BaseAiProvider] = None

    @classmethod
    async def get_provider(cls) -> BaseAiProvider:
        force_deterministic = os.getenv("USE_DETERMINISTIC_AI", "false").lower() == "true"
        if force_deterministic:
            return DeterministicProvider()

        # 1. Cloud Provider (OpenAI / Gemini / External LLM API)
        cloud_key = os.getenv("AI_API_KEY") or os.getenv("OPENAI_API_KEY")
        if cloud_key:
            cloud = CloudAiProvider(api_key=cloud_key)
            if await cloud.is_available():
                return cloud

        # 2. Local Ollama Provider
        ollama = OllamaProvider()
        if await ollama.is_available():
            return ollama

        # 3. Always fallback cleanly to deterministic rule engine
        return DeterministicProvider()

    @classmethod
    async def get_provider_name(cls) -> str:
        provider = await cls.get_provider()
        if isinstance(provider, CloudAiProvider):
            return "cloud-llm-provider"
        if isinstance(provider, OllamaProvider):
            return "ollama-local-model"
        return "nexus-deterministic-nlp-engine"
