"""Tabela ``appointments`` — atendimentos (ocorrências) de um serviço para um pet."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, Text, func, text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.common import AppointmentStatus


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[AppointmentStatus] = mapped_column(
        SAEnum(
            AppointmentStatus,
            native_enum=False,
            length=20,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
        default=AppointmentStatus.SCHEDULED,
        server_default="scheduled",
    )
    # Valor cobrado NESSA ocorrência — snapshot editável, não vem sempre do
    # preço atual do catálogo (permite desconto/ajuste pontual).
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    # Marcação simples de pagamento. Não é um registro financeiro completo
    # (isso vem na Fase 5 — Vendas/Financeiro); só evita esquecer quem pagou.
    paid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default=text("false"))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    pet: Mapped["Pet"] = relationship()  # noqa: F821
    service: Mapped["Service"] = relationship()  # noqa: F821
