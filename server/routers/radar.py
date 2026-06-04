from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter(prefix="/api/radar", tags=["radar"])


@router.get("/")
async def get_radar(session: AsyncSession = Depends(get_session)):
    # TODO: return nearby collectors within radius
    # query params: lat, lng, radius_km
    return {"message": "GET /api/radar — not yet implemented"}


@router.get("/matches")
async def get_matches(session: AsyncSession = Depends(get_session)):
    # TODO: run server-side matching engine, return ranked suggestions
    return {"message": "GET /api/radar/matches — not yet implemented"}
