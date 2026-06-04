from typing import Optional
from sqlmodel import Field, SQLModel


class Card(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)  # e.g. ARG17, CC1, FWC3
    number: int = Field(index=True)  # physical album position, 1..994 (shown as #012)
    name: str
    team: str
    category: str   # Jugador | Escudo | Foto del equipo | Especial | Coca-Cola
    rarity: str     # base | gold | legend


class UserCard(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    card_id: int = Field(foreign_key="card.id")
    copies: int = Field(default=0)
