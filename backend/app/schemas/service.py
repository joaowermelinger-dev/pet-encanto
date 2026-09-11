from decimal import Decimal

from pydantic import BaseModel

from app.schemas.base import ORMBase


class ServiceCreate(BaseModel):
    name: str
    description: str | None = None
    duration_minutes: int = 30
    price: Decimal
    is_public: bool = False
    is_active: bool = True


class ServiceUpdate(ServiceCreate):
    pass


class ServiceOut(ORMBase):
    id: int
    name: str
    description: str | None
    duration_minutes: int
    price: Decimal
    is_public: bool
    is_active: bool
