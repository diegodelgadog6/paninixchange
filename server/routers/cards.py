from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("/album")
async def get_album(session: AsyncSession = Depends(get_session)):
    # TODO: return full 994-card album with per-user copy counts
    return {"message": "GET /api/cards/album — not yet implemented"}


@router.patch("/album/{card_code}")
async def update_card_copies(card_code: str, session: AsyncSession = Depends(get_session)):
    # TODO: increment or decrement copies for a card in the user's collection
    return {"message": f"PATCH /api/cards/album/{card_code} — not yet implemented"}
