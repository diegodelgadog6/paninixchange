from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session

router = APIRouter(prefix="/api/trades", tags=["trades"])


@router.get("/")
async def list_trades(session: AsyncSession = Depends(get_session)):
    # TODO: list active trades for the authenticated user
    return {"message": "GET /api/trades — not yet implemented"}


@router.post("/")
async def create_trade(session: AsyncSession = Depends(get_session)):
    # TODO: create a new trade proposal
    return {"message": "POST /api/trades — not yet implemented"}


@router.get("/{trade_id}")
async def get_trade(trade_id: int, session: AsyncSession = Depends(get_session)):
    # TODO: return a single trade by id
    return {"message": f"GET /api/trades/{trade_id} — not yet implemented"}


@router.patch("/{trade_id}/confirm")
async def confirm_trade(trade_id: int, session: AsyncSession = Depends(get_session)):
    # TODO: confirm trade and reveal partner contact info
    return {"message": f"PATCH /api/trades/{trade_id}/confirm — not yet implemented"}
