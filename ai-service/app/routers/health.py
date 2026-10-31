import os
import httpx
from fastapi import APIRouter
from app.schemas.schemas import HealthResponse
from app.providers.ai_factory import AiProviderFactory

router = APIRouter()
JAVA_API_URL = os.getenv("JAVA_API_URL", "http://core-service:8080")

@router.get("", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse)
@router.get("/live", response_model=HealthResponse)
@router.get("/ready", response_model=HealthResponse)
async def health_check():
    provider_name = await AiProviderFactory.get_provider_name()
    java_connected = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            res = await client.get(f"{JAVA_API_URL}/actuator/health")
            java_connected = (res.status_code == 200)
    except Exception:
        java_connected = False

    return HealthResponse(
        status="UP",
        service="airline-ai-service",
        version="2.0.0",
        provider=provider_name,
        java_backend_connected=java_connected
    )
