import os
from dotenv import load_dotenv

load_dotenv()

# Database. Defaults to a local SQLite file so the API runs with zero setup in dev.
# Production overrides this with a Postgres URL (postgresql+asyncpg://...).
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", "sqlite+aiosqlite:///./paninixchange.db"
)

# JWT signing secret. The default is for local development ONLY — set a strong
# SECRET_KEY in the environment for any deployment.
SECRET_KEY: str = os.getenv(
    "SECRET_KEY", "dev-secret-change-me-not-for-production-use-0123456789"
)

JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")  # 24h
)
