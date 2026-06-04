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
    demo: bool


class MatchRead(BaseModel):
    """One ranked trade suggestion: who, what each side gives, and the score."""
    collector: MatchCollector
    they_offer: list[MatchSticker]  # cards I'm missing that they have spare
    i_offer: list[MatchSticker]     # cards they're missing that I have spare
    gold_count: int                 # non-base cards in they_offer
    compatibility: int              # 0–100; higher = more balanced, higher-volume
