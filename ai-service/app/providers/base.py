from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseAiProvider(ABC):
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if provider backend is reachable and ready."""
        pass

    @abstractmethod
    async def parse_natural_language_search(self, query: str) -> Dict[str, Any]:
        """Extract origin, destination, time preference, and price ceiling."""
        pass

    @abstractmethod
    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate structured or textual completion."""
        pass
