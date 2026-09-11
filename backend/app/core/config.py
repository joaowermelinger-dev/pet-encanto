"""
Configuração da aplicação.

Todas as variáveis são lidas do arquivo ``backend/.env`` (ou de variáveis de
ambiente do sistema, que têm prioridade). Centralizar aqui evita espalhar
``os.getenv`` pelo código.
"""

from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Banco de dados ---
    DATABASE_URL: str

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def _normalize_db_url(cls, v: str) -> str:
        if v.startswith("postgres://"):
            v = "postgresql://" + v.removeprefix("postgres://")
        if v.startswith("postgresql://"):
            v = "postgresql+psycopg://" + v.removeprefix("postgresql://")
        return v

    # --- Autenticação ---
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    AUTH_COOKIE_NAME: str = "petencanto_session"     # access token (path /)
    REFRESH_COOKIE_NAME: str = "petencanto_refresh"  # refresh token (path /api/auth)

    # --- Primeiro acesso (seed do dono) ---
    FIRST_ADMIN_EMAIL: str = ""
    FIRST_ADMIN_PASSWORD: str = ""
    FIRST_ADMIN_NAME: str = "Dono"

    # --- Upload de fotos ---
    UPLOADS_DIR: str = "uploads"

    # --- Ambiente ---
    ENV: Literal["development", "production"] = "development"
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    COOKIE_SAMESITE: Literal["lax", "none", "strict"] = "lax"

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"

    @property
    def cookie_secure(self) -> bool:
        return self.is_production or self.COOKIE_SAMESITE == "none"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.FRONTEND_ORIGIN.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


settings = get_settings()
