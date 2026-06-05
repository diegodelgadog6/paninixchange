from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Trade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    initiator_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    # Lifecycle: an invitation (pending) the receiver accepts to start negotiating; the
    # live table where both sides build offers and confirm; sealed once both confirm.
    #   pending → negotiating → completed | cancelled
    status: str = Field(default="pending")
    # Mutual close: the trade only seals when BOTH flags are set. Any edit to the offers
    # (except pending suggestions) clears both — see routers/trades.py.
    initiator_confirmed: bool = Field(default=False)
    receiver_confirmed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None


class TradeItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    trade_id: int = Field(foreign_key="trade.id")
    card_id: int = Field(foreign_key="card.id")
    offered_by: int = Field(foreign_key="user.id")  # whose side gives this card
    # committed: a real part of offered_by's offer (counts toward the balance).
    # suggested: a card the OTHER party proposed offered_by add; awaits their accept,
    #            doesn't count and doesn't reset confirmations until accepted.
    state: str = Field(default="committed")  # committed | suggested
