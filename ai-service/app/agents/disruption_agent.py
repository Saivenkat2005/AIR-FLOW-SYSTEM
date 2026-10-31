from typing import Optional
from app.schemas.schemas_v3 import DisruptionRequest, DisruptionResponse

class DisruptionAgent:
    @staticmethod
    def analyze_disruption(req: DisruptionRequest) -> DisruptionResponse:
        delay = req.delay_minutes
        conn_time = req.connection_time_minutes

        if delay == 0:
            return DisruptionResponse(
                status="ON_SCHEDULE",
                headline="Flight Operating on Schedule",
                impact_explanation="Aircraft is on-time with confirmed gate allocation and clear runway slot.",
                connection_risk_level="NONE",
                remaining_connection_time=f"{conn_time} mins" if conn_time else None,
                recommended_passenger_action="Proceed to departure gate 45 minutes prior to scheduled takeoff.",
                overbooking_or_compensation_eligible=False
            )

        if conn_time:
            remaining = max(0, conn_time - delay)
            if remaining < 30:
                risk = "HIGH"
                action = "Connection at critical risk. Proceed to Nexus Transit Service Desk upon landing for express transfer."
            elif remaining < 60:
                risk = "MEDIUM"
                action = "Tight connection window. Use terminal transit shuttle immediately after deplaning."
            else:
                risk = "LOW"
                action = "Sufficient connection buffer remains. No itinerary modification required."
        else:
            risk = "NONE"
            remaining = None
            action = "Please monitor boarding gates for updated announcement."

        eligible = delay >= 120 # 2+ hour delay triggers compensation eligibility

        headline = f"Flight Delayed by {delay} Minutes" if delay < 120 else f"Major Schedule Adjustment (+{delay} mins)"
        explanation = (
            f"Scheduled departure adjusted. Your flight is currently expected to depart with a {delay}-minute delay "
            f"due to airspace traffic flow management."
        )

        return DisruptionResponse(
            status="DELAYED",
            headline=headline,
            impact_explanation=explanation,
            connection_risk_level=risk,
            remaining_connection_time=f"{remaining} mins" if remaining is not None else None,
            recommended_passenger_action=action,
            overbooking_or_compensation_eligible=eligible
        )
