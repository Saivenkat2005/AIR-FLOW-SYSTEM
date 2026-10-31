from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RecommendationRequest(BaseModel):
    source: str
    destination: str
    departureDate: str
    passengers: int
    budget: int
    cabin: str

@router.post("/flights")
def get_recommendations(request: RecommendationRequest):
    # Mocking recommendation logic using data that would be fetched from Java API
    return {
        "recommendations": [
            {
                "flightId": 1,
                "score": 87,
                "reasons": [
                    "Lowest available fare",
                    "Shorter travel duration",
                    "Suitable departure time"
                ]
            }
        ]
    }
