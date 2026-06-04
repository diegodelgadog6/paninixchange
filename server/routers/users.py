from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me")
async def get_me(session: AsyncSession = Depends(get_session)):
    # TODO: return authenticated user profile
    return {"message": "GET /api/users/me — not yet implemented"}
