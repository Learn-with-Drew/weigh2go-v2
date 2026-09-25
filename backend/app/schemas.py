from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr


class UserRegister(UserBase):
    """User registration schema."""

    password: str


class UserResponse(UserBase):
    """User response schema."""

    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserGoalUpdate(BaseModel):
    """User goal update schema."""

    daily_calorie_target: int | None = None
    weight_unit: str | None = None


class UserGoalResponse(BaseModel):
    """User goal response schema."""

    id: UUID
    user_id: UUID
    daily_calorie_target: int
    weight_unit: str

    model_config = ConfigDict(from_attributes=True)


class WeightLogCreate(BaseModel):
    """Weight log creation schema."""

    weight: float
    logged_date: date


class WeightLogResponse(BaseModel):
    """Weight log response schema."""

    id: UUID
    user_id: UUID
    weight: float
    logged_date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WeightTrendPoint(BaseModel):
    """Weight trend data point."""

    date: date
    average_weight: float
    entry_count: int


class FoodLogCreate(BaseModel):
    """Food log creation schema."""

    food_name: str
    calories: int
    logged_date: date


class FoodLogResponse(BaseModel):
    """Food log response schema."""

    id: UUID
    user_id: UUID
    food_name: str
    calories: int
    logged_date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardSummary(BaseModel):
    """Dashboard summary schema."""

    date: date
    total_calories_logged: int
    daily_target: int
    calories_remaining: int
    weight_logged_today: float | None
    days_logged_weight_this_week: int


class Token(BaseModel):
    """Token response schema."""

    access_token: str
    token_type: str