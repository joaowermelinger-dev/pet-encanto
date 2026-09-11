from decimal import Decimal

from pydantic import BaseModel

from app.schemas.expense import ExpenseOut


class DailyTotal(BaseModel):
    date: str
    revenue: Decimal


class RevenueByMethod(BaseModel):
    cash: Decimal
    card: Decimal
    pix: Decimal
    other: Decimal


class FinanceSummary(BaseModel):
    total_revenue: Decimal
    """Soma dos atendimentos PAGOS no período."""
    total_pending: Decimal
    """Soma dos atendimentos ainda NÃO pagos no período (não entra no saldo)."""
    total_expenses: Decimal
    net: Decimal
    revenue_by_method: RevenueByMethod
    daily: list[DailyTotal]
    expenses: list[ExpenseOut]
