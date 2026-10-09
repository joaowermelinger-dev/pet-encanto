"""corrige horários já salvos para o fuso de Brasília

Antes da 2.4 o frontend mandava o horário sem fuso (ex.: 14:00) e o PostgreSQL
o interpretava no fuso da sessão (UTC no Neon), então um atendimento das 14:00
ficou gravado como 14:00 UTC e aparecia como 11:00. Aqui o horário "de parede"
de cada registro, no fuso em que foi gravado, é reinterpretado como horário de
Brasília. Se o banco já estiver em America/Sao_Paulo, nada muda. O Alembic
roda esta revisão uma única vez por banco.

Revision ID: 0010
Revises: 0009
Create Date: 2026-10-09
"""
from typing import Sequence, Union

from alembic import op

revision: str = "0010"
down_revision: Union[str, None] = "0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_COLUMNS = (("appointments", "scheduled_at"), ("subscriptions", "first_occurrence_at"))


def upgrade() -> None:
    for table, column in _COLUMNS:
        op.execute(
            f"UPDATE {table} SET {column} = "
            f"({column} AT TIME ZONE current_setting('TimeZone')) AT TIME ZONE 'America/Sao_Paulo'"
        )


def downgrade() -> None:
    for table, column in _COLUMNS:
        op.execute(
            f"UPDATE {table} SET {column} = "
            f"({column} AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE current_setting('TimeZone')"
        )
