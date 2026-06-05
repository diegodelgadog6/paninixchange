from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from matching import collector_meta, compute_match, copies_for
from models.card import Card, UserCard
from models.user import User
from schemas import MatchRead

router = APIRouter(prefix="/api/radar", tags=["radar"])


@router.get("/matches", response_model=list[MatchRead])
async def get_matches(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Ranked trade suggestions for the authenticated user.

    Crosses the user's live collection against every other registered collector:
      - they_offer: cards I'm missing (0 copies) that they have spare (>= 2)
      - i_offer:    cards they're missing (0 copies) that I have spare (>= 2)
    Keeps only mutually beneficial matches (both sides gain), ranked by compatibility.
    """
    cards = (
        await session.execute(select(Card).order_by(Card.number))
    ).scalars().all()

    my_copies = await copies_for(session, user.id)

    # Every other collector with an inventory, minus the user themselves.
    owner_ids = {
        uc.user_id
        for uc in (await session.execute(select(UserCard))).scalars().all()
    }
    owner_ids.discard(user.id)
    if not owner_ids:
        return []

    collectors = (
        await session.execute(select(User).where(User.id.in_(owner_ids)))
    ).scalars().all()

    # One pass over every collector's inventory, grouped per user.
    copies_by_user: dict[int, dict[int, int]] = {cid: {} for cid in owner_ids}
    for uc in (
        await session.execute(select(UserCard).where(UserCard.user_id.in_(owner_ids)))
    ).scalars().all():
        copies_by_user[uc.user_id][uc.card_id] = uc.copies

    matches: list[MatchRead] = []
    for collector in collectors:
        meta = await collector_meta(session, collector, user)
        match = compute_match(
            cards, my_copies, collector, meta, copies_by_user.get(collector.id, {})
        )
        if match is not None:
            matches.append(match)

    matches.sort(key=lambda m: m.compatibility, reverse=True)
    return matches


@router.get("/matches/{collector_id}", response_model=MatchRead)
async def get_match(
    collector_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The single trade suggestion between the authenticated user and one collector.

    Powers the negotiation table (the proposed swap is the same one the radar shows).
    A 404 is returned when no mutually beneficial trade exists between the two.
    """
    collector = await session.get(User, collector_id)
    if collector is None or collector.id == user.id:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    cards = (
        await session.execute(select(Card).order_by(Card.number))
    ).scalars().all()

    my_copies = await copies_for(session, user.id)
    their_copies = await copies_for(session, collector.id)

    meta = await collector_meta(session, collector, user)
    match = compute_match(cards, my_copies, collector, meta, their_copies)
    if match is None:
        raise HTTPException(
            status_code=404,
            detail="No hay un intercambio compatible con este coleccionista.",
        )
    return match
