from datetime import date, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.database import get_db
from app.models import User, FoodLog, WeightLog, UserGoal
from app.schemas import DashboardSummary
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    logged_date: date = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard summary for a specific date (default: today)."""
    if not logged_date:
        logged_date = date.today()

    # Get user's daily calorie target
    goal = db.query(UserGoal).filter(UserGoal.user_id == current_user.id).first()
    daily_target = goal.daily_calorie_target if goal else 2000

    # Get total calories logged for the date
    total_calories = db.query(func.sum(FoodLog.calories)).filter(
        FoodLog.user_id == current_user.id,
        FoodLog.logged_date == logged_date,
    ).scalar() or 0

    # Get weight logged for the date
    weight_log = db.query(WeightLog).filter(
        WeightLog.user_id == current_user.id,
        WeightLog.logged_date == logged_date,
    ).first()

    # Count days weight was logged this week
    week_start = logged_date - timedelta(days=logged_date.weekday())  # Monday
    days_logged_weight = db.query(func.count(WeightLog.id)).filter(
        WeightLog.user_id == current_user.id,
        WeightLog.logged_date >= week_start,
        WeightLog.logged_date <= logged_date,
    ).scalar()

    return DashboardSummary(
        date=logged_date,
        total_calories_logged=int(total_calories),
        daily_target=daily_target,
        calories_remaining=daily_target - int(total_calories),
        weight_logged_today=weight_log.weight if weight_log else None,
        days_logged_weight_this_week=days_logged_weight,
    )