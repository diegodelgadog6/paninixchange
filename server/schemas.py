"""Request/response schemas for the auth flow, kept separate from the `table` model."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    membership: str
    location: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CardRead(BaseModel):
    """A single album card plus the authenticated user's owned copy count."""
    code: str
    number: int
    name: str
    team: str
    category: str
    rarity: str
    copies: int = 0

    model_config = {"from_attributes": True}


class CardUpdate(BaseModel):
    """Absolute copy count for a card in the user's collection (0 = missing)."""
    copies: int = Field(ge=0)


class MatchSticker(BaseModel):
    """A single card in a trade suggestion (the offered/received columns)."""
    code: str
    number: int
    name: str
    team: str
    category: str
    rarity: str


class MatchCollector(BaseModel):
    """A nearby collector surfaced by the matching engine."""
    id: int
    username: str
    name: str
    distance_km: float
    rating: float           # reputation shown on the radar/negotiation (demo metadata)
    successful_trades: int  # completed-trade count shown next to the rating
    demo: bool


class MatchRead(BaseModel):
    """One ranked trade suggestion: who, what each side gives, and the score."""
    collector: MatchCollector
    they_offer: list[MatchSticker]  # cards I'm missing that they have spare
    i_offer: list[MatchSticker]     # cards they're missing that I have spare
    gold_count: int                 # non-base cards in they_offer
    compatibility: int              # 0–100; higher = more balanced, higher-volume


class TradeCreate(BaseModel):
    """A proposed swap submitted from the negotiation table. Card lists are album
    codes (e.g. MEX2); the server resolves them to ids and records who offers what."""
    receiver_id: int
    i_offer: list[str]    # cards I give (offered_by = me)
    they_offer: list[str]  # cards they give (offered_by = receiver)


class TradeRead(BaseModel):
    """A persisted trade proposal."""
    id: int
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ContactRead(BaseModel):
    """Partner contact revealed once a trade is confirmed (privacy by design)."""
    name: str
    phone: str
    whatsapp: str  # digits only, for the wa.me link
    rating: float


class ReviewCreate(BaseModel):
    """A rating the user leaves on a confirmed trade (user → collector)."""
    trade_id: int
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewRead(BaseModel):
    """A persisted review."""
    id: int
    trade_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TradeHistoryRead(BaseModel):
    """One row of the user's trade history (Perfil's "Historial de Intercambios")."""
    id: int
    date: datetime          # trade.created_at
    partner: str            # the other collector's display name
    cromo_count: int        # number of cards in the swap (both sides)
    status: str             # pending | confirmed | cancelled
    my_rating: Optional[int] = None  # the rating the user left, if any


class BadgeRead(BaseModel):
    """A reputation badge earned by meeting a rule (see build_reputation)."""
    id: str
    icon: str
    title: str
    desc: str


class ReputationRead(BaseModel):
    """Aggregated reputation for the authenticated user, derived from real trades
    and reviews. Feeds the Perfil header, stat tiles, badges, and history."""
    rating: float           # avg of reviews where the user is the ratee (0 if none)
    reviews: int            # number of those reviews
    successful_trades: int  # confirmed trades the user took part in
    points: int             # derived honor points
    level: str              # derived level label
    badges: list[BadgeRead]
    history: list[TradeHistoryRead]
