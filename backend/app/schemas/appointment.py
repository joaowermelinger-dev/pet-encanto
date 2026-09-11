from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, model_validator

from app.models.common import AppointmentStatus
from app.schemas.base import ORMBase
from app.schemas.pet import PetOut
from app.schemas.service import ServiceOut


class _GuestFields(BaseModel):
    """Dados de um cliente avulso (sem cadastro) — usados quando não há pet_id."""

    pet_id: int | None = None
    guest_client_name: str | None = None
    guest_client_phone: str | None = None
    guest_animal_name: str | None = None
    guest_animal_breed: str | None = None
    guest_animal_notes: str | None = None

    @model_validator(mode="after")
    def _check_pet_or_guest(self) -> "_GuestFields":
        if self.pet_id is None and not (self.guest_client_name and self.guest_animal_name):
            raise ValueError(
                "Informe um pet cadastrado ou, para atendimento avulso, ao menos o nome do "
                "cliente e do animal."
            )
        return self


class AppointmentCreate(_GuestFields):
    service_id: int
    scheduled_at: datetime
    price: Decimal
    paid: bool = False
    notes: str | None = None


class AppointmentUpdate(_GuestFields):
    service_id: int
    scheduled_at: datetime
    status: AppointmentStatus
    price: Decimal
    paid: bool
    notes: str | None = None


class AppointmentOut(ORMBase):
    id: int
    pet_id: int | None
    service_id: int
    scheduled_at: datetime
    status: AppointmentStatus
    price: Decimal
    paid: bool
    notes: str | None
    guest_client_name: str | None
    guest_client_phone: str | None
    guest_animal_name: str | None
    guest_animal_breed: str | None
    guest_animal_notes: str | None
    pet: PetOut | None
    service: ServiceOut
