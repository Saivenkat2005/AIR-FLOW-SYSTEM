from app.schemas.schemas import BaggageRequest, BaggageResponse

class BaggageService:
    @staticmethod
    def calculate_baggage(req: BaggageRequest) -> BaggageResponse:
        cabin_class = (req.cabin_class or "Economy").title()
        weight = req.weight_kg or 15.0

        if cabin_class == "First Class":
            checked_limit = 35.0
            cabin_limit = "10 kg (2 pieces)"
        elif cabin_class == "Business":
            checked_limit = 25.0
            cabin_limit = "10 kg (1 piece)"
        else: # Economy
            checked_limit = 15.0
            cabin_limit = "7 kg (1 piece)"

        excess_weight = max(0.0, weight - checked_limit)
        excess_fee = excess_weight * 400.0 # ₹400 per kg excess

        is_compliant = excess_weight == 0.0

        summary = (
            f"Your ticket in {cabin_class} includes {checked_limit}kg checked baggage and {cabin_limit} cabin baggage. "
        )
        if is_compliant:
            summary += f"Your planned baggage ({weight}kg) is fully compliant with zero excess charges."
        else:
            summary += f"Your planned baggage ({weight}kg) exceeds the allowance by {excess_weight:.1f}kg. Estimated excess fee is ₹{excess_fee:,.0f}."

        return BaggageResponse(
            cabin_baggage_limit=cabin_limit,
            checked_baggage_limit=f"{checked_limit} kg",
            is_compliant=is_compliant,
            excess_weight_kg=excess_weight,
            estimated_excess_fee=excess_fee,
            policy_summary=summary
        )
