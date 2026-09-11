"""
Funções de segurança: hash de senha (Argon2) e tokens de acesso (JWT).

Nada aqui toca no banco nem no FastAPI — são utilitários puros, fáceis de testar.
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

_password_hash = PasswordHash.recommended()


# --- Senha --------------------------------------------------------------------

def hash_password(plain_password: str) -> str:
    return _password_hash.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return _password_hash.verify(plain_password, password_hash)


# --- Token JWT ---------------------------------------------------------------

def create_access_token(subject: str | int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None

    subject = payload.get("sub")
    if subject is None:
        return None
    try:
        return int(subject)
    except (TypeError, ValueError):
        return None


# --- Token opaco (refresh) ----------------------------------------------------
# String aleatória grande. No banco fica só o hash SHA-256 — um vazamento do
# banco não permite usar nenhum token.

def _sha256_hex(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def hash_refresh_token(raw_token: str) -> str:
    return _sha256_hex(raw_token)


def generate_refresh_token() -> tuple[str, str]:
    """Retorna ``(token_cru, token_hash)`` para o cookie de refresh."""
    raw = secrets.token_urlsafe(48)
    return raw, hash_refresh_token(raw)
