from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    membership: str = Field(default="free")  # free | pro | legend
    location: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
