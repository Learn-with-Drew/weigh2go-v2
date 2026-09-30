from typing import Generator, Optional

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.core.security import decode_access_token


def get_token_from_cookie(request: Request) -> Optional[str]:
    """Extract the access token from the request's cookies."""
    return request.cookies.get("access_token")


def get_current_user(
    token: Optional[str] = Depends(get_token_from_cookie),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token in cookie."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user