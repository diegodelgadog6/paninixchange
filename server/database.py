from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, select
import config


engine = create_async_engine(config.DATABASE_URL, echo=config.SQL_ECHO)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session():
    async with async_session() as session:
        yield session


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
