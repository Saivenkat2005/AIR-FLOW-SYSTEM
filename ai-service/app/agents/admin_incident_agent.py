from typing import List
from app.schemas.schemas_v3 import AdminIncidentRequest, AdminIncidentResponse

class AdminIncidentAgent:
    @staticmethod
    def analyze_incident(req: AdminIncidentRequest) -> AdminIncidentResponse:
        err_count = req.http_5xx_count
        pool_pct = req.db_pool_utilization_pct
        lat = req.avg_latency_ms

        evidence: List[str] = []
        investigations: List[str] = []

        if err_count == 0 and pool_pct < 80.0 and lat < 100.0:
            severity = "HEALTHY"
            issue = "All microservices operating normally with zero anomalous error spikes."
            evidence.append("HTTP 5xx rate: 0.00% across all API Gateway routes.")
            evidence.append(f"HikariCP connection pool utilization stable at {pool_pct}%.")
            evidence.append(f"P95 latency within threshold ({lat:.1f}ms).")
            investigations.append("No remediation needed. Mesh telemetry optimal.")
        elif pool_pct >= 80.0 or lat >= 250.0:
            severity = "WARNING"
            issue = f"Elevated latency observed on [{req.service_name}] correlated with database pool pressure."
            evidence.append(f"DB connection pool utilization reached {pool_pct}% in {req.time_window}.")
            evidence.append(f"Observed P95 response time elevated to {lat:.1f}ms.")
            investigations.append("Inspect long-running JPA queries on 'booking' or 'flight' tables.")
            investigations.append("Verify HikariCP maximumPoolSize configuration in application.properties.")
            investigations.append("Check Redis query cache hit rates to reduce direct database reads.")
        else:
            severity = "CRITICAL" if err_count > 10 else "WARNING"
            issue = f"HTTP 5xx error anomaly detected on upstream service [{req.service_name}]."
            evidence.append(f"{err_count} HTTP 5xx responses recorded in {req.time_window}.")
            evidence.append(f"Time correlation: Service logs indicate upstream timeout.")
            investigations.append("Inspect container health logs in Docker/Loki for stack traces.")
            investigations.append("Validate network connectivity between API Gateway and Core Spring Boot service.")
            investigations.append("Confirm MySQL container port 3306 ping availability.")

        return AdminIncidentResponse(
            service_name=req.service_name,
            severity=severity,
            potential_issue=issue,
            observed_evidence=evidence,
            suggested_engineering_investigation=investigations,
            disclaimer="Observed telemetry correlation. Requires manual engineering confirmation."
        )
