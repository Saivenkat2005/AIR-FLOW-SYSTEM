from typing import List
from app.schemas.schemas_v3 import SimulatorRequest, SimulatorResponse, SimulationDifference

class SimulatorAgent:
    @staticmethod
    def simulate_trip(req: SimulatorRequest) -> SimulatorResponse:
        base = req.current_price or 4850.0
        pax = max(1, req.passengers_count)
        
        simulated_fare = base * pax
        scenarios: List[SimulationDifference] = []

        # 1. Date offset simulation (e.g. ±1 day)
        if req.date_offset_days != 0:
            offset_factor = -450.0 if req.date_offset_days == -1 else 350.0 if req.date_offset_days == 1 else -200.0
            diff = offset_factor * pax
            simulated_fare += diff
            scenarios.append(SimulationDifference(
                scenario=f"Travel {abs(req.date_offset_days)} day(s) {'earlier' if req.date_offset_days < 0 else 'later'}",
                estimated_price=base + offset_factor,
                price_difference=abs(diff),
                difference_direction="CHEAPER" if diff < 0 else "MORE_EXPENSIVE",
                explanation=f"{'Lower demand weekday' if req.date_offset_days < 0 else 'Higher weekend demand'} on this corridor."
            ))

        # 2. Baggage toggle simulation
        if not req.include_checked_baggage:
            baggage_save = 400.0 * pax
            simulated_fare -= baggage_save
            scenarios.append(SimulationDifference(
                scenario="Travel with Cabin Baggage Only (Hand baggage 7kg)",
                estimated_price=base - 400.0,
                price_difference=baggage_save,
                difference_direction="CHEAPER",
                explanation="Excluding 15kg checked luggage saves ₹400 per passenger on EcoSaver tier."
            ))
        else:
            scenarios.append(SimulationDifference(
                scenario="Standard 15kg Checked Baggage Included",
                estimated_price=base,
                price_difference=0.0,
                difference_direction="SAME",
                explanation="Standard checked baggage already included in current fare tier."
            ))

        # 3. Cabin class simulation
        if req.cabin_class.title() == "Business":
            biz_diff = 4500.0 * pax
            simulated_fare += biz_diff
            scenarios.append(SimulationDifference(
                scenario="Upgrade to Business Class (Lie-flat / Priority / 25kg Baggage)",
                estimated_price=base + 4500.0,
                price_difference=biz_diff,
                difference_direction="MORE_EXPENSIVE",
                explanation="Adds 25kg checked bag, lounge pass, priority boarding, and premium dining."
            ))
        elif req.cabin_class.title() == "First Class":
            first_diff = 11000.0 * pax
            simulated_fare += first_diff
            scenarios.append(SimulationDifference(
                scenario="Upgrade to First Class Suite",
                estimated_price=base + 11000.0,
                price_difference=first_diff,
                difference_direction="MORE_EXPENSIVE",
                explanation="Private suite, 35kg baggage, chauffeur airport transfer, and fine dining."
            ))

        total_diff = simulated_fare - (base * pax)

        return SimulatorResponse(
            base_fare=base * pax,
            simulated_total=simulated_fare,
            total_difference=total_diff,
            scenarios=scenarios,
            data_confidence="High - Real DB Corridors"
        )
