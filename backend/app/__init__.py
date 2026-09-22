from app.core.config import Settings
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.api.routes import auth, weight, food, goals, dashboard
from app.api.dependencies import get_current_user

__all__ = [
    "Settings",
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_access_token",
    "auth",
    "weight",
    "food",
    "goals",
    "dashboard",
    "get_current_user",
]

"""Weigh2Go API Backend"""

"""Test suite for Weigh2Go API"""
