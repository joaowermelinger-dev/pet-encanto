"""
Dependencies compartilhadas pelas rotas.

A principal é ``get_current_user``: lê o cookie de sessão, valida o JWT e
carrega o usuário do banco. Qualquer rota que dependa dela fica protegida —
sem cookie válido o cliente recebe 401.
"""

from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

DbSession = Annotated[Session, Depends(get_db)]

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Não autenticado",
)


def get_current_user(
    db: DbSession,
    session_token: Annotated[str | None, Cookie(alias=settings.AUTH_COOKIE_NAME)] = None,
) -> User:
    if not session_token:
        raise _UNAUTHORIZED

    user_id = decode_access_token(session_token)
    if user_id is None:
        raise _UNAUTHORIZED

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise _UNAUTHORIZED

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
