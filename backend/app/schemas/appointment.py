from datetime import datetime

from pydantic import BaseModel

from app.models.common import AppointmentStatus
from app.schemas.base import ORMBase
from app.schemas.pet import PetOut
from app.schemas.service import ServiceOut


class AppointmentCreate(BaseModel):
    pet_id: int
    service_id: int
    scheduled_at: datetime
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    scheduled_at: datetime
    status: AppointmentStatus
    notes: str | None = None


class AppointmentOut(ORMBase):
    id: int
    pet_id: int
    service_id: int
    scheduled_at: datetime
    status: AppointmentStatus
    notes: str | None
    pet: PetOut
    service: ServiceOut
