"""Shared FastAPI dependencies for authentication."""
import jwt
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models.user import User
from security import decode_access_token

# Bearer-token scheme (login returns JSON, so we don't use OAuth2 form flow).
# auto_error=False so a missing token yields our 401 below, not FastAPI's default 403.
bearer_scheme = HTTPBearer(auto_error=False)

_credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No autenticado",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    """Resolve the authenticated user from the `Authorization: Bearer` token."""
    if credentials is None:
        raise _credentials_error
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
    except jwt.PyJWTError:
        raise _credentials_error
    if user_id is None:
        raise _credentials_error

    user = await session.get(User, int(user_id))
    if user is None:
        raise _credentials_error
    return user
