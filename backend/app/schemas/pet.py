from datetime import date

from pydantic import BaseModel

from app.models.common import PetSize, PetSpecies
from app.schemas.base import ORMBase


class PetCreate(BaseModel):
    client_id: int
    name: str
    species: PetSpecies = PetSpecies.OTHER
    breed: str | None = None
    size: PetSize | None = None
    birth_date: date | None = None
    notes: str | None = None


class PetUpdate(BaseModel):
    name: str
    species: PetSpecies
    breed: str | None = None
    size: PetSize | None = None
    birth_date: date | None = None
    notes: str | None = None


class PetOut(ORMBase):
    id: int
    client_id: int
    name: str
    species: PetSpecies
    breed: str | None
    size: PetSize | None
    birth_date: date | None
    notes: str | None
    client_name: str | None = None
