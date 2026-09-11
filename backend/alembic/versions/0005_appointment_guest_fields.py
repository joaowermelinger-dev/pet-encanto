"""appointments: pet_id nullable + campos de cliente avulso

Revision ID: 0005
Revises: 0004
Create Date: 2026-09-11
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    op.alter_column("appointments", "pet_id", existing_type=sa.Integer(), nullable=True)
    op.add_column("appointments", sa.Column("guest_client_name", sa.String(120), nullable=True))
    op.add_column("appointments", sa.Column("guest_client_phone", sa.String(40), nullable=True))
    op.add_column("appointments", sa.Column("guest_animal_name", sa.String(80), nullable=True))
    op.add_column("appointments", sa.Column("guest_animal_breed", sa.String(80), nullable=True))
    op.add_column("appointments", sa.Column("guest_animal_notes", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("appointments", "guest_animal_notes")
    op.drop_column("appointments", "guest_animal_breed")
    op.drop_column("appointments", "guest_animal_name")
    op.drop_column("appointments", "guest_client_phone")
    op.drop_column("appointments", "guest_client_name")
    op.alter_column("appointments", "pet_id", existing_type=sa.Integer(), nullable=False)
