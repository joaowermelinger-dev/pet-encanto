"""
Cria (ou atualiza a senha d)o usuário dono, a partir de FIRST_ADMIN_EMAIL /
FIRST_ADMIN_PASSWORD / FIRST_ADMIN_NAME no .env.

Uso (dentro do venv, a partir da pasta backend/, depois de `alembic upgrade head`):
    python -m scripts.seed_admin
"""

import sys

from sqlalchemy import select

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def main() -> None:
    if not settings.FIRST_ADMIN_EMAIL or not settings.FIRST_ADMIN_PASSWORD:
        sys.exit("Defina FIRST_ADMIN_EMAIL e FIRST_ADMIN_PASSWORD no .env antes de rodar este script.")

    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == settings.FIRST_ADMIN_EMAIL))
        if user is not None:
            user.password_hash = hash_password(settings.FIRST_ADMIN_PASSWORD)
            user.name = settings.FIRST_ADMIN_NAME
            db.commit()
            print(f'Usuário "{settings.FIRST_ADMIN_EMAIL}" já existia — senha atualizada.')
            return

        user = User(
            email=settings.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            name=settings.FIRST_ADMIN_NAME,
        )
        db.add(user)
        db.commit()
        print(f'Usuário dono "{settings.FIRST_ADMIN_EMAIL}" criado com sucesso.')
    finally:
        db.close()


if __name__ == "__main__":
    main()
