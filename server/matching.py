"""Trade matching, shared by the radar and the trades router.

Holds the match computation (ported from the original client engine in
src/data/matches.js) and `collector_meta`, the single place that resolves the display
metadata for a trade partner."""
import math
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from models.card import Card, UserCard
from models.review import Review
from models.trade import Trade
from models.user import User
from schemas import MatchCollector, MatchRead, MatchSticker


async def copies_for(session: AsyncSession, user_id: int) -> dict[int, int]:
    """A user's collection as a {card_id: copies} map (only the cards they own)."""
    return {
        uc.card_id: uc.copies
        for uc in (
            await session.execute(select(UserCard).where(UserCard.user_id == user_id))
        ).scalars().all()
    }


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in km between two (lat, lon) pairs."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return round(R * 2 * math.asin(math.sqrt(a)), 1)


async def collector_meta(session: AsyncSession, user: User, me: User) -> dict:
    """Display metadata for a trade partner — `name`, `distance_km`, `rating`,
    `successful_trades`.

    Rating and completed-trade count are derived from real activity (same aggregation as
    build_reputation). Distance is computed via Haversine when both users have stored
    coordinates; None otherwise."""
    received = (await session.execute(
        select(Review.rating).where(Review.ratee_id == user.id)
    )).scalars().all()
    rating = round(sum(received) / len(received), 1) if received else 0.0

    successful = (await session.execute(
        select(func.count()).select_from(Trade).where(
            Trade.status == "completed",
            (Trade.initiator_id == user.id) | (Trade.receiver_id == user.id),
        )
    )).scalar_one()

    distance_km = None
    if (
        me.lat is not None and me.lng is not None
        and user.lat is not None and user.lng is not None
    ):
        distance_km = _haversine_km(me.lat, me.lng, user.lat, user.lng)

    return {
        "name": user.username,
        "distance_km": distance_km,
        "rating": rating,
        "successful_trades": successful,
    }


def _score_match(get: int, give: int) -> int:
    """Compatibility 0–100 for a potential trade. 0 when one-sided (only viable when
    BOTH sides gain); otherwise rewards balance and volume. Ported from the original
    client engine in src/data/matches.js so the UI numbers stay identical."""
    if get == 0 or give == 0:
        return 0
    balance = min(give, get) / max(give, get)  # 0..1 — how even the trade is
    volume = min(get, 20) / 20                  # 0..1 — capped how much I gain
    return round(40 + balance * 30 + volume * 30)


def spares_catalog(
    cards: list[Card],
    owner_copies: dict[int, int],
    other_copies: dict[int, int],
) -> list[tuple[Card, bool]]:
    """The cards `owner` has spare (copies >= 2) for the negotiation table's add/suggest
    pickers, each tagged `useful` = the other side is missing it (0 copies)."""
    out: list[tuple[Card, bool]] = []
    for card in cards:
        if owner_copies.get(card.id, 0) >= 2:
            out.append((card, other_copies.get(card.id, 0) == 0))
    return out


def sticker(card: Card) -> MatchSticker:
    return MatchSticker(
        code=card.code,
        number=card.number,
        name=card.name,
        team=card.team,
        category=card.category,
        rarity=card.rarity,
    )


def compute_match(
    cards: list[Card],
    my_copies: dict[int, int],
    collector: User,
    meta: dict,
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
            they_offer.append(sticker(card))
            if card.rarity != "base":
                gold_count += 1
        if theirs == 0 and mine >= 2:
            i_offer.append(sticker(card))

    compatibility = _score_match(len(they_offer), len(i_offer))
    if compatibility == 0:
        return None

    return MatchRead(
        collector=MatchCollector(
            id=collector.id,
            username=collector.username,
            name=meta["name"],
            distance_km=meta["distance_km"],
            rating=meta["rating"],
            successful_trades=meta["successful_trades"],
        ),
        they_offer=they_offer,
        i_offer=i_offer,
        gold_count=gold_count,
        compatibility=compatibility,
    )
