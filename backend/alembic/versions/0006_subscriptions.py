"""subscriptions (Clubinho) + appointments.subscription_id

Revision ID: 0006
Revises: 0005
Create Date: 2026-09-11
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    op.create_table(
        "subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("pet_id", sa.Integer(), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("service_id", sa.Integer(), sa.ForeignKey("services.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("frequency", sa.String(20), nullable=False),
        sa.Column("first_occurrence_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_subscriptions_pet_id", "subscriptions", ["pet_id"])
    op.create_index("ix_subscriptions_service_id", "subscriptions", ["service_id"])

    op.add_column(
        "appointments",
        sa.Column("subscription_id", sa.Integer(), sa.ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_appointments_subscription_id", "appointments", ["subscription_id"])


def downgrade() -> None:
    op.drop_index("ix_appointments_subscription_id", table_name="appointments")
    op.drop_column("appointments", "subscription_id")
    op.drop_index("ix_subscriptions_service_id", table_name="subscriptions")
    op.drop_index("ix_subscriptions_pet_id", table_name="subscriptions")
    op.drop_table("subscriptions")
