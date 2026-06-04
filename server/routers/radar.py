from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from models.card import Card, UserCard
from models.user import User
from data.collectors import DEMO_COLLECTORS
from schemas import MatchCollector, MatchRead, MatchSticker

router = APIRouter(prefix="/api/radar", tags=["radar"])


def _score_match(get: int, give: int) -> int:
    """Compatibility 0–100 for a potential trade. 0 when one-sided (only viable when
    BOTH sides gain); otherwise rewards balance and volume. Ported from the original
    client engine in src/data/matches.js so the UI numbers stay identical."""
    if get == 0 or give == 0:
        return 0
    balance = min(give, get) / max(give, get)  # 0..1 — how even the trade is
    volume = min(get, 20) / 20                  # 0..1 — capped how much I gain
    return round(40 + balance * 30 + volume * 30)


def _sticker(card: Card) -> MatchSticker:
    return MatchSticker(
        code=card.code,
        number=card.number,
        name=card.name,
        team=card.team,
        category=card.category,
        rarity=card.rarity,
    )


def _compute_match(
    cards: list[Card],
    my_copies: dict[int, int],
    collector: User,
    demo_meta: dict,
    their_copies: dict[int, int],
) -> MatchRead | None:
    """One ranked trade suggestion crossing my live collection against a collector's:
      - they_offer: cards I'm missing (0 copies) that they have spare (>= 2)
      - i_offer:    cards they're missing (0 copies) that I have spare (>= 2)
    Returns None when the trade isn't mutually beneficial (compatibility 0)."""
    they_offer: list[MatchSticker] = []
    i_offer: list[MatchSticker] = []
    gold_count = 0
    for card in cards:
        mine = my_copies.get(card.id, 0)
        theirs = their_copies.get(card.id, 0)
        if mine == 0 and theirs >= 2:
            they_offer.append(_sticker(card))
            if card.rarity != "base":
                gold_count += 1
        if theirs == 0 and mine >= 2:
            i_offer.append(_sticker(card))

    compatibility = _score_match(len(they_offer), len(i_offer))
    if compatibility == 0:
        return None

    return MatchRead(
        collector=MatchCollector(
            id=collector.id,
            username=collector.username,
            name=demo_meta["name"],
            distance_km=demo_meta["distance_km"],
            demo=True,
        ),
        they_offer=they_offer,
        i_offer=i_offer,
        gold_count=gold_count,
        compatibility=compatibility,
    )


@router.get("/matches", response_model=list[MatchRead])
async def get_matches(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Ranked trade suggestions for the authenticated user.

    Crosses the user's live collection against each demo collector's:
      - they_offer: cards I'm missing (0 copies) that they have spare (>= 2)
      - i_offer:    cards they're missing (0 copies) that I have spare (>= 2)
    Keeps only mutually beneficial matches (both sides gain), ranked by compatibility.
    """
    cards = (
        await session.execute(select(Card).order_by(Card.number))
    ).scalars().all()

    my_copies = {
        uc.card_id: uc.copies
        for uc in (
            await session.execute(select(UserCard).where(UserCard.user_id == user.id))
        ).scalars().all()
    }

    # Resolve the demo roster to real User rows (seeded on boot).
    usernames = [d["username"] for d in DEMO_COLLECTORS]
    demo_users = {
        u.username: u
        for u in (
            await session.execute(select(User).where(User.username.in_(usernames)))
        ).scalars().all()
    }

    # One query for every demo collector's inventory, grouped per user.
    demo_ids = [u.id for u in demo_users.values()]
    copies_by_user: dict[int, dict[int, int]] = {uid: {} for uid in demo_ids}
    if demo_ids:
        rows = (
            await session.execute(
                select(UserCard).where(UserCard.user_id.in_(demo_ids))
            )
        ).scalars().all()
        for uc in rows:
            copies_by_user[uc.user_id][uc.card_id] = uc.copies

    matches: list[MatchRead] = []
    for demo in DEMO_COLLECTORS:
        collector = demo_users.get(demo["username"])
        if collector is None:
            continue
        match = _compute_match(
            cards, my_copies, collector, demo, copies_by_user.get(collector.id, {})
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
    Only demo collectors are tradeable for now; a 404 is returned when the id isn't a
    demo collector or when no mutually beneficial trade exists between the two.
    """
    collector = await session.get(User, collector_id)
    if collector is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    demo_meta = next(
        (d for d in DEMO_COLLECTORS if d["username"] == collector.username), None
    )
    if demo_meta is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    cards = (
        await session.execute(select(Card).order_by(Card.number))
    ).scalars().all()

    my_copies = {
        uc.card_id: uc.copies
        for uc in (
            await session.execute(select(UserCard).where(UserCard.user_id == user.id))
        ).scalars().all()
    }

    their_copies = {
        uc.card_id: uc.copies
        for uc in (
            await session.execute(
                select(UserCard).where(UserCard.user_id == collector.id)
            )
        ).scalars().all()
    }

    match = _compute_match(cards, my_copies, collector, demo_meta, their_copies)
    if match is None:
        raise HTTPException(
            status_code=404,
            detail="No hay un intercambio compatible con este coleccionista.",
        )
    return match
