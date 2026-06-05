"""Reputation aggregation: turns a user's real trades and reviews into the history
rows, headline stats, level and badges the Perfil page shows. Shared by
GET /api/trades and GET /api/users/me/reputation."""
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from models.review import Review
from models.trade import Trade, TradeItem
from models.user import User
from schemas import BadgeRead, ReputationRead, TradeHistoryRead


# Honor-point thresholds → level label, highest first.
LEVELS = [(1000, "Diamante"), (500, "Oro"), (200, "Plata"), (0, "Bronce")]


def level_for(points: int) -> str:
    for threshold, label in LEVELS:
        if points >= threshold:
            return label
    return "Bronce"


def build_badges(successful: int, reviews: int, rating: float) -> list[BadgeRead]:
    """Badges earned from real activity — only the ones whose rule is met."""
    badges: list[BadgeRead] = []
    if successful >= 1:
        badges.append(BadgeRead(
            id="first-trade", icon="handshake",
            title="Primer intercambio", desc="Completó su primer intercambio.",
        ))
    if successful >= 5:
        badges.append(BadgeRead(
            id="active-trader", icon="local_fire_department",
            title="Coleccionista activo", desc="5+ intercambios completados.",
        ))
    if reviews >= 3 and rating >= 4.5:
        badges.append(BadgeRead(
            id="trusted", icon="verified",
            title="Intercambiador confiable", desc="Excelentes reseñas de la comunidad.",
        ))
    if successful >= 20:
        badges.append(BadgeRead(
            id="veteran", icon="military_tech",
            title="Veterano del álbum", desc="20+ intercambios completados.",
        ))
    return badges


async def build_history(session: AsyncSession, user_id: int) -> list[TradeHistoryRead]:
    """The user's trades (as initiator), newest first, with partner, cromo count,
    status and the rating the user left for each (None until they rate it)."""
    trades = (await session.execute(
        select(Trade)
        .where(Trade.initiator_id == user_id)
        .order_by(Trade.created_at.desc())
    )).scalars().all()
    if not trades:
        return []

    trade_ids = [t.id for t in trades]

    counts = dict((await session.execute(
        select(TradeItem.trade_id, func.count())
        .where(TradeItem.trade_id.in_(trade_ids))
        .group_by(TradeItem.trade_id)
    )).all())

    my_ratings = dict((await session.execute(
        select(Review.trade_id, Review.rating)
        .where(Review.rater_id == user_id, Review.trade_id.in_(trade_ids))
    )).all())

    receivers = (await session.execute(
        select(User).where(User.id.in_({t.receiver_id for t in trades}))
    )).scalars().all()
    name_by_id = {u.id: u.username for u in receivers}

    return [
        TradeHistoryRead(
            id=t.id,
            date=t.created_at,
            partner=name_by_id.get(t.receiver_id, "—"),
            cromo_count=counts.get(t.id, 0),
            status=t.status,
            my_rating=my_ratings.get(t.id),
        )
        for t in trades
    ]


async def build_reputation(session: AsyncSession, user_id: int) -> ReputationRead:
    """Aggregate the user's reputation from the reviews they received and the trades
    they completed, deriving points, level and badges."""
    received = (await session.execute(
        select(Review.rating).where(Review.ratee_id == user_id)
    )).scalars().all()
    reviews = len(received)
    rating = round(sum(received) / reviews, 1) if reviews else 0.0

    successful = (await session.execute(
        select(func.count()).select_from(Trade).where(
            Trade.status == "completed",
            (Trade.initiator_id == user_id) | (Trade.receiver_id == user_id),
        )
    )).scalar_one()

    points = successful * 100 + reviews * 20

    return ReputationRead(
        rating=rating,
        reviews=reviews,
        successful_trades=successful,
        points=points,
        level=level_for(points),
        badges=build_badges(successful, reviews, rating),
        history=await build_history(session, user_id),
    )
