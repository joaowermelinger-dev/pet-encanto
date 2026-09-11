"""CRUD de clientes (donos dos pets)."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import CurrentUser, DbSession
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientOut, ClientUpdate, ClientWithPetsOut

router = APIRouter(prefix="/clients", tags=["clients"])


def _get_or_404(db: DbSession, client_id: int) -> Client:
    client = db.scalar(
        select(Client).where(Client.id == client_id).options(selectinload(Client.pets))
    )
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    return client


@router.get("", response_model=list[ClientOut])
def list_clients(user: CurrentUser, db: DbSession, q: str | None = None) -> list[Client]:
    stmt = select(Client).order_by(Client.name)
    if q:
        stmt = stmt.where(Client.name.ilike(f"%{q}%"))
    return list(db.scalars(stmt))


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, user: CurrentUser, db: DbSession) -> Client:
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/{client_id}", response_model=ClientWithPetsOut)
def get_client(client_id: int, user: CurrentUser, db: DbSession) -> Client:
    return _get_or_404(db, client_id)


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, payload: ClientUpdate, user: CurrentUser, db: DbSession) -> Client:
    client = _get_or_404(db, client_id)
    for field, value in payload.model_dump().items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, user: CurrentUser, db: DbSession) -> None:
    client = _get_or_404(db, client_id)
    db.delete(client)
    db.commit()
