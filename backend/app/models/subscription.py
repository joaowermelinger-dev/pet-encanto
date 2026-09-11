"""Tabela ``subscriptions`` — o "Clubinho": atendimento recorrente pra um pet
(semanal, quinzenal ou mensal) no mesmo horário. Cada ocorrência gerada vira
uma linha normal em ``appointments`` (com ``subscription_id`` preenchido),
cobrada e marcada como paga igual a qualquer outro atendimento.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.common import SubscriptionFrequency, SubscriptionStatus


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    frequency: Mapped[SubscriptionFrequency] = mapped_column(
        SAEnum(
            SubscriptionFrequency,
            native_enum=False,
            length=20,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )
    # Data/hora do primeiro atendimento — dia da semana (ou do mês, no caso
    # mensal) e horário de todas as ocorrências seguintes vêm daqui.
    first_occurrence_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(
        SAEnum(
            SubscriptionStatus,
            native_enum=False,
            length=20,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
        default=SubscriptionStatus.ACTIVE,
        server_default="active",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    pet: Mapped["Pet"] = relationship()  # noqa: F821
    service: Mapped["Service"] = relationship()  # noqa: F821
