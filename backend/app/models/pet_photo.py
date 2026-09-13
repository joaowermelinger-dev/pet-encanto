"""Tabela ``pet_photos`` — fotos usadas na galeria pública da landing page.

A foto pode estar ligada a um pet cadastrado (``pet_id``) ou ser só uma foto
avulsa do dia a dia do petshop (``pet_id`` nulo) — nos dois casos, só aparece
na landing se ``is_public`` for verdadeiro.
"""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PetPhoto(Base):
    __tablename__ = "pet_photos"

    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int | None] = mapped_column(
        ForeignKey("pets.id", ondelete="SET NULL"), nullable=True, index=True
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    pet: Mapped["Pet | None"] = relationship()  # noqa: F821
