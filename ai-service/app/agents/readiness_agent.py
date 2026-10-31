from typing import List, Dict
from app.schemas.schemas_v3 import ReadinessScoreRequest, ReadinessScoreResponse, ReadinessCheckItem

class ReadinessAgent:
    @staticmethod
    def calculate_readiness(req: ReadinessScoreRequest) -> ReadinessScoreResponse:
        checklist: List[ReadinessCheckItem] = []
        score = 0
        total_weight = 100

        # 1. Booking Record
        checklist.append(ReadinessCheckItem(
            id="chk_booking",
            category="Booking",
            title="Flight Reservation Confirmed",
            status="COMPLETED",
            description="Verified flight corridor locked in Nexus global manifest.",
            action_label="View Itinerary",
            action_route="/viewBooking"
        ))
        score += 20

        # 2. Passenger Credentials
        if req.passenger_details_complete:
            checklist.append(ReadinessCheckItem(
                id="chk_passenger",
                category="Passenger",
                title="Passenger Profile Verified",
                status="COMPLETED",
                description="Government ID and traveler contact points verified.",
                action_label="Edit Profile",
                action_route="/myprofile"
            ))
            score += 20
        else:
            checklist.append(ReadinessCheckItem(
                id="chk_passenger",
                category="Passenger",
                title="Passenger Profile Incomplete",
                status="ACTION_REQUIRED",
                description="Contact phone number or traveler name is required.",
                action_label="Complete Profile",
                action_route="/myprofile"
            ))

        # 3. Seat Allocation
        if req.has_seat_selected:
            checklist.append(ReadinessCheckItem(
                id="chk_seat",
                category="Seat",
                title="Cabin Seat Selected & Held",
                status="COMPLETED",
                description="Seat locked with Redis concurrency protection.",
                action_label="Modify Seat",
                action_route="/seatTypes"
            ))
            score += 20
        else:
            checklist.append(ReadinessCheckItem(
                id="chk_seat",
                category="Seat",
                title="Seat Not Selected",
                status="ACTION_REQUIRED",
                description="Select your preferred window or aisle seat before flight.",
                action_label="Select Seat",
                action_route="/seatTypes"
            ))

        # 4. Baggage Checked
        if req.baggage_selected:
            checklist.append(ReadinessCheckItem(
                id="chk_baggage",
                category="Baggage",
                title="Baggage Allowance Verified",
                status="COMPLETED",
                description="15kg checked baggage + 7kg cabin baggage confirmed.",
                action_label="Add Extra Weight",
                action_route="/AddBooking"
            ))
            score += 20
        else:
            checklist.append(ReadinessCheckItem(
                id="chk_baggage",
                category="Baggage",
                title="Baggage Selection Pending",
                status="PENDING",
                description="Verify your luggage weight to avoid terminal excess fees.",
                action_label="Check Baggage",
                action_route="/AddBooking"
            ))

        # 5. Online Check-in
        if req.online_checkin_done:
            checklist.append(ReadinessCheckItem(
                id="chk_checkin",
                category="Check-in",
                title="Web Check-In Completed",
                status="COMPLETED",
                description="Digital boarding pass QR code issued.",
                action_label="View Pass",
                action_route="/success"
            ))
            score += 20
        else:
            checklist.append(ReadinessCheckItem(
                id="chk_checkin",
                category="Check-in",
                title="Web Check-In Pending",
                status="ACTION_REQUIRED",
                description="Web check-in opens 48 hours before departure. Complete for fast gate access.",
                action_label="Complete Check-In",
                action_route="/viewBooking"
            ))

        timeline = [
            {"timeframe": "48 Hours Before", "task": "Verify flight schedule & complete Web Check-In"},
            {"timeframe": "24 Hours Before", "task": "Review cabin baggage items & weigh checked luggage"},
            {"timeframe": "Travel Day (T-3h)", "task": "Arrive at terminal with Digital QR Boarding Pass"}
        ]

        if score >= 80:
            status_label = "Ready for Departure"
            advice = "Your travel preparation is in excellent shape! Proceed to download your digital boarding pass."
        elif score >= 60:
            status_label = "Action Required"
            advice = "Complete your pending seat selection or web check-in to ensure smooth airport transit."
        else:
            status_label = "Incomplete Preparation"
            advice = "Please review your passenger details and confirm your reservation."

        return ReadinessScoreResponse(
            readiness_percentage=score,
            status_label=status_label,
            checklist=checklist,
            pre_flight_timeline=timeline,
            next_action_advice=advice
        )
