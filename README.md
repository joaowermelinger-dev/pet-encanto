# 🐾 Pet Encanto

App web de gestão para petshop: landing page pública (serviços, mostruário,
galeria de pets, contato) e uma área administrativa privada para o dono cuidar
de clientes, pets, agenda, estoque e vendas. Interface em português.

**No ar:** [pet-encanto.vercel.app](https://pet-encanto.vercel.app)

## Funcionalidades

- **Landing page pública** — serviços, mostruário de produtos, galeria de fotos
  dos clientes (pets) e contato/localização. Botão de login no topo.
- **Login único do dono** — sessão em cookies httpOnly (JWT + refresh
  rotacionado) com proteção CSRF, sem cadastro público.
- **Área administrativa** (`/admin`) — em construção por fases:
  clientes & pets, agenda de atendimentos, estoque & produtos, vendas &
  financeiro, galeria e configurações do petshop.
- **Atualizações** (`/admin/updates`) — changelog do app, uma entrada por
  entrega.

## Arquitetura

```
Pet-Encanto/
├── src/                # frontend — React 19 + Vite + Tailwind + react-query
│   ├── api/            # cliente HTTP e chamadas à API
│   ├── auth/           # contexto de login + rota protegida
│   ├── pages/          # Landing, Login, páginas do admin
│   ├── components/     # UI compartilhada (seções da landing, etc.)
│   └── data/           # changelog
└── backend/            # API — FastAPI + SQLAlchemy + Alembic
    └── app/
        ├── api/routes/ # um router por recurso (auth, shop-info, public, ...)
        ├── models/     # um arquivo por entidade (SQLAlchemy)
        ├── schemas/    # Pydantic (request/response)
        └── core/       # config, banco, segurança, CSRF
```

O frontend chama sempre `/api/...`; em desenvolvimento o Vite faz **proxy**
dessas rotas para o backend (`vite.config.ts`), assim o cookie de sessão
funciona sem CORS.

## Como rodar localmente

Precisa de **dois processos** rodando ao mesmo tempo, mais um PostgreSQL local.

### 1. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # ajuste DATABASE_URL, SECRET_KEY e FIRST_ADMIN_*
python -m scripts.create_database
alembic upgrade head
python -m scripts.seed_admin    # cria a conta do dono a partir do .env
uvicorn app.main:app --reload --port 8001   # -> http://localhost:8001
```

### 2. Frontend

```bash
npm install
npm run dev                      # -> http://localhost:5173
```

Abra <http://localhost:5173> e entre com o e-mail/senha definidos em
`FIRST_ADMIN_EMAIL`/`FIRST_ADMIN_PASSWORD` no `.env`.

## Scripts (frontend)

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento (Vite) |
| `npm run build` | type-check + build de produção |
| `npm run lint` | oxlint |
| `npm run preview` | serve o build de produção |

## Deploy

Frontend na Vercel, API no Render, banco no Neon — grátis. Passo a passo
completo em [`DEPLOY.md`](DEPLOY.md).
