from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, select
import config


engine = create_async_engine(config.DATABASE_URL, echo=True)

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


async def seed_demo_collectors():
    """Create the demo collector accounts and their seeded inventories.

    Gives the Trade Radar real users to match against before real peers join.
    Idempotent per collector (skips any whose username already exists), so it's safe
    to re-run and to add new demo collectors later. Runs after seed_cards().
    """
    import secrets

    from models.card import Card, UserCard
    from models.user import User
    from data.collectors import DEMO_COLLECTORS, demo_email, build_demo_copies
    from security import hash_password

    async with async_session() as session:
        cards = (await session.execute(select(Card))).scalars().all()
        if not cards:
            return  # catalog not seeded yet — nothing to build inventories from

        for demo in DEMO_COLLECTORS:
            exists = (
                await session.execute(
                    select(User).where(User.username == demo["username"])
                )
            ).scalars().first()
            if exists is not None:
                continue

            user = User(
                username=demo["username"],
                email=demo_email(demo["username"]),
                hashed_password=hash_password(secrets.token_urlsafe(16)),
            )
            session.add(user)
            await session.flush()  # assign user.id before creating UserCards

            copies = build_demo_copies(demo["username"], cards)
            session.add_all(
                UserCard(user_id=user.id, card_id=card_id, copies=n)
                for card_id, n in copies.items()
            )

        await session.commit()
