import time
from typing import Dict, Any, List

class AiTelemetry:
    _request_count: int = 0
    _total_latency_ms: float = 0.0
    _provider_stats: Dict[str, int] = {
        "ollama": 0,
        "deterministic": 0
    }
    _tool_calls_count: int = 0
    _firewall_rejections: int = 0

    @classmethod
    def record_request(cls, provider: str, duration_ms: float, tool_calls: int = 0, rejected: bool = False):
        cls._request_count += 1
        cls._total_latency_ms += duration_ms
        if "ollama" in provider.lower():
            cls._provider_stats["ollama"] += 1
        else:
            cls._provider_stats["deterministic"] += 1
        cls._tool_calls_count += tool_calls
        if rejected:
            cls._firewall_rejections += 1

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        avg_lat = round(cls._total_latency_ms / max(1, cls._request_count), 2)
        return {
            "total_ai_requests": cls._request_count,
            "average_latency_ms": avg_lat,
            "provider_breakdown": cls._provider_stats,
            "total_safe_tool_executions": cls._tool_calls_count,
            "firewall_intercepted_count": cls._firewall_rejections,
            "system_status": "OPTIMAL"
        }
