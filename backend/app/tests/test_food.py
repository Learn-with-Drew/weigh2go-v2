from datetime import date, timedelta
import pytest


@pytest.fixture
def authenticated_client(client):
    """Fixture to provide an authenticated test client."""
    # Register and login
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    return client


def test_create_weight_log(authenticated_client):
    """Test creating a weight log."""
    response = authenticated_client.post(
        "/api/weight",
        json={"weight": 180.5, "logged_date": str(date.today())},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["weight"] == 180.5
    assert data["logged_date"] == str(date.today())
    assert "id" in data


def test_create_weight_log_unauthenticated(client):
    """Test creating weight log without authentication."""
    response = client.post(
        "/api/weight",
        json={"weight": 180.5, "logged_date": str(date.today())},
    )
    assert response.status_code == 401


def test_update_weight_log_same_date(authenticated_client):
    """Test updating a weight log on the same date."""
    # First entry
    authenticated_client.post(
        "/api/weight",
        json={"weight": 180.5, "logged_date": str(date.today())},
    )

    # Second entry for same date should update
    response = authenticated_client.post(
        "/api/weight",
        json={"weight": 181.0, "logged_date": str(date.today())},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["weight"] == 181.0


def test_get_weight_logs(authenticated_client):
    """Test retrieving weight logs."""
    # Create multiple logs
    for i in range(3):
        authenticated_client.post(
            "/api/weight",
            json={"weight": 180.0 + i, "logged_date": str(date.today() - timedelta(days=i))},
        )

    response = authenticated_client.get("/api/weight")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_get_weight_logs_pagination(authenticated_client):
    """Test weight logs pagination."""
    # Create 5 logs
    for i in range(5):
        authenticated_client.post(
            "/api/weight",
            json={"weight": 180.0 + i, "logged_date": str(date.today() - timedelta(days=i))},
        )

    # Get with limit
    response = authenticated_client.get("/api/weight?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_weight_trend(authenticated_client):
    """Test getting weight trend data."""
    # Create logs over multiple days
    for i in range(10):
        authenticated_client.post(
            "/api/weight",
            json={"weight": 180.0 + i * 0.5, "logged_date": str(date.today() - timedelta(days=i))},
        )

    response = authenticated_client.get("/api/weight/trend?days=30")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all("date" in point and "average_weight" in point for point in data)


def test_delete_weight_log(authenticated_client):
    """Test deleting a weight log."""
    # Create a log
    create_response = authenticated_client.post(
        "/api/weight",
        json={"weight": 180.5, "logged_date": str(date.today())},
    )
    log_id = create_response.json()["id"]

    # Delete it
    response = authenticated_client.delete(f"/api/weight/{log_id}")
    assert response.status_code == 200
    assert "deleted" in response.json()["message"]

    # Verify it's gone
    get_response = authenticated_client.get("/api/weight")
    assert len(get_response.json()) == 0


def test_delete_weight_log_not_found(authenticated_client):
    """Test deleting a non-existent weight log."""
    response = authenticated_client.delete("/api/weight/nonexistent-id")
    assert response.status_code == 404