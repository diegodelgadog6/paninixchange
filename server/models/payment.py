from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    stripe_payment_id: str
    plan: str    # pro | legend
    amount: float
    currency: str = Field(default="usd")
    status: str  # succeeded | failed | pending
    created_at: datetime = Field(default_factory=datetime.utcnow)
