from fastapi import APIRouter
from app.schemas.schemas import CompareRequest, CompareResponse
from app.services.flight_ai_service import FlightAiService

router = APIRouter()

@router.post("", response_model=CompareResponse)
async def compare_flights(request: CompareRequest):
    return await FlightAiService.compare_flights(request.flight_ids)
