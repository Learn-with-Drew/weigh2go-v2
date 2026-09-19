from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, WeightLog
from app.schemas import WeightLogCreate, WeightLogResponse, WeightTrendPoint
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/api/weight", tags=["weight"])


@router.post("", response_model=WeightLogResponse)
def create_weight_log(
    weight_data: WeightLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new weight log for the current user."""
    # Check if a weight log already exists for this date
    existing_log = db.query(WeightLog).filter(
        WeightLog.user_id == current_user.id,
        WeightLog.logged_date == weight_data.logged_date,
    ).first()
    
    if existing_log:
        # Update existing log
        existing_log.weight = weight_data.weight
        db.commit()
        db.refresh(existing_log)
        return existing_log

    # Create new log
    new_log = WeightLog(
        user_id=current_user.id,
        weight=weight_data.weight,
        logged_date=weight_data.logged_date,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("", response_model=List[WeightLogResponse])
def get_weight_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Get all weight logs for the current user."""
    logs = db.query(WeightLog).filter(
        WeightLog.user_id == current_user.id
    ).order_by(WeightLog.logged_date.desc()).offset(skip).limit(limit).all()
    return logs


@router.get("/trend", response_model=List[WeightTrendPoint])
def get_weight_trend(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = 30,
):
    """Get weight trend data over the last N days."""
    start_date = date.today() - timedelta(days=days)

    trend_data = db.query(
        WeightLog.logged_date,
        func.avg(WeightLog.weight).label("average_weight"),
        func.count(WeightLog.id).label("entry_count"),
    ).filter(
        WeightLog.user_id == current_user.id,
        WeightLog.logged_date >= start_date,
    ).group_by(WeightLog.logged_date).order_by(WeightLog.logged_date).all()

    return [
        WeightTrendPoint(
            date=row.logged_date,
            average_weight=float(row.average_weight),
            entry_count=row.entry_count,
        )
        for row in trend_data
    ]


@router.delete("/{log_id}")
def delete_weight_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a weight log by ID."""
    log = db.query(WeightLog).filter(
        WeightLog.id == log_id,
        WeightLog.user_id == current_user.id,
    ).first()

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Weight log not found",
        )

    db.delete(log)
    db.commit()
    return {"message": "Weight log deleted"}