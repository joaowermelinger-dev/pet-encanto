"""
Endpoints públicos (sem autenticação) consumidos pela landing page.

Só devolvem o que estiver marcado como público/ativo — nunca dados internos do
admin. Nas próximas fases (serviços, produtos, galeria) os endpoints
correspondentes entram aqui.
"""

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import DbSession
from app.models.shop_info import ShopInfo
from app.schemas.shop_info import ShopInfoOut

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/shop-info", response_model=ShopInfoOut | None)
def public_shop_info(db: DbSession) -> ShopInfo | None:
    return db.scalar(select(ShopInfo).where(ShopInfo.id == 1))
