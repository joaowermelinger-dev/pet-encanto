"""appointments: price, paid

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-11
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    # server_default garante que agendamentos já existentes recebam um valor
    # válido (0) em vez de quebrar a migration; o app sempre manda um valor real.
    op.add_column("appointments", sa.Column("price", sa.Numeric(10, 2), nullable=False, server_default="0"))
    op.add_column(
        "appointments", sa.Column("paid", sa.Boolean(), nullable=False, server_default=sa.text("false"))
    )


def downgrade() -> None:
    op.drop_column("appointments", "paid")
    op.drop_column("appointments", "price")
