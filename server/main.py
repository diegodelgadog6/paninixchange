from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config
from database import init_db, seed_cards
from routers import auth, users, cards, trades, radar, reviews, payments


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_cards()
    yield


app = FastAPI(title="PaniniXchange API", lifespan=lifespan)

# Allowed frontend origins come from config (Vite dev server by default; the deployed
# frontend URL in production via the ALLOWED_ORIGINS env var).
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(cards.router)
app.include_router(trades.router)
app.include_router(radar.router)
app.include_router(reviews.router)
app.include_router(payments.router)
