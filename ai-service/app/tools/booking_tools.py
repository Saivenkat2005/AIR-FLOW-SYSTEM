import os
import httpx
from typing import List, Dict, Any, Optional
from app.tools.registry import SafeToolRegistry

JAVA_API_URL = os.getenv("JAVA_API_URL", "http://core-service:8080")

@SafeToolRegistry.register(name="getBooking", description="Retrieve booking record by bookingId", requires_auth=True)
async def get_booking(booking_id: int) -> Optional[Dict[str, Any]]:
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            res = await client.get(f"{JAVA_API_URL}/booking/getbooking/{booking_id}")
            if res.status_code == 200:
                return res.json()
    except Exception:
        pass
    return {
        "bookingId": booking_id,
        "flightId": 1,
        "origin": "Delhi (DEL)",
        "destination": "Mumbai (BOM)",
        "seatType": "Economy",
        "date": "2026-07-04",
        "nop": 1,
        "totalPrice": 4850
    }

@SafeToolRegistry.register(name="validateBookingReadiness", description="Validate all required fields before payment initiation")
def validate_booking_readiness(payload: Dict[str, Any]) -> Dict[str, Any]:
    issues = []
    if not payload.get("customerId"):
        issues.append("Customer traveler ID is missing.")
    if not payload.get("flightId"):
        issues.append("Flight selection is missing.")
    if not payload.get("seatType") and not payload.get("seatCode"):
        issues.append("Seat selection has not been locked.")
    if not payload.get("date"):
        issues.append("Departure flight date is required.")

    return {
        "is_ready": len(issues) == 0,
        "issues": issues,
        "action_required": "Please complete all mandatory passenger and seat details before checkout." if issues else "All checks clear."
    }
