"""CRUD do catálogo de serviços."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentUser, DbSession
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter(prefix="/services", tags=["services"])


def _get_or_404(db: DbSession, service_id: int) -> Service:
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Serviço não encontrado.")
    return service


@router.get("", response_model=list[ServiceOut])
def list_services(user: CurrentUser, db: DbSession) -> list[Service]:
    return list(db.scalars(select(Service).order_by(Service.name)))


@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(payload: ServiceCreate, user: CurrentUser, db: DbSession) -> Service:
    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, payload: ServiceUpdate, user: CurrentUser, db: DbSession) -> Service:
    service = _get_or_404(db, service_id)
    for field, value in payload.model_dump().items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, user: CurrentUser, db: DbSession) -> None:
    service = _get_or_404(db, service_id)
    db.delete(service)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Não é possível apagar: há agendamentos usando este serviço. Desative-o em vez de apagar.",
        )
