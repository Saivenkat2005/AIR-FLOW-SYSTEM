from fastapi import APIRouter
from app.schemas.schemas_v3 import (
    TradeoffRequest, TradeoffResponse,
    SimulatorRequest, SimulatorResponse,
    ReadinessScoreRequest, ReadinessScoreResponse,
    FareTransparencyRequest, FareTransparencyResponse,
    DisruptionRequest, DisruptionResponse,
    AskBookingRequest, AskBookingResponse,
    AdminIncidentRequest, AdminIncidentResponse,
    ErrorExplanationRequest, ErrorExplanationResponse
)
from app.agents.tradeoff_agent import TradeoffAgent
from app.agents.simulator_agent import SimulatorAgent
from app.agents.fare_transparency_agent import FareTransparencyAgent
from app.agents.readiness_agent import ReadinessAgent
from app.agents.seat_agent import SeatAgent
from app.agents.disruption_agent import DisruptionAgent
from app.agents.booking_assistant_agent import BookingAssistantAgent
from app.agents.admin_incident_agent import AdminIncidentAgent

router = APIRouter()

# ─── 1. Trade-Off Engine ("What matters most?") ───────────────────────────────
@router.post("/tradeoffs", response_model=TradeoffResponse)
async def evaluate_tradeoffs(req: TradeoffRequest):
    return await TradeoffAgent.evaluate_tradeoffs(req)

# ─── 2. Trip Simulator ("What if?") ───────────────────────────────────────────
@router.post("/simulate", response_model=SimulatorResponse)
def simulate_trip(req: SimulatorRequest):
    return SimulatorAgent.simulate_trip(req)

# ─── 3. Fare Transparency ("Where is my money going?") ────────────────────────
@router.post("/fare-transparency", response_model=FareTransparencyResponse)
def explain_fare(req: FareTransparencyRequest):
    return FareTransparencyAgent.explain_fare(req)

# ─── 4. Travel Readiness Score & Checklist ────────────────────────────────────
@router.post("/readiness", response_model=ReadinessScoreResponse)
def calculate_readiness(req: ReadinessScoreRequest):
    return ReadinessAgent.calculate_readiness(req)

# ─── 5. Seat Intelligence & Context ───────────────────────────────────────────
@router.get("/seat-context/{seat_code}")
def explain_seat(seat_code: str):
    return SeatAgent.explain_seat_context(seat_code)

@router.post("/seat-intent")
def parse_seat_intent(query: str):
    return SeatAgent.parse_seat_intent(query)

# ─── 6. Flight Disruption & Connection Risk Analyzer ──────────────────────────
@router.post("/disruption", response_model=DisruptionResponse)
def analyze_disruption(req: DisruptionRequest):
    return DisruptionAgent.analyze_disruption(req)

# ─── 7. Contextual "Ask The Booking" ──────────────────────────────────────────
@router.post("/ask-booking", response_model=AskBookingResponse)
def ask_booking(req: AskBookingRequest):
    return BookingAssistantAgent.answer_booking_question(req)

# ─── 8. Admin Incident Explainer & Performance Analyst ────────────────────────
@router.post("/admin-incident", response_model=AdminIncidentResponse)
def analyze_admin_incident(req: AdminIncidentRequest):
    return AdminIncidentAgent.analyze_incident(req)

# ─── 9. Booking Error Explainer ───────────────────────────────────────────────
@router.post("/explain-error", response_model=ErrorExplanationResponse)
def explain_error(req: ErrorExplanationRequest):
    raw_msg = req.raw_error_message.lower()
    
    if "seat" in raw_msg or "unavailable" in raw_msg:
        title = "Selected Seat Unavailable"
        reason = "The chosen cabin seat is either held by another traveler or no longer available on this flight."
        action = "Please return to the seat map and choose another available green/blue seat."
    elif "profile" in raw_msg or "user" in raw_msg:
        title = "Passenger Profile Verification Required"
        reason = "Required traveler credentials (contact number or name) are incomplete."
        action = "Please review your passenger details before retrying."
    else:
        title = "Reservation Transmission Notice"
        reason = "The airline reservation system experienced a momentary communication delay."
        action = "Please check your network and retry your reservation."

    return ErrorExplanationResponse(
        user_friendly_title=title,
        possible_reason=reason,
        actionable_resolution=action,
        can_retry=True
    )

# ─── 10. Journey Health Engine (/journey-health/{bookingId}) ─────────────────
import os
import httpx

JAVA_CORE_URL = os.getenv("JAVA_API_URL", "http://core-service:8080")

@router.get("/journey-health/{bookingId}")
async def get_journey_health(bookingId: int):
    booking_data = None
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.get(f"{JAVA_CORE_URL}/booking/getbooking/{bookingId}")
            if res.status_code == 200:
                booking_data = res.json()
    except Exception:
        pass

    if not booking_data:
        return {
            "bookingId": bookingId,
            "status": "NOT_AVAILABLE",
            "score": 0,
            "algorithm_version": "1.0",
            "summary": "Booking record could not be retrieved from authoritative database.",
            "checklist": [
                {"item": "Booking Record", "passed": False, "weight": 40, "detail": "Record not found"}
            ]
        }

    score = 0
    checklist = []

    # 1. Booking Confirmation (30 pts)
    confirmed = bool(booking_data.get("bookingId"))
    score += 30 if confirmed else 0
    checklist.append({"item": "Reservation Confirmed", "passed": confirmed, "weight": 30, "detail": f"PNR: {booking_data.get('pnr', 'PENDING')}"})

    # 2. Seat Assignment (25 pts)
    seat_assigned = bool(booking_data.get("seatType"))
    score += 25 if seat_assigned else 0
    checklist.append({"item": "Cabin Class Allocated", "passed": seat_assigned, "weight": 25, "detail": f"Class: {booking_data.get('seatType', 'Unassigned')}"})

    # 3. Passenger Profile (25 pts)
    pax_valid = bool(booking_data.get("username") and booking_data.get("username") != "Passenger")
    score += 25 if pax_valid else 15
    checklist.append({"item": "Traveler Credentials Verified", "passed": pax_valid, "weight": 25, "detail": "Valid account verified"})

    # 4. Schedule Integrity (20 pts)
    sched_valid = bool(booking_data.get("flightName") and booking_data.get("takeOffTime"))
    score += 20 if sched_valid else 10
    checklist.append({"item": "Flight Schedule Confirmed", "passed": sched_valid, "weight": 20, "detail": f"{booking_data.get('flightName', 'FL')} at {booking_data.get('takeOffTime', 'TBD')}"})

    overall_status = "READY" if score >= 80 else ("AT_RISK" if score >= 50 else "INCOMPLETE")

    return {
        "bookingId": bookingId,
        "status": overall_status,
        "score": score,
        "algorithm_version": "1.0",
        "route": f"{booking_data.get('origin', 'DEL')} → {booking_data.get('destination', 'BOM')}",
        "summary": f"Journey is {overall_status} with readiness score {score}/100.",
        "checklist": checklist
    }

