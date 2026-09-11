"""Resumo financeiro: receita dos atendimentos pagos + despesas, num período."""

from collections import defaultdict
from datetime import date, datetime, time, timedelta
from decimal import Decimal

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.appointment import Appointment
from app.models.common import AppointmentStatus, PaymentMethod
from app.models.expense import Expense
from app.schemas.finance import DailyTotal, FinanceSummary, RevenueByMethod

router = APIRouter(prefix="/finance", tags=["finance"])


@router.get("/summary", response_model=FinanceSummary)
def get_summary(date_from: date, date_to: date, user: CurrentUser, db: DbSession) -> FinanceSummary:
    range_start = datetime.combine(date_from, time.min)
    range_end = datetime.combine(date_to, time.max)

    appointments = list(
        db.scalars(
            select(Appointment).where(
                Appointment.scheduled_at >= range_start,
                Appointment.scheduled_at <= range_end,
            )
        )
    )

    total_revenue = Decimal("0")
    total_pending = Decimal("0")
    by_method: dict[str, Decimal] = {m.value: Decimal("0") for m in PaymentMethod}
    daily: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))

    for appointment in appointments:
        if appointment.paid:
            total_revenue += appointment.price
            method = appointment.payment_method.value if appointment.payment_method else PaymentMethod.OTHER.value
            by_method[method] += appointment.price
            daily[appointment.scheduled_at.date().isoformat()] += appointment.price
        elif appointment.status != AppointmentStatus.CANCELLED:
            total_pending += appointment.price

    expenses = list(
        db.scalars(
            select(Expense)
            .where(Expense.expense_date >= date_from, Expense.expense_date <= date_to)
            .order_by(Expense.expense_date.desc())
        )
    )
    total_expenses = sum((e.amount for e in expenses), Decimal("0"))

    daily_list = []
    current = date_from
    while current <= date_to:
        key = current.isoformat()
        daily_list.append(DailyTotal(date=key, revenue=daily.get(key, Decimal("0"))))
        current += timedelta(days=1)

    return FinanceSummary(
        total_revenue=total_revenue,
        total_pending=total_pending,
        total_expenses=total_expenses,
        net=total_revenue - total_expenses,
        revenue_by_method=RevenueByMethod(**by_method),
        daily=daily_list,
        expenses=expenses,
    )
