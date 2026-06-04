from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from deps import get_current_user
from models.user import User
from reputation import build_reputation
from schemas import ReputationRead, UserRead

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return current_user


@router.get("/me/reputation", response_model=ReputationRead)
async def get_my_reputation(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The authenticated user's reputation: rating, reviews, completed trades, points,
    level, earned badges and trade history — all derived from real data."""
    return await build_reputation(session, current_user.id)
