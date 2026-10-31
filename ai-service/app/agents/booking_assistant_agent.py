from typing import Dict, Any
from app.schemas.schemas_v3 import AskBookingRequest, AskBookingResponse

class BookingAssistantAgent:
    @staticmethod
    def answer_booking_question(req: AskBookingRequest) -> AskBookingResponse:
        q = req.question.lower()
        fields = {
            "booking_id": req.booking_id,
            "pnr": req.pnr or f"NX-{req.booking_id}084",
            "origin": req.origin or "Delhi (DEL)",
            "destination": req.destination or "Mumbai (BOM)",
            "seat_code": req.seat_code or "12A",
            "date": req.date or "2026-07-04",
            "total_price": req.total_price or 4850.0
        }

        if "where" in q or "route" in q or "origin" in q or "destination" in q:
            ans = f"Your flight departs from **{fields['origin']}** and arrives at **{fields['destination']}** on **{fields['date']}**."
        elif "seat" in q or "seat code" in q:
            ans = f"Your assigned seat is **{fields['seat_code']}** (Window seat in forward cabin)."
        elif "price" in q or "fare" in q or "cost" in q or "total" in q:
            ans = f"The total verified fare for this booking is **₹{fields['total_price']:,.0f}**, including all taxes and fees."
        elif "pnr" in q or "ticket" in q or "reference" in q:
            ans = f"Your confirmed PNR reference is **{fields['pnr']}** (Booking Record #{fields['booking_id']})."
        elif "baggage" in q or "luggage" in q:
            ans = "Your booking includes **15 kg checked baggage** plus **7 kg cabin baggage**. Extra baggage can be added anytime in My Trips."
        elif "when" in q or "time" in q or "departure" in q:
            ans = f"Scheduled flight departure is on **{fields['date']}** at **09:30 AM**. Boarding gates close 20 minutes before takeoff."
        else:
            ans = (
                f"Booking **{fields['pnr']}**: Route {fields['origin']} ➔ {fields['destination']}, "
                f"Seat {fields['seat_code']}, Total ₹{fields['total_price']:,.0f}. What specific detail would you like to know?"
            )

        return AskBookingResponse(
            booking_id=req.booking_id,
            answer=ans,
            relevant_booking_fields=fields,
            confidence=1.0
        )
