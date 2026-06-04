from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Review(SQLModel, table=True):
    """A rating left on a confirmed trade, by one party about the other.

    Two directions can exist per trade:
      - collector → user: created automatically on PATCH /confirm (the demo
        collector's rating seeds the user's reputation; see trades.confirm_trade).
      - user → collector: created via POST /api/reviews from the RatingModal.
    A user's reputation aggregates the reviews where they are the `ratee`.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    trade_id: int = Field(foreign_key="trade.id")
    rater_id: int = Field(foreign_key="user.id")  # who leaves the rating
    ratee_id: int = Field(foreign_key="user.id")  # who is being rated
    rating: int  # 1–5 stars
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
