from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from data.collectors import DEMO_COLLECTORS, whatsapp_digits
from models.card import Card
from models.review import Review
from models.trade import Trade, TradeItem
from models.user import User
from reputation import build_history
from schemas import ContactRead, TradeCreate, TradeHistoryRead, TradeRead

router = APIRouter(prefix="/api/trades", tags=["trades"])

TRADE_TTL = timedelta(hours=24)


def _demo_meta(collector: User) -> dict | None:
    """The demo metadata row for a collector, or None if they aren't tradeable yet.

    Only seeded demo collectors are tradeable for now (same rule as radar.get_match)."""
    return next(
        (d for d in DEMO_COLLECTORS if d["username"] == collector.username), None
    )


async def _resolve_card_ids(session: AsyncSession, codes: list[str]) -> list[int]:
    """Album codes (e.g. MEX2) → card ids, ignoring any code that doesn't exist."""
    if not codes:
        return []
    rows = (
        await session.execute(select(Card).where(Card.code.in_(codes)))
    ).scalars().all()
    return [card.id for card in rows]


@router.get("/", response_model=list[TradeHistoryRead])
async def list_trades(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The authenticated user's trade history, newest first — partner, cromo count,
    status and the rating they left for each trade."""
    return await build_history(session, user.id)


@router.post("/", response_model=TradeRead)
async def create_trade(
    payload: TradeCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Persist a proposed swap from the negotiation table.

    The initiator is the authenticated user; the receiver must be a tradeable demo
    collector. Card lists are album codes — each becomes a TradeItem tagged with who
    offers it. Starts as `pending`; PATCH /{id}/confirm seals it and reveals contact.
    """
    receiver = await session.get(User, payload.receiver_id)
    if receiver is None or _demo_meta(receiver) is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    i_offer_ids = await _resolve_card_ids(session, payload.i_offer)
    they_offer_ids = await _resolve_card_ids(session, payload.they_offer)
    if not i_offer_ids or not they_offer_ids:
        raise HTTPException(
            status_code=400,
            detail="Un intercambio necesita cromos de ambas partes.",
        )

    trade = Trade(
        initiator_id=user.id,
        receiver_id=receiver.id,
        status="pending",
        expires_at=datetime.utcnow() + TRADE_TTL,
    )
    session.add(trade)
    await session.flush()  # assign trade.id before creating items

    session.add_all(
        [TradeItem(trade_id=trade.id, card_id=cid, offered_by=user.id) for cid in i_offer_ids]
        + [TradeItem(trade_id=trade.id, card_id=cid, offered_by=receiver.id) for cid in they_offer_ids]
    )
    await session.commit()
    await session.refresh(trade)
    return trade


@router.get("/{trade_id}")
async def get_trade(trade_id: int, session: AsyncSession = Depends(get_session)):
    # TODO: return a single trade by id (reputation backend / PR-2)
    return {"message": f"GET /api/trades/{trade_id} — not yet implemented"}


@router.patch("/{trade_id}/confirm", response_model=ContactRead)
async def confirm_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Confirm a trade and reveal the partner's contact.

    Only the initiator can confirm. The counterparty (a demo collector) auto-accepts,
    so the trade goes straight to `confirmed`. Returns the partner contact the
    ContactUnlockedModal shows — by design it's only available after confirming.
    """
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    if trade.initiator_id != user.id:
        raise HTTPException(
            status_code=403, detail="No puedes confirmar este intercambio."
        )

    receiver = await session.get(User, trade.receiver_id)
    demo_meta = _demo_meta(receiver) if receiver else None
    if receiver is None or demo_meta is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    was_pending = trade.status == "pending"
    trade.status = "confirmed"
    session.add(trade)

    # Auto-review: the demo collector rates the user, seeding their reputation with
    # the collector's demo rating. Only on the pending→confirmed transition, and never
    # twice for the same trade (re-confirming is idempotent).
    if was_pending:
        existing = (await session.execute(
            select(Review).where(
                Review.trade_id == trade.id, Review.rater_id == receiver.id
            )
        )).scalars().first()
        if existing is None:
            session.add(Review(
                trade_id=trade.id,
                rater_id=receiver.id,
                ratee_id=user.id,
                rating=round(demo_meta["rating"]),
            ))

    await session.commit()

    return ContactRead(
        name=demo_meta["name"],
        phone=receiver.phone,
        whatsapp=whatsapp_digits(receiver.phone),
        rating=demo_meta["rating"],
    )
