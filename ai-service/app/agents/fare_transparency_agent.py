from typing import List
from app.schemas.schemas_v3 import FareTransparencyRequest, FareTransparencyResponse, FareComponent

class FareTransparencyAgent:
    @staticmethod
    def explain_fare(req: FareTransparencyRequest) -> FareTransparencyResponse:
        pax = max(1, req.passengers)
        base_total = req.base_fare * pax
        seat_fee = req.selected_seat_price * pax
        
        taxes_govt = round(base_total * 0.05, 2) # 5% GST
        airport_dev_fee = round(base_total * 0.07, 2) # 7% UDF/ADF
        
        extras_total = 0.0
        if req.extra_baggage:
            extras_total += 900.0 * pax
        if req.in_flight_meal:
            extras_total += 450.0 * pax
        if req.priority_boarding:
            extras_total += 350.0 * pax

        grand_total = base_total + seat_fee + taxes_govt + airport_dev_fee + extras_total

        components: List[FareComponent] = [
            FareComponent(
                name=f"Airline Base Fare ({pax} Passenger{'s' if pax > 1 else ''})",
                amount=base_total,
                percentage=round((base_total / grand_total) * 100, 1),
                explanation="Direct airline flight operating and fuel allocation."
            ),
            FareComponent(
                name="Aviation GST (Government Tax 5%)",
                amount=taxes_govt,
                percentage=round((taxes_govt / grand_total) * 100, 1),
                explanation="Statutory central goods and services tax."
            ),
            FareComponent(
                name="Airport User Development Fee (UDF 7%)",
                amount=airport_dev_fee,
                percentage=round((airport_dev_fee / grand_total) * 100, 1),
                explanation="Terminal maintenance, runway infrastructure, and security charges."
            )
        ]

        if seat_fee > 0:
            components.append(FareComponent(
                name="Selected Cabin Seat Tier",
                amount=seat_fee,
                percentage=round((seat_fee / grand_total) * 100, 1),
                explanation="Seat allocation reservation fee for selected cabin zone."
            ))

        if extras_total > 0:
            components.append(FareComponent(
                name="Travel Extras & In-Flight Add-Ons",
                amount=extras_total,
                percentage=round((extras_total / grand_total) * 100, 1),
                explanation="Add-on selections: Extra baggage, meals, and priority boarding."
            ))

        rules_summary = (
            f"Your total payable fare is ₹{grand_total:,.0f}. "
            f"Base airline charges constitute {round((base_total / grand_total) * 100)}% of the total, "
            f"while taxes and airport statutory levies account for {round(((taxes_govt + airport_dev_fee) / grand_total) * 100)}%."
        )

        return FareTransparencyResponse(
            grand_total=grand_total,
            components=components,
            fare_rules_summary=rules_summary,
            cancellation_terms="Free cancellation within 24 hours of booking. Standard ₹1,500 fee applies thereafter.",
            refundability_status="Partially Refundable (Taxes and airport charges 100% refundable)"
        )
