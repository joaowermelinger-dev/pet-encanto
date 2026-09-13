"""Galeria de fotos (admin): upload, listagem, edição e remoção.

Fotos ficam em disco, em ``backend/uploads/gallery`` — servidas como estático
em ``/uploads/gallery/...`` (ver ``app.main``). Só as marcadas como
``is_public`` aparecem na landing page (``/public/gallery``).
"""

import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.core.config import settings
from app.models.pet import Pet
from app.models.pet_photo import PetPhoto
from app.schemas.pet_photo import PetPhotoOut, PetPhotoUpdate

router = APIRouter(prefix="/pet-photos", tags=["pet-photos"])

_GALLERY_DIR = Path(__file__).resolve().parent.parent.parent.parent / settings.UPLOADS_DIR / "gallery"
_ALLOWED_CONTENT_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
_MAX_BYTES = 5 * 1024 * 1024


def _get_or_404(db: DbSession, photo_id: int) -> PetPhoto:
    photo = db.get(PetPhoto, photo_id)
    if photo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Foto não encontrada.")
    return photo


@router.get("", response_model=list[PetPhotoOut])
def list_photos(user: CurrentUser, db: DbSession) -> list[PetPhoto]:
    return list(db.scalars(select(PetPhoto).order_by(PetPhoto.created_at.desc())))


@router.post("", response_model=PetPhotoOut, status_code=status.HTTP_201_CREATED)
async def upload_photo(
    user: CurrentUser,
    db: DbSession,
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    pet_id: int | None = Form(None),
    is_public: bool = Form(True),
) -> PetPhoto:
    extension = _ALLOWED_CONTENT_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Formato de imagem não suportado. Use JPEG, PNG ou WEBP.",
        )
    if pet_id is not None and db.get(Pet, pet_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")

    contents = await file.read()
    if len(contents) > _MAX_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Imagem muito grande (máx. 5MB).")

    _GALLERY_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    (_GALLERY_DIR / filename).write_bytes(contents)

    photo = PetPhoto(
        pet_id=pet_id,
        image_url=f"/uploads/gallery/{filename}",
        caption=caption or None,
        is_public=is_public,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.patch("/{photo_id}", response_model=PetPhotoOut)
def update_photo(photo_id: int, payload: PetPhotoUpdate, user: CurrentUser, db: DbSession) -> PetPhoto:
    photo = _get_or_404(db, photo_id)
    if payload.pet_id is not None and db.get(Pet, payload.pet_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet não encontrado.")
    for field, value in payload.model_dump().items():
        setattr(photo, field, value)
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_photo(photo_id: int, user: CurrentUser, db: DbSession) -> None:
    photo = _get_or_404(db, photo_id)
    file_path = Path(__file__).resolve().parent.parent.parent.parent / photo.image_url.lstrip("/")
    db.delete(photo)
    db.commit()
    if file_path.is_file():
        file_path.unlink(missing_ok=True)
