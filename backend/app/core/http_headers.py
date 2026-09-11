"""
Middleware ASGI que carimba cabeçalhos de segurança em toda resposta.

É ASGI "cru" (não ``BaseHTTPMiddleware``) para não atrapalhar respostas de
arquivo (``StaticFiles``/``FileResponse``) quando a API serve o SPA ou as fotos
enviadas pelo admin.
"""

from starlette.datastructures import MutableHeaders
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.core.config import settings

_API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"

_SPA_CSP = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "font-src 'self' data:; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'self'; "
    "form-action 'self'; "
    "object-src 'none'"
)

_DOCS_PATHS = ("/docs", "/redoc", "/openapi.json")


class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp, *, serving_spa: bool = False) -> None:
        self.app = app
        self.serving_spa = serving_spa

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path: str = scope.get("path", "")
        skip_csp = path in _DOCS_PATHS

        async def send_wrapper(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = MutableHeaders(scope=message)
                headers.setdefault("X-Content-Type-Options", "nosniff")
                headers.setdefault("X-Frame-Options", "DENY")
                headers.setdefault("Referrer-Policy", "no-referrer")
                headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
                headers.setdefault(
                    "Permissions-Policy",
                    "camera=(), microphone=(), geolocation=(), payment=()",
                )
                if settings.is_production:
                    headers.setdefault(
                        "Strict-Transport-Security",
                        "max-age=31536000; includeSubDomains",
                    )
                if not skip_csp:
                    headers.setdefault(
                        "Content-Security-Policy",
                        _SPA_CSP if self.serving_spa else _API_CSP,
                    )
            await send(message)

        await self.app(scope, receive, send_wrapper)
