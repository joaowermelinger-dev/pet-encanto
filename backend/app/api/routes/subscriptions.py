"""Clubinho: atendimento recorrente (semanal/quinzenal/mensal) pra um pet."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import CurrentUser, DbSession
from app.models.common import SubscriptionStatus
from app.models.pet import Pet
from app.models.service import Service
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionOut, SubscriptionUpdate
from app.services.subscription_service import (
    cancel_future_appointments,
    generate_occurrences,
    get_next_occurrence_at,
)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

_LOAD_OPTS = (selectinload(Subscription.pet).selectinload(Pet.client), selectinload(Subscription.service))


def _get_or_404(db: DbSession, subscription_id: int) -> Subscription:
    subscription = db.scalar(
        select(Subscription).where(Subscription.id == subscription_id).options(*_LOAD_OPTS)
    )
    if subscription is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clubinho não encontrado.")
    return subscription


def _with_next_occurrence(db: DbSession, subscription: Subscription) -> Subscription:
    subscription.next_occurrence_at = get_next_occurrence_at(db, subscription)  # type: ignore[attr-defined]
    return subscription


@router.get("", response_model=list[SubscriptionOut])
def list_subscriptions(user: CurrentUser, db: DbSession) -> list[Subscription]:
    subscriptions = list(db.scalars(select(Subscription).options(*_LOAD_OPTS).order_by(Subscription.created_at.desc())))
    return [_with_next_occurrence(db, s) for s in subscriptions]


@router.post("", response_model=SubscriptionOut, status_code=status.HTTP_201_CREATED)
def create_subscription(payload: SubscriptionCreate, user: CurrentUser, db: DbSession) -> Subscription:
    if db.get(Pet, payload.pet_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")
    if db.get(Service, payload.service_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Serviço não encontrado.")

    subscription = Subscription(**payload.model_dump())
    db.add(subscription)
    db.flush()  # garante subscription.id pros appointments gerados
    subscription = _get_or_404(db, subscription.id)  # recarrega com pet/service já carregados
    generate_occurrences(db, subscription, from_last_existing=False)
    db.commit()
    return _with_next_occurrence(db, _get_or_404(db, subscription.id))


@router.patch("/{subscription_id}", response_model=SubscriptionOut)
def update_subscription(
    subscription_id: int, payload: SubscriptionUpdate, user: CurrentUser, db: DbSession
) -> Subscription:
    subscription = _get_or_404(db, subscription_id)
    subscription.status = payload.status
    if payload.status == SubscriptionStatus.CANCELLED:
        cancel_future_appointments(db, subscription)
    db.commit()
    return _with_next_occurrence(db, _get_or_404(db, subscription_id))


@router.post("/{subscription_id}/extend", response_model=SubscriptionOut)
def extend_subscription(subscription_id: int, user: CurrentUser, db: DbSession) -> Subscription:
    subscription = _get_or_404(db, subscription_id)
    if subscription.status != SubscriptionStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Só dá pra gerar mais atendimentos de um clubinho ativo.",
        )
    generate_occurrences(db, subscription, from_last_existing=True)
    db.commit()
    return _with_next_occurrence(db, _get_or_404(db, subscription_id))
