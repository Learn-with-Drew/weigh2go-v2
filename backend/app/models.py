import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, Integer, Date, DateTime, ForeignKey, UniqueConstraint

from app.database import Base, GUID


class User(Base):
    """User model."""

    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserGoal(Base):
    """User goal/settings model."""

    __tablename__ = "user_goals"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False, unique=True)
    daily_calorie_target = Column(Integer, default=2000)
    weight_unit = Column(String(3), default="lbs")  # lbs or kg
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WeightLog(Base):
    """Weight log model."""

    __tablename__ = "weight_logs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False, index=True)
    weight = Column(Float, nullable=False)
    logged_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("user_id", "logged_date", name="unique_user_date_weight"),
    )


class FoodLog(Base):
    """Food/calorie log model."""

    __tablename__ = "food_logs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False, index=True)
    food_name = Column(String(255), nullable=False)
    calories = Column(Integer, nullable=False)
    logged_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)