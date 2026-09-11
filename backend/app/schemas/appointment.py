from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.common import AppointmentStatus
from app.schemas.base import ORMBase
from app.schemas.pet import PetOut
from app.schemas.service import ServiceOut


class AppointmentCreate(BaseModel):
    pet_id: int
    service_id: int
    scheduled_at: datetime
    price: Decimal
    paid: bool = False
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    scheduled_at: datetime
    status: AppointmentStatus
    price: Decimal
    paid: bool
    notes: str | None = None


class AppointmentOut(ORMBase):
    id: int
    pet_id: int
    service_id: int
    scheduled_at: datetime
    status: AppointmentStatus
    price: Decimal
    paid: bool
    notes: str | None
    pet: PetOut
    service: ServiceOut
