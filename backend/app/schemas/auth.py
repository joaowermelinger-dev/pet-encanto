from pydantic import BaseModel, EmailStr

from app.models.common import UserRole
from app.schemas.base import ORMBase


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(ORMBase):
    id: int
    email: str
    name: str
    role: UserRole
