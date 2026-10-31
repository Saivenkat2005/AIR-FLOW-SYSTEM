from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SearchRequest(BaseModel):
    query: str = Field(..., description="Natural language search query")

class ExtractedFlightParams(BaseModel):
    source: Optional[str] = None
    destination: Optional[str] = None
    departure_period: Optional[str] = "ANY"
    max_price: Optional[float] = None
    checked_baggage: Optional[bool] = None
    passenger_count: Optional[int] = 1

class FlightItem(BaseModel):
    flightId: Optional[int] = None
    flightName: Optional[str] = None
    takeOffTime: Optional[str] = None
    arrivalTime: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    aircraftType: Optional[str] = None
    price: Optional[float] = 4850.0
    status: Optional[str] = "SCHEDULED"

class SearchResponse(BaseModel):
    query: str
    extracted_params: ExtractedFlightParams
    results: List[Dict[str, Any]]
    count: int
    source_provider: str = "deterministic-rule-engine"

class CompareRequest(BaseModel):
    flight_ids: List[int] = Field(..., min_length=2, max_length=4)

class FlightComparisonItem(BaseModel):
    flightId: int
    flightName: str
    route: str
    takeOffTime: str
    duration: str
    estimatedPrice: float
    baggageAllowance: str
    onTimeRating: str
    pros: List[str]

class CompareResponse(BaseModel):
    flights: List[FlightComparisonItem]
    best_value_flight_id: int
    recommendation_summary: str

class ExplainRequest(BaseModel):
    flightId: int
    origin: Optional[str] = None
    destination: Optional[str] = None
    takeOffTime: Optional[str] = None
    price: Optional[float] = None

class ExplainResponse(BaseModel):
    flightId: int
    suitability_score: int
    key_highlights: List[str]
    explanation: str
    baggage_summary: str
    cancellation_terms: str

class TripPlanRequest(BaseModel):
    flightId: int
    origin: str
    destination: str
    departureDate: Optional[str] = None
    takeOffTime: Optional[str] = None

class TripTimelineItem(BaseModel):
    time: str
    activity: str
    location: str
    tip: Optional[str] = None

class TripPlanResponse(BaseModel):
    flightId: int
    origin: str
    destination: str
    pre_flight_timeline: List[TripTimelineItem]
    destination_arrival_guide: List[str]
    local_transport_options: List[str]
    disclaimer: str = "AI travel assistance provided for advisory purposes. Not an automated booking."

class BaggageRequest(BaseModel):
    query: Optional[str] = None
    cabin_class: Optional[str] = "Economy"
    weight_kg: Optional[float] = None

class BaggageResponse(BaseModel):
    cabin_baggage_limit: str
    checked_baggage_limit: str
    is_compliant: bool
    excess_weight_kg: float
    estimated_excess_fee: float
    policy_summary: str

class FaqRequest(BaseModel):
    question: str

class FaqResponse(BaseModel):
    question: str
    answer: str
    matched_category: str
    confidence: float

class AssistantChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AssistantChatResponse(BaseModel):
    reply: str
    intent: str
    filters: Optional[Dict[str, Any]] = None
    flights: Optional[List[Dict[str, Any]]] = None
    safety_disclaimer: str = "AI operates under read-only safety boundary. No transactional mutations permitted."

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    provider: str
    java_backend_connected: bool
