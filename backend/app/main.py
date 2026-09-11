"""
Ponto de entrada da API.

Sobe com:  uvicorn app.main:app --reload
Docs em :  http://localhost:8000/docs   (desabilitado em produção)

Todas as rotas ficam sob o prefixo /api — o mesmo que o proxy do Vite usa no
frontend (ver vite.config.ts).
"""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from app.api.routes import appointments, auth, clients, pets, public, services, shop_info
from app.core.config import settings
from app.core.csrf import CsrfMiddleware
from app.core.http_headers import SecurityHeadersMiddleware

_dist_env = os.getenv("FRONTEND_DIST")
_DIST = (
    Path(_dist_env)
    if _dist_env
    else Path(__file__).resolve().parent.parent.parent / "dist"
)
_SERVING_SPA = _DIST.is_dir()

_UPLOADS_DIR = Path(__file__).resolve().parent.parent / settings.UPLOADS_DIR

app = FastAPI(
    title="Pet-Encanto — API",
    version="1.0.0",
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None,
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.add_middleware(CsrfMiddleware)
app.add_middleware(SecurityHeadersMiddleware, serving_spa=_SERVING_SPA)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["infra"])
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api")
app.include_router(shop_info.router, prefix="/api")
app.include_router(clients.router, prefix="/api")
app.include_router(pets.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(public.router, prefix="/api")

# Fotos enviadas no admin (pets, produtos) — servidas como estático.
if _UPLOADS_DIR.is_dir():
    app.mount("/uploads", StaticFiles(directory=_UPLOADS_DIR), name="uploads")


# --- Servir o SPA (opcional) ------------------------------------------------
if _SERVING_SPA:
    _assets = _DIST / "assets"
    if _assets.is_dir():
        app.mount("/assets", StaticFiles(directory=_assets), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def _serve_spa(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            return FileResponse(_DIST / "index.html", status_code=404)
        candidate = _DIST / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(_DIST / "index.html")
