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


def test_get_goals(authenticated_client):
    """Test retrieving user goals."""
    response = authenticated_client.get("/api/goals")
    assert response.status_code == 200
    data = response.json()
    assert data["daily_calorie_target"] == 2000  # Default
    assert data["weight_unit"] == "lbs"  # Default


def test_get_goals_unauthenticated(client):
    """Test getting goals without authentication."""
    response = client.get("/api/goals")
    assert response.status_code == 401


def test_update_daily_calorie_target(authenticated_client):
    """Test updating daily calorie target."""
    response = authenticated_client.put(
        "/api/goals",
        json={"daily_calorie_target": 2500},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["daily_calorie_target"] == 2500


def test_update_weight_unit(authenticated_client):
    """Test updating weight unit."""
    response = authenticated_client.put(
        "/api/goals",
        json={"weight_unit": "kg"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["weight_unit"] == "kg"


def test_update_both_fields(authenticated_client):
    """Test updating both calorie target and weight unit."""
    response = authenticated_client.put(
        "/api/goals",
        json={"daily_calorie_target": 2200, "weight_unit": "kg"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["daily_calorie_target"] == 2200
    assert data["weight_unit"] == "kg"


def test_update_invalid_weight_unit(authenticated_client):
    """Test updating with invalid weight unit."""
    response = authenticated_client.put(
        "/api/goals",
        json={"weight_unit": "stones"},
    )
    assert response.status_code == 400
    assert "must be 'lbs' or 'kg'" in response.json()["detail"]


def test_update_partial_fields(authenticated_client):
    """Test updating only one field leaves other unchanged."""
    # Set initial values
    authenticated_client.put(
        "/api/goals",
        json={"daily_calorie_target": 2300, "weight_unit": "kg"},
    )

    # Update only calories
    response = authenticated_client.put(
        "/api/goals",
        json={"daily_calorie_target": 2400},
    )
    data = response.json()
    assert data["daily_calorie_target"] == 2400
    assert data["weight_unit"] == "kg"  # Should remain unchanged