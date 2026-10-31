from typing import Dict, Any, List, Optional

POLICY_DOCUMENTS = {
    "baggage": {
        "title": "Airline Nexus Baggage Regulations 2026",
        "cabin_allowance": "Economy: 1 piece up to 7 kg (max 55x35x25 cm). Business/First: Up to 10 kg (2 pieces).",
        "checked_allowance": "Economy: 15 kg included. Business: 25 kg. First Class: 35 kg.",
        "excess_rate": "₹400 per additional kg, pre-bookable online at ₹350/kg.",
        "prohibited_items": "Power banks, spare lithium batteries, and e-cigarettes must be carried in cabin baggage only."
    },
    "cancellation_and_refunds": {
        "title": "Fare Rules & Refund Schedule",
        "grace_period": "100% full refund with zero deduction if cancelled within 24 hours of booking.",
        "standard_terms": "Standard cancellation fee of ₹1,500 applies for cancellations made up to 2 hours prior to flight departure.",
        "refundable_fares": "Flexi and Business Class fares are 100% refundable with zero penalty.",
        "tat": "Refund credits are processed back to the original payment source within 3-5 business days."
    },
    "seat_allocation": {
        "title": "Seat Selection & Concurrency Hold Policy",
        "lock_duration": "Seats are held temporarily in Redis memory for 5 minutes during checkout to prevent double-booking.",
        "seat_types": "Window, Aisle, Middle, Extra Legroom (Emergency Exit rows), Front Section.",
        "pricing": "Standard Economy seats are free; Extra Legroom and Premium Front seats are available at nominal add-on fees."
    },
    "overbooking_protection": {
        "title": "Overbooking Resolution Protocol",
        "fair_seat_pledge": "In the rare event of overbooking, our automated governor identifies volunteers and immediately issues 150% flight credits plus free upgrade to the next flight."
    }
}

class GroundedKnowledgeEngine:
    @staticmethod
    def query(topic: str) -> Optional[Dict[str, Any]]:
        t = topic.lower()
        if "bag" in t or "luggage" in t:
            return POLICY_DOCUMENTS["baggage"]
        elif "cancel" in t or "refund" in t:
            return POLICY_DOCUMENTS["cancellation_and_refunds"]
        elif "seat" in t:
            return POLICY_DOCUMENTS["seat_allocation"]
        elif "overbook" in t or "bump" in t or "compensation" in t:
            return POLICY_DOCUMENTS["overbooking_protection"]
        return None

    @staticmethod
    def get_all_topics() -> List[str]:
        return list(POLICY_DOCUMENTS.keys())
