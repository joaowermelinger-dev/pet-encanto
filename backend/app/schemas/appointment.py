from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field, model_validator

from app.models.common import AppointmentStatus, PaymentMethod
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


class AppointmentItemIn(BaseModel):
    """Um serviço cobrado no atendimento — o total é a soma destes itens."""

    service_id: int
    price: Decimal


class _ItemsField(BaseModel):
    items: list[AppointmentItemIn] = Field(min_length=1)


class AppointmentCreate(_GuestFields, _ItemsField):
    scheduled_at: datetime
    paid: bool = False
    payment_method: PaymentMethod | None = None
    notes: str | None = None


class AppointmentUpdate(_GuestFields, _ItemsField):
    scheduled_at: datetime
    status: AppointmentStatus
    paid: bool
    payment_method: PaymentMethod | None = None
    notes: str | None = None


class AppointmentServiceItemOut(ORMBase):
    id: int
    service_id: int
    price: Decimal
    service: ServiceOut


class AppointmentOut(ORMBase):
    id: int
    pet_id: int | None
    scheduled_at: datetime
    status: AppointmentStatus
    price: Decimal
    paid: bool
    payment_method: PaymentMethod | None
    notes: str | None
    guest_client_name: str | None
    guest_client_phone: str | None
    guest_animal_name: str | None
    guest_animal_breed: str | None
    guest_animal_notes: str | None
    subscription_id: int | None
    pet: PetOut | None
    items: list[AppointmentServiceItemOut]
