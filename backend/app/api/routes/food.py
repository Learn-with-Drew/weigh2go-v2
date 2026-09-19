from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, FoodLog
from app.schemas import FoodLogCreate, FoodLogResponse
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/api/food", tags=["food"])


@router.post("", response_model=FoodLogResponse)
def create_food_log(
    food_data: FoodLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new food log for the current user."""
    new_log = FoodLog(
        user_id=current_user.id,
        food_name=food_data.food_name,
        calories=food_data.calories,
        logged_date=food_data.logged_date,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("", response_model=List[FoodLogResponse])
def get_food_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    logged_date: date | None = None,
    skip: int = 0,
    limit: int = 100,
):
    """Get food logs for the current user, optionally filtered by date."""
    query = db.query(FoodLog).filter(FoodLog.user_id == current_user.id)
    
    if logged_date:
        query = query.filter(FoodLog.logged_date == logged_date)
    
    logs = query.order_by(FoodLog.logged_date.desc(), FoodLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs


@router.delete("/{log_id}")
def delete_food_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a food log by ID."""
    log = db.query(FoodLog).filter(
        FoodLog.id == log_id,
        FoodLog.user_id == current_user.id,
    ).first()

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food log not found",
        )

    db.delete(log)
    db.commit()
    return {"message": "Food log deleted"}