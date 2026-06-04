"""Pure auth helpers: password hashing (bcrypt) and JWT encode/decode.

No FastAPI or database imports here so this stays trivially testable.
"""
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

import config


def hash_password(plain: str) -> str:
    """Hash a plaintext password with bcrypt, returning a UTF-8 string for storage."""
    hashed = bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Check a plaintext password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # Malformed/legacy hash in storage → treat as a failed match.
        return False


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """Issue a signed JWT carrying `sub` (the user id) and an expiry."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, config.SECRET_KEY, algorithm=config.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT. Raises jwt.PyJWTError on invalid/expired tokens."""
    return jwt.decode(token, config.SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
