from fastapi import APIRouter
from app.schemas.schemas import BaggageRequest, BaggageResponse
from app.services.baggage_service import BaggageService

router = APIRouter()

@router.post("", response_model=BaggageResponse)
def calculate_baggage(request: BaggageRequest):
    return BaggageService.calculate_baggage(request)
