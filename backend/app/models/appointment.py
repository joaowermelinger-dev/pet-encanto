"""Tabela ``appointments`` — atendimentos (ocorrências) de um serviço.

Pode ser para um pet já cadastrado (``pet_id``) OU para um cliente avulso, sem
cadastro — nesse caso os dados do dono/animal ficam direto nos campos
``guest_*`` (preenchidos à mão na hora de abrir a ordem de serviço).
"""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, func, text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.common import AppointmentStatus


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int | None] = mapped_column(
        ForeignKey("pets.id", ondelete="CASCADE"), nullable=True, index=True
    )
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

    # --- Cliente avulso (sem cadastro) — só usados quando pet_id é NULL ---
    guest_client_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    guest_client_phone: Mapped[str | None] = mapped_column(String(40), nullable=True)
    guest_animal_name: Mapped[str | None] = mapped_column(String(80), nullable=True)
    guest_animal_breed: Mapped[str | None] = mapped_column(String(80), nullable=True)
    # Temperamento/alergias do animal (ex.: "é manso", "tem alergia a X").
    guest_animal_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    pet: Mapped["Pet | None"] = relationship()  # noqa: F821
    service: Mapped["Service"] = relationship()  # noqa: F821
