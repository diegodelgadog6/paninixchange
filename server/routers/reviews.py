from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from models.review import Review
from models.trade import Trade
from models.user import User
from schemas import ReviewCreate, ReviewRead

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead)
async def create_review(
    payload: ReviewCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Rate a confirmed trade (user → collector). The user must own the trade and it
    must be confirmed. Re-rating the same trade updates the existing review."""
    trade = await session.get(Trade, payload.trade_id)
    if trade is None or trade.initiator_id != user.id:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    if trade.status != "confirmed":
        raise HTTPException(
            status_code=400, detail="Solo puedes calificar un intercambio confirmado."
        )

    review = (await session.execute(
        select(Review).where(
            Review.trade_id == trade.id, Review.rater_id == user.id
        )
    )).scalars().first()

    if review is None:
        review = Review(
            trade_id=trade.id,
            rater_id=user.id,
            ratee_id=trade.receiver_id,
            rating=payload.rating,
            comment=payload.comment,
        )
        session.add(review)
    else:
        review.rating = payload.rating
        review.comment = payload.comment
        session.add(review)

    await session.commit()
    await session.refresh(review)
    return review
