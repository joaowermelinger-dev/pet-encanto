"""CRUD de pets, sempre vinculados a um cliente."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.client import Client
from app.models.pet import Pet
from app.schemas.pet import PetCreate, PetOut, PetUpdate

router = APIRouter(prefix="/pets", tags=["pets"])


def _get_or_404(db: DbSession, pet_id: int) -> Pet:
    pet = db.get(Pet, pet_id)
    if pet is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")
    return pet


@router.get("", response_model=list[PetOut])
def list_pets(user: CurrentUser, db: DbSession, client_id: int | None = None) -> list[Pet]:
    stmt = select(Pet).order_by(Pet.name)
    if client_id is not None:
        stmt = stmt.where(Pet.client_id == client_id)
    return list(db.scalars(stmt))


@router.post("", response_model=PetOut, status_code=status.HTTP_201_CREATED)
def create_pet(payload: PetCreate, user: CurrentUser, db: DbSession) -> Pet:
    if db.get(Client, payload.client_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    pet = Pet(**payload.model_dump())
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet


@router.get("/{pet_id}", response_model=PetOut)
def get_pet(pet_id: int, user: CurrentUser, db: DbSession) -> Pet:
    return _get_or_404(db, pet_id)


@router.patch("/{pet_id}", response_model=PetOut)
def update_pet(pet_id: int, payload: PetUpdate, user: CurrentUser, db: DbSession) -> Pet:
    pet = _get_or_404(db, pet_id)
    for field, value in payload.model_dump().items():
        setattr(pet, field, value)
    db.commit()
    db.refresh(pet)
    return pet


@router.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pet(pet_id: int, user: CurrentUser, db: DbSession) -> None:
    pet = _get_or_404(db, pet_id)
    db.delete(pet)
    db.commit()
