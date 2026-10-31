from fastapi import APIRouter
from app.schemas.schemas import TripPlanRequest, TripPlanResponse
from app.services.trip_planner_service import TripPlannerService

router = APIRouter()

@router.post("", response_model=TripPlanResponse)
def plan_trip(request: TripPlanRequest):
    return TripPlannerService.generate_plan(request)
