from typing import Dict, Any
from app.tools.registry import SafeToolRegistry

@SafeToolRegistry.register(name="getBaggageRules", description="Retrieve official airline baggage allowance policies")
def get_baggage_rules(cabin_class: str = "Economy") -> Dict[str, Any]:
    c = cabin_class.title()
    if "First" in c:
        return {"cabin_kg": 10, "cabin_pieces": 2, "checked_kg": 35, "excess_per_kg_inr": 400}
    elif "Business" in c:
        return {"cabin_kg": 10, "cabin_pieces": 1, "checked_kg": 25, "excess_per_kg_inr": 400}
    return {"cabin_kg": 7, "cabin_pieces": 1, "checked_kg": 15, "excess_per_kg_inr": 400}

@SafeToolRegistry.register(name="getCancellationRules", description="Retrieve official cancellation and refund policies")
def get_cancellation_rules(cabin_class: str = "Economy") -> Dict[str, Any]:
    return {
        "free_cancellation_window_hours": 24,
        "standard_deduction_inr": 1500 if "Economy" in cabin_class else 0,
        "refund_processing_days": "3-5 business days to original payment method",
        "overbooking_policy": "150% flight credit voucher + complimentary cabin upgrade"
    }

@SafeToolRegistry.register(name="getOverbookingRules", description="Retrieve overbooking resolution and volunteer compensation terms")
def get_overbooking_rules() -> Dict[str, Any]:
    return {
        "policy": "Nexus 2.0 Fair-Seat Policy",
        "compensation_voucher_pct": 150,
        "alternative_flight": "Free rebooking on next scheduled departure",
        "lounge_access": "Complimentary Executive Lounge pass included"
    }
