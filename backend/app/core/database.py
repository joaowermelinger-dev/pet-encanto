"""
Conexão com o PostgreSQL via SQLAlchemy (modo síncrono — mesma escolha do
finance-app: mais simples, sem os problemas do driver async no Windows).

Expõe:
- ``engine``        : pool de conexões.
- ``SessionLocal``  : fábrica de sessões (unidade de trabalho / transação).
- ``get_db()``      : dependency do FastAPI — uma sessão por request, fechada no fim.
- ``Base``          : classe base dos modelos ORM (ver app/models/).
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=not settings.is_production,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Classe base de todos os modelos ORM. Cada subclasse vira uma tabela."""


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
