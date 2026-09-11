"""
Geração das ocorrências (atendimentos) de um Clubinho.

A cada frequência corresponde um "passo": soma-se esse passo à última
ocorrência para achar a próxima. Isso é usado tanto na criação (a partir de
``first_occurrence_at``) quanto para estender um clubinho existente (a partir
da última ocorrência já gerada).
"""

import calendar
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.common import AppointmentStatus, SubscriptionFrequency
from app.models.subscription import Subscription

# Quanto à frente gerar de uma vez (na criação e a cada "gerar mais").
GENERATE_HORIZON_DAYS = 90


def _add_months(dt: datetime, months: int) -> datetime:
    month_index = dt.month - 1 + months
    year = dt.year + month_index // 12
    month = month_index % 12 + 1
    day = min(dt.day, calendar.monthrange(year, month)[1])
    return dt.replace(year=year, month=month, day=day)


def next_occurrence(dt: datetime, frequency: SubscriptionFrequency) -> datetime:
    if frequency == SubscriptionFrequency.WEEKLY:
        return dt + timedelta(days=7)
    if frequency == SubscriptionFrequency.BIWEEKLY:
        return dt + timedelta(days=14)
    return _add_months(dt, 1)


def generate_occurrences(db: Session, subscription: Subscription, *, from_last_existing: bool) -> list[Appointment]:
    """
    Cria os `Appointment` do clubinho até `hoje + GENERATE_HORIZON_DAYS`.

    - `from_last_existing=False` (criação do clubinho): começa em
      `first_occurrence_at` (inclusive).
    - `from_last_existing=True` ("gerar mais"): continua a partir da última
      ocorrência já existente, preservando o dia da semana/mês e horário.
    """
    horizon = datetime.now(subscription.first_occurrence_at.tzinfo) + timedelta(days=GENERATE_HORIZON_DAYS)

    if from_last_existing:
        last = db.scalar(
            select(Appointment.scheduled_at)
            .where(Appointment.subscription_id == subscription.id)
            .order_by(Appointment.scheduled_at.desc())
            .limit(1)
        )
        current = next_occurrence(last, subscription.frequency) if last else subscription.first_occurrence_at
    else:
        current = subscription.first_occurrence_at

    created: list[Appointment] = []
    while current <= horizon:
        appointment = Appointment(
            pet_id=subscription.pet_id,
            service_id=subscription.service_id,
            scheduled_at=current,
            status=AppointmentStatus.SCHEDULED,
            price=subscription.service.price,
            paid=False,
            subscription_id=subscription.id,
        )
        db.add(appointment)
        created.append(appointment)
        current = next_occurrence(current, subscription.frequency)

    return created


def get_next_occurrence_at(db: Session, subscription: Subscription) -> datetime | None:
    """Próximo atendimento futuro (ainda agendado) desse clubinho, se houver."""
    return db.scalar(
        select(Appointment.scheduled_at)
        .where(
            Appointment.subscription_id == subscription.id,
            Appointment.status == AppointmentStatus.SCHEDULED,
        )
        .order_by(Appointment.scheduled_at)
        .limit(1)
    )


def cancel_future_appointments(db: Session, subscription: Subscription) -> None:
    """Cancela os atendimentos futuros ainda agendados ao cancelar o clubinho."""
    now = datetime.now(subscription.first_occurrence_at.tzinfo)
    appointments = db.scalars(
        select(Appointment).where(
            Appointment.subscription_id == subscription.id,
            Appointment.status == AppointmentStatus.SCHEDULED,
            Appointment.scheduled_at >= now,
        )
    )
    for appointment in appointments:
        appointment.status = AppointmentStatus.CANCELLED
