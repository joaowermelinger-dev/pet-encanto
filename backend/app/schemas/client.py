from pydantic import BaseModel

from app.schemas.base import ORMBase
from app.schemas.pet import PetOut


class ClientCreate(BaseModel):
    name: str
    phone: str
    email: str | None = None
    address: str | None = None
    notes: str | None = None


class ClientUpdate(ClientCreate):
    pass


class ClientOut(ORMBase):
    id: int
    name: str
    phone: str
    email: str | None
    address: str | None
    notes: str | None


class ClientWithPetsOut(ClientOut):
    pets: list[PetOut] = []
