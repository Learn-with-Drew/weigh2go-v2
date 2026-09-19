from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserGoal
from app.schemas import UserGoalResponse, UserGoalUpdate
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.get("", response_model=UserGoalResponse)
def get_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's goals."""
    goal = db.query(UserGoal).filter(UserGoal.user_id == current_user.id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goals not found",
        )
    
    return goal


@router.put("", response_model=UserGoalResponse)
def update_goals(
    goal_update: UserGoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's goals."""
    goal = db.query(UserGoal).filter(UserGoal.user_id == current_user.id).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goals not found",
        )
    
    if goal_update.daily_calorie_target is not None:
        goal.daily_calorie_target = goal_update.daily_calorie_target
    
    if goal_update.weight_unit is not None:
        if goal_update.weight_unit not in ["lbs", "kg"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Weight unit must be 'lbs' or 'kg'",
            )
        goal.weight_unit = goal_update.weight_unit
    
    db.commit()
    db.refresh(goal)
    return goal