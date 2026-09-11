"""
Rotas de autenticação: login, logout, refresh e "quem sou eu".

Login único (só o dono do petshop) — sem registro público. A conta é criada
pelo script ``scripts/seed_admin.py``.

Sessão em dois tokens, ambos em cookie **httpOnly**:
- **access token** (JWT, ~15 min): vai em toda requisição (cookie de path "/").
- **refresh token** (opaco, ~14 dias): só é enviado para /api/auth/* (cookie de
  path "/api/auth"). Renova o access sem pedir login de novo, e é **rotacionado**
  a cada uso (o antigo é revogado).
"""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Cookie, HTTPException, Response, status
from sqlalchemy import select, update

from app.api.deps import CurrentUser, DbSession
from app.core.config import settings
from app.core.csrf import CSRF_COOKIE_NAME, generate_csrf_token
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_refresh_token,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import LoginRequest, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

_ACCESS_PATH = "/"
_REFRESH_PATH = "/api/auth"


def _cookie_kwargs() -> dict:
    return {
        "httponly": True,
        "samesite": settings.COOKIE_SAMESITE,
        "secure": settings.cookie_secure,
    }


def _issue_session(response: Response, db: DbSession, user: User) -> None:
    """Emite um novo par de tokens. NÃO faz commit — quem chama controla a transação."""
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=create_access_token(user.id),
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path=_ACCESS_PATH,
        **_cookie_kwargs(),
    )

    raw_token, token_hash = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            created_at=datetime.now(timezone.utc),
        )
    )
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=raw_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path=_REFRESH_PATH,
        **_cookie_kwargs(),
    )

    csrf_kwargs = {**_cookie_kwargs(), "httponly": False}
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=generate_csrf_token(),
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path=_ACCESS_PATH,
        **csrf_kwargs,
    )


def _clear_session_cookies(response: Response) -> None:
    response.delete_cookie(settings.AUTH_COOKIE_NAME, path=_ACCESS_PATH, **_cookie_kwargs())
    response.delete_cookie(settings.REFRESH_COOKIE_NAME, path=_REFRESH_PATH, **_cookie_kwargs())
    response.delete_cookie(
        CSRF_COOKIE_NAME, path=_ACCESS_PATH, **{**_cookie_kwargs(), "httponly": False}
    )


def _revoke_all_refresh_tokens(db: DbSession, user_id: int) -> None:
    db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(timezone.utc))
    )


@router.post("/login", response_model=UserOut)
def login(payload: LoginRequest, response: Response, db: DbSession) -> User:
    user = db.scalar(select(User).where(User.email == payload.email))

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conta desativada.",
        )

    _issue_session(response, db, user)
    db.commit()
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie(alias=settings.REFRESH_COOKIE_NAME)] = None,
) -> None:
    if refresh_token:
        db.execute(
            update(RefreshToken)
            .where(
                RefreshToken.token_hash == hash_refresh_token(refresh_token),
                RefreshToken.revoked_at.is_(None),
            )
            .values(revoked_at=datetime.now(timezone.utc))
        )
        db.commit()
    _clear_session_cookies(response)


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser) -> User:
    return user


@router.post("/refresh", response_model=UserOut)
def refresh(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie(alias=settings.REFRESH_COOKIE_NAME)] = None,
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sessão expirada. Faça login novamente.",
    )

    if not refresh_token:
        _clear_session_cookies(response)
        raise unauthorized

    row = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token))
    )
    if row is None:
        _clear_session_cookies(response)
        raise unauthorized

    if row.revoked_at is not None:
        # Token já revogado sendo reapresentado -> provável roubo. Derruba tudo.
        _revoke_all_refresh_tokens(db, row.user_id)
        db.commit()
        _clear_session_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão inválida. Faça login novamente.",
        )

    if row.expires_at <= datetime.now(timezone.utc):
        _clear_session_cookies(response)
        raise unauthorized

    user = db.get(User, row.user_id)
    if user is None:
        _clear_session_cookies(response)
        raise unauthorized

    row.revoked_at = datetime.now(timezone.utc)
    _issue_session(response, db, user)
    db.commit()
    return user
