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


def test_get_dashboard_summary_empty(authenticated_client):
    """Test getting dashboard summary with no data."""
    response = authenticated_client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["date"] == str(date.today())
    assert data["total_calories_logged"] == 0
    assert data["daily_target"] == 2000  # Default
    assert data["calories_remaining"] == 2000
    assert data["weight_logged_today"] is None
    assert data["days_logged_weight_this_week"] == 0


def test_get_dashboard_summary_with_data(authenticated_client):
    """Test getting dashboard summary with food and weight data."""
    today = date.today()

    # Add food logs
    authenticated_client.post(
        "/api/food",
        json={"food_name": "Breakfast", "calories": 500, "logged_date": str(today)},
    )
    authenticated_client.post(
        "/api/food",
        json={"food_name": "Lunch", "calories": 700, "logged_date": str(today)},
    )

    # Add weight log
    authenticated_client.post(
        "/api/weight",
        json={"weight": 180.5, "logged_date": str(today)},
    )

    response = authenticated_client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_calories_logged"] == 1200
    assert data["calories_remaining"] == 800  # 2000 - 1200
    assert data["weight_logged_today"] == 180.5
    assert data["days_logged_weight_this_week"] == 1


def test_get_dashboard_summary_specific_date(authenticated_client):
    """Test getting dashboard summary for a specific date."""
    yesterday = date.today() - timedelta(days=1)

    # Add data for yesterday
    authenticated_client.post(
        "/api/food",
        json={"food_name": "Dinner", "calories": 800, "logged_date": str(yesterday)},
    )

    response = authenticated_client.get(f"/api/dashboard/summary?logged_date={yesterday}")
    assert response.status_code == 200
    data = response.json()
    assert data["date"] == str(yesterday)
    assert data["total_calories_logged"] == 800


def test_get_dashboard_summary_unauthenticated(client):
    """Test getting dashboard summary without authentication."""
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 401


def test_get_dashboard_summary_week_counter(authenticated_client):
    """Test days logged weight this week counter."""
    today = date.today()
    # Monday is 0, Sunday is 6
    week_start = today - timedelta(days=today.weekday())

    # Add weight logs for each day this week
    for i in range(3):
        authenticated_client.post(
            "/api/weight",
            json={"weight": 180.0 + i, "logged_date": str(week_start + timedelta(days=i))},
        )

    response = authenticated_client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    # Should count all weight logs from week start to today
    assert data["days_logged_weight_this_week"] >= 1


def test_get_dashboard_summary_exceeds_target(authenticated_client):
    """Test dashboard when calories exceed target."""
    today = date.today()

    # Update calorie target to 1000
    authenticated_client.put(
        "/api/goals",
        json={"daily_calorie_target": 1000},
    )

    # Add 1200 calories
    authenticated_client.post(
        "/api/food",
        json={"food_name": "Big Meal", "calories": 1200, "logged_date": str(today)},
    )

    response = authenticated_client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_calories_logged"] == 1200
    assert data["daily_target"] == 1000
    assert data["calories_remaining"] == -200  # Over by 200