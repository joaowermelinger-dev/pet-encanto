"""
Endpoints públicos (sem autenticação) consumidos pela landing page.

Só devolvem o que estiver marcado como público/ativo — nunca dados internos do
admin. Nas próximas fases (serviços, produtos, galeria) os endpoints
correspondentes entram aqui.
"""

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import DbSession
from app.models.pet_photo import PetPhoto
from app.models.service import Service
from app.models.shop_info import ShopInfo
from app.schemas.pet_photo import PetPhotoOut
from app.schemas.service import ServicePublicOut
from app.schemas.shop_info import ShopInfoOut

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/shop-info", response_model=ShopInfoOut | None)
def public_shop_info(db: DbSession) -> ShopInfo | None:
    return db.scalar(select(ShopInfo).where(ShopInfo.id == 1))


@router.get("/services", response_model=list[ServicePublicOut])
def public_services(db: DbSession) -> list[Service]:
    stmt = select(Service).where(Service.is_public.is_(True), Service.is_active.is_(True)).order_by(Service.name)
    return list(db.scalars(stmt))


@router.get("/gallery", response_model=list[PetPhotoOut])
def public_gallery(db: DbSession) -> list[PetPhoto]:
    stmt = select(PetPhoto).where(PetPhoto.is_public.is_(True)).order_by(PetPhoto.created_at.desc())
    return list(db.scalars(stmt))
