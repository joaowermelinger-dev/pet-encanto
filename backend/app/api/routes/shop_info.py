"""Dados do petshop (contato/localização) exibidos na landing page e editados no admin."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.shop_info import ShopInfo
from app.schemas.shop_info import ShopInfoOut, ShopInfoUpdate

router = APIRouter(prefix="/shop-info", tags=["shop-info"])


def _get_singleton(db: DbSession) -> ShopInfo:
    row = db.scalar(select(ShopInfo).where(ShopInfo.id == 1))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dados do petshop não configurados.")
    return row


@router.get("", response_model=ShopInfoOut)
def get_shop_info(db: DbSession) -> ShopInfo:
    return _get_singleton(db)


@router.patch("", response_model=ShopInfoOut)
def update_shop_info(payload: ShopInfoUpdate, user: CurrentUser, db: DbSession) -> ShopInfo:
    row = _get_singleton(db)
    for field, value in payload.model_dump().items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row
