"""pet_photos (galeria da landing page)

Revision ID: 0009
Revises: 0008
Create Date: 2026-09-13
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0009"
down_revision: Union[str, None] = "0008"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    op.create_table(
        "pet_photos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "pet_id",
            sa.Integer(),
            sa.ForeignKey("pets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("image_url", sa.String(500), nullable=False),
        sa.Column("caption", sa.String(200), nullable=True),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pet_photos_pet_id", "pet_photos", ["pet_id"])


def downgrade() -> None:
    op.drop_table("pet_photos")
