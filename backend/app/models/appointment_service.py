"""Tabela ``appointment_service_items`` — os serviços cobrados num atendimento.

Um atendimento pode ter mais de um serviço (ex.: banho + tosa no mesmo
horário); cada linha aqui é um serviço com o preço cobrado *nessa* ocorrência
(snapshot editável, igual já era ``Appointment.price`` antes desta tabela
existir). ``Appointment.price`` continua existindo como o total (soma destes
itens), mantido pelo backend a cada criação/edição.
"""

from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AppointmentServiceItem(Base):
    __tablename__ = "appointment_service_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    appointment_id: Mapped[int] = mapped_column(
        ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    service: Mapped["Service"] = relationship()  # noqa: F821
