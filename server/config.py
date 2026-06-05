import os
from dotenv import load_dotenv

load_dotenv()


def _normalize_db_url(url: str) -> str:
    """Make a Postgres URL work with SQLAlchemy's async engine.

    Managed hosts (Railway, Heroku, Render) expose the connection string as
    `postgres://...` or `postgresql://...`, but the async engine needs the asyncpg
    driver: `postgresql+asyncpg://...`. SQLite URLs are left untouched.
    """
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


# Database. Defaults to a local SQLite file so the API runs with zero setup in dev.
# Production sets DATABASE_URL to the managed Postgres connection string (Railway).
DATABASE_URL: str = _normalize_db_url(
    os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./paninixchange.db")
)

# Echo every SQL statement. Handy in dev, noisy in prod — off unless SQL_ECHO=1.
SQL_ECHO: bool = os.getenv("SQL_ECHO", "0") == "1"

# JWT signing secret. The default is for local development ONLY — set a strong
# SECRET_KEY in the environment for any deployment.
SECRET_KEY: str = os.getenv(
    "SECRET_KEY", "dev-secret-change-me-not-for-production-use-0123456789"
)

JWT_ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")  # 24h
)

# CORS. Comma-separated list of allowed frontend origins. Defaults to the Vite dev
# server; in production set ALLOWED_ORIGINS to the deployed frontend URL(s), e.g.
# ALLOWED_ORIGINS=https://paninixchange.vercel.app
ALLOWED_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
