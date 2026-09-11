"""Importa todos os modelos para registrá-los em ``Base.metadata`` (Alembic autogenerate)."""

from app.models.refresh_token import RefreshToken  # noqa: F401
from app.models.shop_info import ShopInfo  # noqa: F401
from app.models.user import User  # noqa: F401
