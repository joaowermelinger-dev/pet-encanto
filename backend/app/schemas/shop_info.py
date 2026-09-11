from pydantic import BaseModel

from app.schemas.base import ORMBase


class ShopInfoOut(ORMBase):
    shop_name: str
    address: str
    phone: str
    whatsapp: str | None
    email: str | None
    instagram_url: str | None
    opening_hours: str
    latitude: float | None
    longitude: float | None


class ShopInfoUpdate(BaseModel):
    shop_name: str
    address: str
    phone: str
    whatsapp: str | None = None
    email: str | None = None
    instagram_url: str | None = None
    opening_hours: str = ""
    latitude: float | None = None
    longitude: float | None = None
