from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, select
import config


engine = create_async_engine(config.DATABASE_URL, echo=config.SQL_ECHO)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session():
    async with async_session() as session:
        yield session


async def migrate_db():
    """Add new nullable columns to existing tables without dropping data.

    create_all creates missing tables but never alters existing ones, so columns added
    after the initial deploy must be applied here. Each column runs in its own transaction
    so that an already-exists error (SQLite: OperationalError; Postgres: ProgrammingError)
    only rolls back that one statement and doesn't poison the connection for the next one.
    """
    for col, col_type in [("lat", "FLOAT"), ("lng", "FLOAT")]:
        try:
            async with engine.begin() as conn:
                await conn.execute(text(f"ALTER TABLE user ADD COLUMN {col} {col_type}"))
        except Exception:
            pass  # column already exists


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def seed_cards():
    """Populate the `card` table with the 994-card catalog on first boot.

    Idempotent: only seeds when the table is empty, so re-starts are safe.
    """
    from models.card import Card
    from data.catalog import build_catalog

    async with async_session() as session:
        existing = (await session.execute(select(Card).limit(1))).scalars().first()
        if existing is not None:
            return
        session.add_all([Card(**card) for card in build_catalog()])
        await session.commit()
