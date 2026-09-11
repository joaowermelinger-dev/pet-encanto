from datetime import datetime

from pydantic import BaseModel

from app.models.common import SubscriptionFrequency, SubscriptionStatus
from app.schemas.base import ORMBase
from app.schemas.pet import PetOut
from app.schemas.service import ServiceOut


class SubscriptionCreate(BaseModel):
    pet_id: int
    service_id: int
    frequency: SubscriptionFrequency
    first_occurrence_at: datetime


class SubscriptionUpdate(BaseModel):
    status: SubscriptionStatus


class SubscriptionOut(ORMBase):
    id: int
    pet_id: int
    service_id: int
    frequency: SubscriptionFrequency
    first_occurrence_at: datetime
    status: SubscriptionStatus
    pet: PetOut
    service: ServiceOut
    next_occurrence_at: datetime | None = None
