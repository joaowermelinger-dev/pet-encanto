"""Base compartilhada pelos schemas de saída (ORM -> Pydantic)."""

from pydantic import BaseModel, ConfigDict


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
