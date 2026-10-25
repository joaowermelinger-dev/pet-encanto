# Pet Encanto — mapa do sistema

> **Leia este arquivo antes de qualquer alteração.** Ele diz onde fica cada
> coisa; abra só os arquivos ligados ao pedido, não o código inteiro.
> Ao terminar uma alteração, atualize este mapa (se a estrutura mudou) e
> adicione a entrada no changelog (`src/data/changelog.ts`).
>
> Última atualização do mapa: 2026-10-25 (versão do app: 2.6)

## O que é

App de petshop (banho, tosa etc.) com duas partes:
- **Landing page pública** (`/`): apresentação, serviços (lista fixa, sem preço; valor combinado pelo WhatsApp), galeria de fotos, depoimentos, diferenciais, contato.
- **Área administrativa** (`/admin`), login único do dono: clientes e pets, atendimentos, Clubinho (assinaturas recorrentes), financeiro, galeria, configurações, atualizações (changelog).

Interface toda em português. No ar: pet-encanto.vercel.app

## Stack

| Parte | Tecnologia | Pasta |
|---|---|---|
| Frontend | React 19 + Vite 8 + Tailwind 4 + react-query + react-router 7, TypeScript | `src/` |
| Backend | FastAPI + SQLAlchemy + Alembic (PostgreSQL) | `backend/` |
| Deploy | Vercel (front, `vercel.json`), Render (API, `render.yaml`), Neon (banco) | `DEPLOY.md` |

Deploy: push na `main` publica o front na Vercel sozinho. A API no Render **não** publica sozinha (o `render.yaml` diz `autoDeploy: true`, mas o serviço no painel não segue isso): mudança no backend exige Manual Deploy → Deploy latest commit no painel do Render.

Local: backend `uvicorn app.main:app --reload --port 8001`; frontend `npm run dev` (5173). O Vite faz proxy de `/api` e `/uploads` para a porta 8001 (`vite.config.ts`). Passo a passo em `README.md`.

## Padrão de cada funcionalidade (onde mexer)

Quase toda funcionalidade segue a mesma trilha. Para alterar uma, abra só a linha dela:

```
backend/app/models/<x>.py      tabela (SQLAlchemy)
backend/app/schemas/<x>.py     formato de entrada/saída (Pydantic)
backend/app/api/routes/<x>.py  endpoints (/api/<x>)
backend/alembic/versions/      migração, se mudar tabela
src/types/index.ts             tipos TS espelhando os schemas
src/api/<x>.ts                 chamadas HTTP
src/hooks/use<X>.ts            react-query (cache/invalidação)
src/pages/admin/<Página>.tsx   tela
```

| Funcionalidade | Backend (models / routes) | Frontend (api / hooks / tela) |
|---|---|---|
| Login | `user.py`, `refresh_token.py` / `auth.py` (`/auth/login, logout, me, refresh`) | `api/auth.ts`, `auth/AuthContext.tsx`, `auth/ProtectedRoute.tsx`, `pages/Login.tsx` |
| Clientes | `client.py` / `clients.py` (CRUD; GET `/{id}` traz pets) | `api/clients.ts`, `useClients.ts`, `admin/Clients.tsx` (filtro "Sumidos"; busca por nome/telefone/pet feita no navegador), `admin/ClientDetail.tsx` (histórico dos pets) |
| Pets | `pet.py` / `pets.py` (CRUD) | `api/pets.ts`, `usePets.ts`, dentro de `ClientDetail.tsx` (`PetFormModal`: criar/editar com porte, nascimento, observações) |
| Serviços (catálogo) | `service.py` / `services.py` (CRUD) | `api/services.ts`, `useServices.ts`, `components/settings/ServiceCatalog.tsx` |
| Atendimentos | `appointment.py`, `appointment_service.py` / `appointments.py` (GET, POST, PATCH, DELETE; GET sem datas traz todos) | `api/appointments.ts`, `useAppointments.ts` (`useAllAppointments` para histórico/sumidos), `admin/Appointments.tsx` (visão Dia/Semana; aviso de horário ocupado no formulário; maior tela) |
| Clubinho | `subscription.py` / `subscriptions.py` (+ `/{id}/extend`), lógica em `services/subscription_service.py` | `api/subscriptions.ts`, `useSubscriptions.ts`, `admin/Clubinho.tsx` |
| Financeiro | `expense.py` / `expenses.py`, `finance.py` (`/finance/summary`) | `api/expenses.ts`, `api/finance.ts`, `useFinance.ts`, `admin/Finance.tsx` |
| Galeria | `pet_photo.py` / `pet_photos.py` (upload em `backend/uploads/`) | `api/petPhotos.ts`, `usePetPhotos.ts`, `admin/Gallery.tsx` |
| Dados do petshop | `shop_info.py` (linha única id=1) / `shop_info.py` | `api/shopInfo.ts`, `useShopInfo.ts`, `components/settings/ShopInfoForm.tsx` |
| Rotas públicas | / `public.py` (`/public/shop-info`, `/public/gallery`) | `api/public.ts`, `usePublicShopInfo.ts`, `usePublicGallery.ts` |
| Painel (início admin) | usa atendimentos/financeiro | `admin/Dashboard.tsx` |
| Atualizações | (sem backend) | `data/changelog.ts` → `admin/Updates.tsx` |

Telas do admin: `src/App.tsx` (rotas) e o menu lateral em `src/pages/admin/AdminLayout.tsx` (`NAV_ITEMS`). `Settings.tsx` junta `ShopInfoForm` + `ServiceCatalog`.

## Landing page

`src/pages/Landing.tsx` monta, nesta ordem, os componentes de `src/components/landing/`:
`AnnouncementBar` → `Header` → `Hero` → `ServicesSection` → `GallerySection` → `TestimonialsSection` → `WhyChooseSection` → `CtaBanner` → `ContactSection` → `Footer`.
Apoio: `SectionHeading` (rótulo + título + subtítulo de cada seção), `Reveal` (animação ao rolar). Link de WhatsApp: `src/utils/whatsapp.ts`. Logo: `public/logo.png`.
Cores/fontes: `src/index.css`. A landing fica dentro de `<div className="landing">`, que sobrescreve as variáveis de cor (paleta própria) e usa a fonte Nunito; o admin continua com as cores do `:root` e Inter. Títulos em Fraunces (`font-display`).

## Regras de negócio importantes

- **Atendimento** pode ser de um pet cadastrado (`pet_id`) **ou** avulso (campos `guest_*`: nome/telefone do dono, nome/raça/observações do animal).
- Um atendimento tem **vários serviços** (`appointment_service_items`, preço de cada um copiado na hora). `Appointment.price` é o **total**, recalculado pelo backend a cada criação/edição.
- Status: `scheduled`, `completed`, `cancelled`. Pagamento: `paid` + `payment_method` (`cash`, `card`, `pix`, `other`; nulo enquanto não pago). Forma de pagamento pode ser trocada direto na lista.
- **Clubinho**: assinatura de um pet a um serviço, frequência `weekly`/`biweekly`/`monthly`, status `active`/`paused`/`cancelled`. Gera atendimentos normais com `subscription_id`; cancelar cancela os futuros agendados.
- **Financeiro**: receita (atendimentos pagos), pendente, despesas, líquido, receita por forma de pagamento e por dia.
- **Galeria**: foto pode ser ligada a um pet ou avulsa; só aparece na landing se `is_public`.
- **Visita / sumido** (`src/utils/visits.ts`): visita = atendimento já passado e não cancelado. Cliente sumido = última visita há mais de 30/60 dias e nada agendado. Atendimento avulso não entra (não tem cliente cadastrado).
- Enums ficam em `backend/app/models/common.py` e espelhados em `src/types/index.ts`.
- Valores em dinheiro vêm do backend como **string** (Decimal).
- **Fuso horário**: tudo em horário de Brasília. `backend/app/core/timezone.py` (`LOCAL_TZ`, `to_local`, `LocalDateTime`, `local_day_bounds`): horário sem fuso que chega na API é tratado como Brasília e a API devolve sempre com `-03:00`. Nos schemas use `LocalDateTime` em vez de `datetime` para horários de agenda. No front, data de hoje via `src/utils/date.ts` (`localISODate`), nunca `toISOString().slice(0, 10)` (dá a data em UTC).

## Infra e segurança (raramente precisa mexer)

- `backend/app/main.py`: registra todos os routers sob `/api`, serve `/uploads` e opcionalmente o build do SPA.
- `backend/app/core/`: `timezone.py` (fuso do petshop), `config.py` (variáveis do `.env`), `database.py`, `security.py` (JWT/senha), `csrf.py`, `http_headers.py`.
- Sessão em cookies httpOnly (JWT + refresh rotacionado) com CSRF. Cliente HTTP do front em `src/api/client.ts` (trata refresh e CSRF).
- Scripts: `backend/scripts/` (`create_database`, `seed_admin`).
- Não versionados: `backend/.env`, `backend/uploads/`, `.claude/`.

## Changelog

`src/data/changelog.ts`: array `CHANGELOG`, entrada mais nova **no topo**. Cada entrada: `id`, `version`, `date` (AAAA-MM-DD), `sections[]` com `title` e `changes[]` (`kind`: `'novo' | 'melhoria' | 'correção'`, `text`). Cada dia de trabalho vira **uma** versão; sobe o minor (2.3 → 2.4). Versão atual: **2.6** (2026-10-25).
