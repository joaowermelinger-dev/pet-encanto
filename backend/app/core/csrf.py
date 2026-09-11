"""
Proteção CSRF pelo padrão **double-submit cookie**.

Contexto: a sessão vive em cookies ``httpOnly`` + ``SameSite=lax``. O SameSite
já barra a maioria dos ataques CSRF. Isto aqui é a segunda camada.

Como funciona:
1. No login/refresh a API seta um cookie ``petencanto_csrf`` **legível pelo
   JS** (não é httpOnly) com um valor aleatório.
2. O frontend lê esse cookie e repete o valor no cabeçalho ``X-CSRF-Token`` em
   toda requisição que altera dados (POST/PUT/PATCH/DELETE).
3. Este middleware compara cookie x cabeçalho. Um site atacante consegue até
   fazer o navegador enviar o cookie, mas **não consegue ler o valor** (Same
   Origin Policy) para pôr no cabeçalho — então a comparação falha.

Rotas isentas: login (acontece antes de existir sessão), refresh (protegido
pelo próprio refresh token opaco, de path restrito) e logout (idempotente).
"""

import secrets

from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

CSRF_COOKIE_NAME = "petencanto_csrf"
CSRF_HEADER_NAME = "x-csrf-token"

_SAFE_METHODS = frozenset({"GET", "HEAD", "OPTIONS", "TRACE"})
_EXEMPT_PATHS = frozenset(
    {
        "/api/auth/login",
        "/api/auth/refresh",
        "/api/auth/logout",
    }
)


def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)


class CsrfMiddleware:
    """Rejeita (403) mutações em ``/api/*`` sem o par cookie+cabeçalho CSRF."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        method: str = scope["method"]
        path: str = scope.get("path", "")

        needs_check = (
            method not in _SAFE_METHODS
            and path.startswith("/api/")
            and path not in _EXEMPT_PATHS
        )

        if needs_check and not self._token_ok(scope):
            response = JSONResponse(
                {"detail": "Requisição bloqueada por proteção CSRF. Recarregue a página e tente de novo."},
                status_code=403,
            )
            await response(scope, receive, send)
            return

        await self.app(scope, receive, send)

    @staticmethod
    def _token_ok(scope: Scope) -> bool:
        headers = dict(scope.get("headers") or [])
        header_token = headers.get(CSRF_HEADER_NAME.encode(), b"").decode()

        cookie_header = headers.get(b"cookie", b"").decode()
        cookie_token = ""
        for part in cookie_header.split(";"):
            name, _, value = part.strip().partition("=")
            if name == CSRF_COOKIE_NAME:
                cookie_token = value
                break

        return bool(cookie_token) and bool(header_token) and secrets.compare_digest(
            cookie_token, header_token
        )
