from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Trade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    initiator_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    status: str = Field(default="pending")  # pending | confirmed | cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None


class TradeItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    trade_id: int = Field(foreign_key="trade.id")
    card_id: int = Field(foreign_key="card.id")
    offered_by: int = Field(foreign_key="user.id")  # initiator or receiver
