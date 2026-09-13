from datetime import datetime

from pydantic import BaseModel

from app.schemas.base import ORMBase


class PetPhotoUpdate(BaseModel):
    pet_id: int | None = None
    caption: str | None = None
    is_public: bool = True


class PetPhotoOut(ORMBase):
    id: int
    pet_id: int | None
    image_url: str
    caption: str | None
    is_public: bool
    created_at: datetime
