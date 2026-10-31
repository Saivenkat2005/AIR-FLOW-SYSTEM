from fastapi import APIRouter
from app.schemas.schemas import ExplainRequest, ExplainResponse
from app.services.flight_ai_service import FlightAiService

router = APIRouter()

@router.post("", response_model=ExplainResponse)
async def explain_flight(request: ExplainRequest):
    return await FlightAiService.explain_flight(
        flight_id=request.flightId,
        origin=request.origin,
        destination=request.destination,
        price=request.price
    )
