import time
import logging
from typing import Callable, Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai.tool.registry")

class SafeToolRegistry:
    _tools: Dict[str, Dict[str, Any]] = {}
    _audit_log: list = []

    @classmethod
    def register(cls, name: str, description: str, requires_auth: bool = False, timeout_sec: float = 5.0):
        def decorator(func: Callable):
            cls._tools[name] = {
                "name": name,
                "description": description,
                "func": func,
                "requires_auth": requires_auth,
                "timeout_sec": timeout_sec
            }
            return func
        return decorator

    @classmethod
    async def execute(cls, tool_name: str, **kwargs) -> Any:
        if tool_name not in cls._tools:
            raise ValueError(f"Unauthorized or unregistered AI tool: {tool_name}")

        tool_meta = cls._tools[tool_name]
        start_time = time.time()

        try:
            func = tool_meta["func"]
            if callable(func):
                result = func(**kwargs) if not hasattr(func, '__await__') else await func(**kwargs)
            else:
                result = None

            duration_ms = (time.time() - start_time) * 1000
            cls._audit_log.append({
                "tool": tool_name,
                "status": "SUCCESS",
                "duration_ms": round(duration_ms, 2),
                "timestamp": time.time()
            })
            logger.info(f"Executed tool [{tool_name}] in {duration_ms:.2f}ms")
            return result
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            cls._audit_log.append({
                "tool": tool_name,
                "status": "FAILED",
                "error": str(e),
                "duration_ms": round(duration_ms, 2),
                "timestamp": time.time()
            })
            logger.error(f"Failed tool execution [{tool_name}]: {str(e)}")
            raise

    @classmethod
    def get_tool_list(cls):
        return [
            {"name": k, "description": v["description"], "requires_auth": v["requires_auth"]}
            for k, v in cls._tools.items()
        ]

    @classmethod
    def get_audit_log(cls, limit: int = 20):
        return cls._audit_log[-limit:]
