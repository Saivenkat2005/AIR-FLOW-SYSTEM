import re
from typing import Dict, Any, Optional
from app.providers.base import BaseAiProvider

AIRPORT_LOOKUP = {
    "hyd": ("HYD", "Hyderabad"),
    "hyderabad": ("HYD", "Hyderabad"),
    "del": ("DEL", "Delhi"),
    "delhi": ("HYD", "Delhi") if False else ("DEL", "Delhi"),
    "new delhi": ("DEL", "Delhi"),
    "bom": ("BOM", "Mumbai"),
    "mumbai": ("BOM", "Mumbai"),
    "bombay": ("BOM", "Mumbai"),
    "blr": ("BLR", "Bangalore"),
    "bangalore": ("BLR", "Bangalore"),
    "bengaluru": ("BLR", "Bangalore"),
    "ccu": ("CCU", "Kolkata"),
    "kolkata": ("CCU", "Kolkata"),
    "calcutta": ("CCU", "Kolkata"),
    "maa": ("MAA", "Chennai"),
    "chennai": ("MAA", "Chennai"),
    "madras": ("MAA", "Chennai"),
    "jfk": ("JFK", "New York"),
    "new york": ("JFK", "New York"),
    "lax": ("LAX", "Los Angeles"),
    "los angeles": ("LAX", "Los Angeles"),
    "lhr": ("LHR", "London"),
    "london": ("LHR", "London"),
}

class DeterministicProvider(BaseAiProvider):
    async def is_available(self) -> bool:
        return True

    async def parse_natural_language_search(self, query: str) -> Dict[str, Any]:
        q = query.lower()
        extracted = {
            "source": None,
            "destination": None,
            "departure_period": "ANY",
            "max_price": None,
            "checked_baggage": True if ("checked" in q or "bag" in q or "luggage" in q) else None,
            "passenger_count": 1
        }

        # 1. Parse Origin and Destination from "from X to Y" patterns
        from_to_match = re.search(r'from\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+under|\s+below|\s+with|\s+in|\s*$)', q)
        if from_to_match:
            raw_from = from_to_match.group(1).strip()
            raw_to = from_to_match.group(2).strip()
            for key, (code, city) in AIRPORT_LOOKUP.items():
                if key in raw_from:
                    extracted["source"] = code
                if key in raw_to:
                    extracted["destination"] = code

        # Direct token scan if not found via regex
        if not extracted["source"] or not extracted["destination"]:
            found_airports = []
            for word, (code, city) in AIRPORT_LOOKUP.items():
                if re.search(r'\b' + re.escape(word) + r'\b', q):
                    if code not in [a[0] for a in found_airports]:
                        found_airports.append((code, city))
            
            if len(found_airports) >= 2:
                if not extracted["source"]:
                    extracted["source"] = found_airports[0][0]
                if not extracted["destination"]:
                    extracted["destination"] = found_airports[1][0]
            elif len(found_airports) == 1:
                if "to " in q or "destination" in q:
                    extracted["destination"] = found_airports[0][0]
                else:
                    extracted["source"] = found_airports[0][0]

        # 2. Time period preferences
        if "morning" in q or "early" in q or "am" in q:
            extracted["departure_period"] = "morning"
        elif "afternoon" in q or "noon" in q:
            extracted["departure_period"] = "afternoon"
        elif "evening" in q or "night" in q or "pm" in q:
            extracted["departure_period"] = "evening"

        # 3. Maximum Price Ceiling
        price_match = re.search(r'(?:under|below|max|less than|within|₹|\bRs\.?|\binr)\s*[:]?\s*(\d{3,6})', q, re.IGNORECASE)
        if price_match:
            extracted["max_price"] = float(price_match.group(1))

        # 4. Passenger Count
        pax_match = re.search(r'(\d+)\s*(?:passenger|passengers|seats|people|pax|adults)', q)
        if pax_match:
            extracted["passenger_count"] = int(pax_match.group(1))

        return extracted

    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        q = prompt.lower()
        if "baggage" in q or "luggage" in q or "carry" in q:
            return (
                "✈️ **Airline Nexus Baggage Allowances:**\n"
                "• **Cabin Baggage**: 1 piece up to 7 kg (max dimensions 55x35x25 cm).\n"
                "• **Checked Baggage**: 15 kg included in Economy Class, 25 kg in Business, 35 kg in First Class.\n"
                "• **Additional Allowance**: ₹400 per additional 5 kg booked before departure."
            )
        elif "cancel" in q or "refund" in q:
            return (
                "🛡️ **Cancellation & Refund Policy:**\n"
                "• Free cancellation within 24 hours of reservation.\n"
                "• Standard Economy: ₹1,500 cancellation fee up to 2 hours before takeoff.\n"
                "• Business/First Class: Full refund with zero deduction."
            )
        elif "compensation" in q or "overbook" in q or "bump" in q:
            return (
                "⚖️ **Overbooking Resolution & Compensation Engine:**\n"
                "Under Nexus Fair-Flight Protection, if a flight is overbooked, passengers voluntarily bumped receive "
                "an instant 150% flight credit voucher + complimentary lounge pass, or a free upgrade to the next flight."
            )
        elif "check-in" in q or "boarding" in q:
            return (
                "🎫 **Web Check-In & Boarding Passes:**\n"
                "Web check-in opens 48 hours before scheduled departure. Digital QR boarding passes can be saved, printed, "
                "or loaded directly to mobile wallets."
            )
        return (
            f"I have parsed your aviation inquiry regarding '{prompt}'. "
            "You can explore live flights in the catalog or specify origin/destination to view verified seat availability."
        )
