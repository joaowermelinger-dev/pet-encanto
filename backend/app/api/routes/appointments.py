"""Agenda de atendimentos: agendar, listar por período, atualizar status/reagendar."""

from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import CurrentUser, DbSession
from app.models.appointment import Appointment
from app.models.pet import Pet
from app.models.service import Service
from app.schemas.appointment import AppointmentCreate, AppointmentOut, AppointmentUpdate

router = APIRouter(prefix="/appointments", tags=["appointments"])

_LOAD_OPTS = (selectinload(Appointment.pet).selectinload(Pet.client), selectinload(Appointment.service))


def _get_or_404(db: DbSession, appointment_id: int) -> Appointment:
    appointment = db.scalar(
        select(Appointment).where(Appointment.id == appointment_id).options(*_LOAD_OPTS)
    )
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agendamento não encontrado.")
    return appointment


@router.get("", response_model=list[AppointmentOut])
def list_appointments(
    user: CurrentUser,
    db: DbSession,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> list[Appointment]:
    stmt = select(Appointment).options(*_LOAD_OPTS).order_by(Appointment.scheduled_at)
    if date_from is not None:
        stmt = stmt.where(Appointment.scheduled_at >= date_from)
    if date_to is not None:
        stmt = stmt.where(Appointment.scheduled_at <= date_to)
    return list(db.scalars(stmt))


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, user: CurrentUser, db: DbSession) -> Appointment:
    if payload.pet_id is not None and db.get(Pet, payload.pet_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")
    if db.get(Service, payload.service_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Serviço não encontrado.")

    appointment = Appointment(**payload.model_dump())
    db.add(appointment)
    db.commit()
    return _get_or_404(db, appointment.id)


@router.patch("/{appointment_id}", response_model=AppointmentOut)
def update_appointment(
    appointment_id: int, payload: AppointmentUpdate, user: CurrentUser, db: DbSession
) -> Appointment:
    appointment = _get_or_404(db, appointment_id)
    if payload.pet_id is not None and db.get(Pet, payload.pet_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")
    if db.get(Service, payload.service_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Serviço não encontrado.")
    for field, value in payload.model_dump().items():
        setattr(appointment, field, value)
    db.commit()
    return _get_or_404(db, appointment_id)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, user: CurrentUser, db: DbSession) -> None:
    appointment = _get_or_404(db, appointment_id)
    db.delete(appointment)
    db.commit()
