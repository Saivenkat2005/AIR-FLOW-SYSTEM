from fastapi import APIRouter
from app.schemas.schemas import SearchRequest, SearchResponse
from app.services.flight_ai_service import FlightAiService

router = APIRouter()

@router.post("", response_model=SearchResponse)
async def natural_language_search(request: SearchRequest):
    return await FlightAiService.smart_search(request.query)

@router.post("/query", response_model=SearchResponse)
async def natural_language_search_alt(request: SearchRequest):
    return await FlightAiService.smart_search(request.query)
