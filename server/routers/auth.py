from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from models.user import User
from schemas import LoginRequest, Token, UserCreate, UserRead
from security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, session: AsyncSession = Depends(get_session)):
    """Create a new collector account."""
    existing = await session.execute(
        select(User).where(
            (User.username == data.username) | (User.email == data.email)
        )
    )
    conflict = existing.scalars().first()
    if conflict is not None:
        field = "usuario" if conflict.username == data.username else "correo"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ese {field} ya está registrado",
        )

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(data: LoginRequest, session: AsyncSession = Depends(get_session)):
    """Authenticate by email + password and return an access token."""
    result = await session.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if user is None or not verify_password(data.password, user.hashed_password):
        # Generic message: don't reveal whether the email exists.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    token = create_access_token(subject=user.id)
    return Token(access_token=token)
