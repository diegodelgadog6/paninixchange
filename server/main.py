from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import init_db
from routers import users, cards, trades, radar


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="PaniniXchange API", lifespan=lifespan)

app.include_router(users.router)
app.include_router(cards.router)
app.include_router(trades.router)
app.include_router(radar.router)
