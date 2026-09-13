"""appointments: múltiplos serviços por atendimento (appointment_service_items)

Revision ID: 0008
Revises: 0007
Create Date: 2026-09-13
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    op.create_table(
        "appointment_service_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "appointment_id",
            sa.Integer(),
            sa.ForeignKey("appointments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "service_id",
            sa.Integer(),
            sa.ForeignKey("services.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
    )
    op.create_index(
        "ix_appointment_service_items_appointment_id", "appointment_service_items", ["appointment_id"]
    )
    op.create_index("ix_appointment_service_items_service_id", "appointment_service_items", ["service_id"])

    # Migra cada atendimento existente para um item único (o serviço/preço que já tinha).
    op.execute(
        "INSERT INTO appointment_service_items (appointment_id, service_id, price) "
        "SELECT id, service_id, price FROM appointments"
    )

    op.drop_column("appointments", "service_id")


def downgrade() -> None:
    op.add_column("appointments", sa.Column("service_id", sa.Integer(), nullable=True))
    op.execute(
        "UPDATE appointments SET service_id = ("
        "SELECT service_id FROM appointment_service_items "
        "WHERE appointment_service_items.appointment_id = appointments.id "
        "ORDER BY appointment_service_items.id LIMIT 1"
        ")"
    )
    op.alter_column("appointments", "service_id", nullable=False)
    op.create_foreign_key(
        "appointments_service_id_fkey", "appointments", "services", ["service_id"], ["id"], ondelete="RESTRICT"
    )
    op.drop_table("appointment_service_items")
