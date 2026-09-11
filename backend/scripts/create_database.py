"""
Cria o banco de dados definido na DATABASE_URL, caso ainda não exista.

Uso (dentro do venv, a partir da pasta backend/):
    python -m scripts.create_database

Depois disso, rode:
    alembic upgrade head
"""

import sys
from urllib.parse import urlparse

import psycopg
from psycopg import sql

from app.core.config import settings


def main() -> None:
    url = urlparse(settings.DATABASE_URL.replace("+psycopg", ""))
    db_name = url.path.lstrip("/")

    if not db_name:
        sys.exit("DATABASE_URL não contém o nome do banco.")

    admin_dsn = psycopg.conninfo.make_conninfo(
        host=url.hostname or "localhost",
        port=url.port or 5432,
        user=url.username,
        password=url.password,
        dbname="postgres",
    )

    with psycopg.connect(admin_dsn, autocommit=True) as conn:
        exists = conn.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s", (db_name,)
        ).fetchone()
        if exists:
            print(f'Banco "{db_name}" já existe. Nada a fazer.')
            return
        conn.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
        print(f'Banco "{db_name}" criado com sucesso.')


if __name__ == "__main__":
    main()
