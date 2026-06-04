from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from models.card import Card, UserCard
from models.user import User
from schemas import CardRead, CardUpdate

router = APIRouter(prefix="/api/cards", tags=["cards"])


def _to_card_read(card: Card, copies: int) -> CardRead:
    return CardRead(
        code=card.code,
        number=card.number,
        name=card.name,
        team=card.team,
        category=card.category,
        rarity=card.rarity,
        copies=copies,
    )


@router.get("/album", response_model=list[CardRead])
async def get_album(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Full 994-card album in physical order, with the user's copy count per card."""
    cards = (await session.execute(select(Card).order_by(Card.number))).scalars().all()
    owned = (
        await session.execute(select(UserCard).where(UserCard.user_id == user.id))
    ).scalars().all()
    copies_by_card = {uc.card_id: uc.copies for uc in owned}
    return [_to_card_read(c, copies_by_card.get(c.id, 0)) for c in cards]


@router.patch("/album/{card_code}", response_model=CardRead)
async def update_card_copies(
    card_code: str,
    payload: CardUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Set the absolute copy count for one card in the user's collection."""
    card = (
        await session.execute(select(Card).where(Card.code == card_code))
    ).scalars().first()
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cromo no encontrado"
        )

    user_card = (
        await session.execute(
            select(UserCard).where(
                UserCard.user_id == user.id, UserCard.card_id == card.id
            )
        )
    ).scalars().first()
    if user_card is None:
        user_card = UserCard(user_id=user.id, card_id=card.id, copies=payload.copies)
    else:
        user_card.copies = payload.copies
    session.add(user_card)
    await session.commit()

    return _to_card_read(card, payload.copies)
