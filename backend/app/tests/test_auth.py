import pytest


def test_register_success(client):
    """Test successful user registration."""
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data


def test_register_duplicate_email(client):
    """Test registration with duplicate email."""
    # First registration
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Second registration with same email
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "anotherpassword123"},
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


def test_login_success(client):
    """Test successful login."""
    # Register first
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Login
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_email(client):
    """Test login with invalid email."""
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "password123"},
    )
    assert response.status_code == 401


def test_login_invalid_password(client):
    """Test login with invalid password."""
    # Register first
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Try to login with wrong password
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword123"},
    )
    assert response.status_code == 401


def test_get_me_authenticated(client):
    """Test getting current user info when authenticated."""
    # Register
    register_response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Login
    login_response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Get current user
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"


def test_get_me_unauthenticated(client):
    """Test getting current user info when not authenticated."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_logout(client):
    """Test logout."""
    # Register and login
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "securepassword123"},
    )

    # Logout
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert "successfully" in response.json()["message"]