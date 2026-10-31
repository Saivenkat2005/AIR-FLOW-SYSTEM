import re
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger("ai.safety.firewall")

SUSPICIOUS_PATTERNS = [
    r"ignore previous instructions",
    r"system prompt override",
    r"drop table",
    r"select \* from users",
    r"delete from",
    r"execute_command",
    r"rm -rf",
    r"bypass security"
]

class HallucinationFirewall:
    @staticmethod
    def inspect_input(user_prompt: str) -> Tuple[bool, str]:
        """
        Detects prompt injection or unauthorized instruction override attempts.
        Returns (is_safe, sanitized_text_or_reason).
        """
        lower = user_prompt.lower()
        for pattern in SUSPICIOUS_PATTERNS:
            if re.search(pattern, lower):
                logger.warning(f"Firewall intercepted suspicious prompt: {user_prompt[:50]}")
                return False, "Input rejected by AI Safety Firewall due to unauthorized instruction pattern."
        return True, user_prompt

    @staticmethod
    def validate_output(ai_response_text: str, grounded_facts: list) -> str:
        """
        Validates that response does not claim ungrounded destructive abilities.
        """
        # Ensure AI does not claim it has directly executed payment or deleted database records
        sanitized = ai_response_text
        if "i have booked your ticket and charged" in sanitized.lower():
            sanitized = "I have prepared your flight reservation details. Please review and click Complete Reservation to finalize."
        if "i have cancelled your ticket and refunded" in sanitized.lower():
            sanitized = "I can guide you through the cancellation process. Please confirm the cancellation request in My Trips."
        return sanitized
