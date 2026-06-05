from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from models.user import User
from reputation import build_reputation
from schemas import ReputationRead, UserRead, UserUpdate
from security import hash_password

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update the authenticated user's profile fields (all optional)."""
    if data.username is not None:
        clash = (await session.execute(select(User).where(User.username == data.username))).scalars().first()
        if clash and clash.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ese nombre de usuario ya existe")
        current_user.username = data.username
    if data.email is not None:
        clash = (await session.execute(select(User).where(User.email == data.email))).scalars().first()
        if clash and clash.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ese correo ya está registrado")
        current_user.email = data.email
    if data.password is not None:
        current_user.hashed_password = hash_password(data.password)
    if data.phone is not None:
        current_user.phone = data.phone
    # location, lat and lng allow explicit null (to clear them), so check model_fields_set
    # rather than `is not None` — that distinguishes "omitted" from "set to null".
    if "location" in data.model_fields_set:
        current_user.location = data.location
    if "lat" in data.model_fields_set:
        current_user.lat = data.lat
    if "lng" in data.model_fields_set:
        current_user.lng = data.lng
    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user


@router.get("/me/reputation", response_model=ReputationRead)
async def get_my_reputation(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The authenticated user's reputation: rating, reviews, completed trades, points,
    level, earned badges and trade history — all derived from real data."""
    return await build_reputation(session, current_user.id)
