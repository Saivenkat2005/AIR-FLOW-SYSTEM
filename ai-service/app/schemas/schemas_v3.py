from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ExplanationLevel(str, Enum):
    SIMPLE = "simple"
    STANDARD = "standard"
    DETAILED = "detailed"
    TECHNICAL = "technical"

class PriorityOption(str, Enum):
    LOWEST_COST = "lowest_cost"
    SHORTEST_JOURNEY = "shortest_journey"
    COMFORT = "comfort"
    MORE_BAGGAGE = "more_baggage"
    BEST_TIMING = "best_timing"
    FEWER_STOPS = "fewer_stops"
    FLEXIBLE_FARE = "flexible_fare"

# ─── Trade-off Engine Schemas ──────────────────────────────────────────────────
class TradeoffRequest(BaseModel):
    priority: PriorityOption = PriorityOption.LOWEST_COST
    flight_ids: Optional[List[int]] = None
    origin: Optional[str] = None
    destination: Optional[str] = None

class TradeoffOption(BaseModel):
    priority: str
    label: str
    top_flight_id: int
    top_flight_name: str
    metric_value: str
    tradeoff_explanation: str
    why_matched: List[str]

class TradeoffResponse(BaseModel):
    current_priority: PriorityOption
    summary: str
    options: List[TradeoffOption]
    recommended_flight_id: int
    data_source: str = "verified-airline-schedules"

# ─── Trip Simulator ("What If?") Schemas ──────────────────────────────────────
class SimulatorRequest(BaseModel):
    current_flight_id: int
    current_price: float
    date_offset_days: int = Field(0, ge=-3, le=3)
    alternate_airport: Optional[str] = None
    include_checked_baggage: bool = True
    cabin_class: str = "Economy"
    passengers_count: int = 1

class SimulationDifference(BaseModel):
    scenario: str
    estimated_price: float
    price_difference: float
    difference_direction: str # "CHEAPER", "MORE_EXPENSIVE", "SAME"
    explanation: str

class SimulatorResponse(BaseModel):
    base_fare: float
    simulated_total: float
    total_difference: float
    scenarios: List[SimulationDifference]
    data_confidence: str = "High - Real DB Corridors"

# ─── Travel Readiness & Trip Health Schemas ───────────────────────────────────
class ReadinessCheckItem(BaseModel):
    id: str
    category: str # "Booking", "Passenger", "Seat", "Baggage", "Payment", "Check-in"
    title: str
    status: str # "COMPLETED", "ACTION_REQUIRED", "PENDING"
    description: str
    action_label: Optional[str] = None
    action_route: Optional[str] = None

class ReadinessScoreRequest(BaseModel):
    booking_id: Optional[int] = None
    has_seat_selected: bool = True
    passenger_details_complete: bool = True
    payment_confirmed: bool = True
    online_checkin_done: bool = False
    baggage_selected: bool = True

class ReadinessScoreResponse(BaseModel):
    readiness_percentage: int
    status_label: str
    checklist: List[ReadinessCheckItem]
    pre_flight_timeline: List[Dict[str, str]]
    next_action_advice: str

# ─── Fare Transparency Schemas ────────────────────────────────────────────────
class FareTransparencyRequest(BaseModel):
    flight_id: int
    base_fare: float
    passengers: int = 1
    selected_seat_price: float = 0.0
    extra_baggage: bool = False
    in_flight_meal: bool = False
    priority_boarding: bool = False

class FareComponent(BaseModel):
    name: str
    amount: float
    percentage: float
    explanation: str

class FareTransparencyResponse(BaseModel):
    grand_total: float
    components: List[FareComponent]
    fare_rules_summary: str
    cancellation_terms: str
    refundability_status: str

# ─── Disruption & Connection Risk Schemas ─────────────────────────────────────
class DisruptionRequest(BaseModel):
    flight_id: int
    delay_minutes: int = 0
    connection_time_minutes: Optional[int] = None
    scheduled_departure: Optional[str] = None

class DisruptionResponse(BaseModel):
    status: str
    headline: str
    impact_explanation: str
    connection_risk_level: str # "LOW", "MEDIUM", "HIGH", "NONE"
    remaining_connection_time: Optional[str] = None
    recommended_passenger_action: str
    overbooking_or_compensation_eligible: bool

# ─── Contextual "Ask The Booking" Schemas ─────────────────────────────────────
class AskBookingRequest(BaseModel):
    booking_id: int
    question: str
    pnr: Optional[str] = None
    flight_id: Optional[int] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    seat_code: Optional[str] = None
    total_price: Optional[float] = None
    date: Optional[str] = None

class AskBookingResponse(BaseModel):
    booking_id: int
    answer: str
    relevant_booking_fields: Dict[str, Any]
    confidence: float = 1.0

# ─── Admin Incident Explainer Schemas ─────────────────────────────────────────
class AdminIncidentRequest(BaseModel):
    service_name: str = "booking-service"
    http_5xx_count: int = 0
    db_pool_utilization_pct: float = 0.0
    avg_latency_ms: float = 0.0
    time_window: str = "Last 15 minutes"

class AdminIncidentResponse(BaseModel):
    service_name: str
    severity: str # "HEALTHY", "WARNING", "CRITICAL"
    potential_issue: str
    observed_evidence: List[str]
    suggested_engineering_investigation: List[str]
    disclaimer: str = "Observed telemetry correlation. Requires manual engineering confirmation."

# ─── Booking Error Explainer Schemas ──────────────────────────────────────────
class ErrorExplanationRequest(BaseModel):
    raw_status_code: int = 400
    raw_error_message: str
    failed_action: str = "seat_hold" # "seat_hold", "booking_create", "payment_capture"

class ErrorExplanationResponse(BaseModel):
    user_friendly_title: str
    possible_reason: str
    actionable_resolution: str
    can_retry: bool
