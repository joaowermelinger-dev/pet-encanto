from datetime import date
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.base import ORMBase


class ExpenseCreate(BaseModel):
    description: str
    amount: Decimal
    expense_date: date


class ExpenseOut(ORMBase):
    id: int
    description: str
    amount: Decimal
    expense_date: date
