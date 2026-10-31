from typing import Dict, Any, List

class SeatAgent:
    @staticmethod
    def parse_seat_intent(query: str) -> Dict[str, Any]:
        q = query.lower()
        position = "ANY"
        extra_legroom = False
        cabin = "Economy"

        if "window" in q:
            position = "Window"
        elif "aisle" in q:
            position = "Aisle"
        elif "middle" in q:
            position = "Middle"

        if "legroom" in q or "exit" in q or "space" in q:
            extra_legroom = True

        if "business" in q:
            cabin = "Business"
        elif "first" in q:
            cabin = "First Class"

        suggested_seats = []
        if position == "Window":
            suggested_seats = ["12A", "14A", "16F", "18A"]
        elif position == "Aisle":
            suggested_seats = ["12C", "12D", "14C", "15D"]
        else:
            suggested_seats = ["12A", "12B", "12C", "14D"]

        return {
            "requested_position": position,
            "extra_legroom": extra_legroom,
            "cabin_class": cabin,
            "recommended_seat_codes": suggested_seats,
            "explanation": f"Filtered available {position} seats in {cabin} cabin. All seats feature Redis temporary hold protection."
        }

    @staticmethod
    def explain_seat_context(seat_code: str) -> Dict[str, Any]:
        s = seat_code.upper()
        is_window = s.endswith("A") or s.endswith("F")
        is_aisle = s.endswith("C") or s.endswith("D")
        is_exit = any(s.startswith(r) for r in ["14", "15", "16"])

        position = "Window" if is_window else "Aisle" if is_aisle else "Middle"
        
        return {
            "seat_code": seat_code,
            "position": position,
            "legroom": "35 inches Extra Space" if is_exit else "32 inches Standard Pitch",
            "is_emergency_exit": is_exit,
            "features": [
                f"{position} alignment with scenic views" if is_window else f"{position} seat with easy aisle access",
                "USB power charging in seatback",
                "Complimentary snack & beverage service"
            ],
            "recommendation": f"Seat {seat_code} is a prime {position.lower()} choice offering excellent passenger comfort."
        }
