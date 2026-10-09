"""
Fuso horário do petshop.

O banco guarda ``scheduled_at`` como ``timestamptz`` (instante absoluto) e o
servidor/banco rodam em UTC. O formulário do front manda o horário "de parede"
sem fuso (ex.: ``2026-10-09T14:00:00``); sem tratamento isso era gravado como
14:00 UTC e aparecia 11:00 no navegador. Aqui fica a regra única:

- horário SEM fuso que chega na API = horário de Brasília;
- horário que sai da API vai sempre convertido para Brasília (``-03:00``).
"""

from datetime import date, datetime, time
from typing import Annotated
from zoneinfo import ZoneInfo

from pydantic import AfterValidator

LOCAL_TZ = ZoneInfo("America/Sao_Paulo")


def to_local(dt: datetime) -> datetime:
    """Sem fuso → assume Brasília; com fuso → converte para Brasília."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=LOCAL_TZ)
    return dt.astimezone(LOCAL_TZ)


def local_day_bounds(start: date, end: date) -> tuple[datetime, datetime]:
    """Início de ``start`` e fim de ``end`` no horário de Brasília."""
    return (
        datetime.combine(start, time.min, tzinfo=LOCAL_TZ),
        datetime.combine(end, time.max, tzinfo=LOCAL_TZ),
    )


# Use nos schemas no lugar de ``datetime`` para campos de data/hora de agenda.
LocalDateTime = Annotated[datetime, AfterValidator(to_local)]
