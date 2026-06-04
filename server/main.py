from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, seed_cards, seed_demo_collectors
from routers import auth, users, cards, trades, radar, reviews


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_cards()
    await seed_demo_collectors()
    yield


app = FastAPI(title="PaniniXchange API", lifespan=lifespan)

# Allow the Vite dev server to call the API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
