import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.providers.deterministic_provider import DeterministicProvider

client = TestClient(app)

def test_health_endpoints():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "UP"
    assert "provider" in data

    res_live = client.get("/health/live")
    assert res_live.status_code == 200

    res_ready = client.get("/health/ready")
    assert res_ready.status_code == 200

def test_deterministic_provider_parser():
    provider = DeterministicProvider()
    import asyncio
    res = asyncio.run(provider.parse_natural_language_search("Find me morning flights from Delhi to Mumbai under 5000"))
    assert res["source"] == "DEL"
    assert res["destination"] == "BOM"
    assert res["departure_period"] == "morning"
    assert res["max_price"] == 5000.0

def test_ai_assistant_endpoint():
    payload = {"message": "What is the checked baggage allowance?", "user_id": 3}
    res = client.post("/api/v1/ai/assistant", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "baggage" in data["reply"].lower() or "allowance" in data["reply"].lower()

def test_ai_search_endpoint():
    payload = {"query": "Find flight from New York to Los Angeles"}
    res = client.post("/api/v1/ai/search", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert "extracted_params" in data

def test_explain_flight_endpoint():
    payload = {
        "flightId": 1,
        "origin": "New York (JFK)",
        "destination": "Los Angeles (LAX)",
        "takeOffTime": "2026-07-04T08:00:00",
        "price": 4850
    }
    res = client.post("/api/v1/ai/explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["flightId"] == 1
    assert "suitability_score" in data
    assert "explanation" in data

def test_fare_transparency_endpoint():
    payload = {
        "flight_id": 1,
        "base_fare": 4850.0,
        "passengers": 1,
        "selected_seat_price": 450.0
    }
    res = client.post("/api/v1/ai/fare-transparency", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["grand_total"] >= 4850
    assert len(data["components"]) > 0

def test_trip_planner_endpoint():
    payload = {
        "flightId": 1,
        "origin": "New York (JFK)",
        "destination": "Los Angeles (LAX)",
        "departureDate": "2026-07-04",
        "takeOffTime": "08:00:00"
    }
    res = client.post("/api/v1/ai/trip-plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["flightId"] == 1
    assert len(data["pre_flight_timeline"]) > 0

def test_journey_health_engine():
    res = client.get("/api/v1/ai/journey-health/1")
    assert res.status_code == 200
    data = res.json()
    assert "score" in data
    assert "status" in data
    assert "checklist" in data

def test_ai_read_only_safety_guard():
    # Ensure AI service has no transactional mutation routes (no delete, no purchase)
    delete_res = client.delete("/api/v1/ai/booking")
    assert delete_res.status_code in [404, 405]
    put_res = client.put("/api/v1/ai/payment")
    assert put_res.status_code in [404, 405]
