from typing import List
from app.schemas.schemas import TripPlanRequest, TripPlanResponse, TripTimelineItem

class TripPlannerService:
    @staticmethod
    def generate_plan(req: TripPlanRequest) -> TripPlanResponse:
        origin = req.origin or "Delhi (DEL)"
        destination = req.destination or "Mumbai (BOM)"
        flight_id = req.flightId or 1

        timeline: List[TripTimelineItem] = [
            TripTimelineItem(
                time="T-3h 00m",
                activity="Airport Arrival & Terminal Entry",
                location=f"{origin} Terminal Gate",
                tip="Keep digital boarding pass QR & Government ID ready for biometrics/DigiYatra entry."
            ),
            TripTimelineItem(
                time="T-2h 00m",
                activity="Baggage Drop & Security Check",
                location="Nexus Dedicated Baggage Kiosk",
                tip="Check that power banks and laptops are placed in cabin baggage, not checked bags."
            ),
            TripTimelineItem(
                time="T-0h 45m",
                activity="Boarding Gate Opens",
                location="Departure Gate Lounge",
                tip="Boarding closes strictly 20 minutes prior to departure."
            ),
            TripTimelineItem(
                time="T+0h 00m",
                activity="Takeoff & In-Flight Service",
                location="Cabin Allocation",
                tip="Enjoy complimentary deli service and USB power charging."
            ),
            TripTimelineItem(
                time="T+2h 15m",
                activity="Arrival & Baggage Claim",
                location=f"{destination} Arrival Carousel",
                tip="Collect your verified bags from the highlighted belt."
            )
        ]

        arrival_guides = [
            f"Pre-paid airport express taxis available directly outside {destination} Arrival Hall.",
            "High-speed Airport Metro connection active every 10 minutes.",
            "Hotels in city center are approximately 30-45 minutes drive from terminal."
        ]

        transport_options = [
            "Official Terminal App-based Pickups (Uber / Ola / Rapido Dedicated Zone)",
            "Metro Rail Express Line (Direct city link)",
            "Pre-paid Government Radio Cabs (Counters inside terminal)"
        ]

        return TripPlanResponse(
            flightId=flight_id,
            origin=origin,
            destination=destination,
            pre_flight_timeline=timeline,
            destination_arrival_guide=arrival_guides,
            local_transport_options=transport_options,
            disclaimer="AI travel assistance provided for advisory purposes. Not an automated booking."
        )
