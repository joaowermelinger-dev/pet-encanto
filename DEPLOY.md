# Deploy (grátis)

Arquitetura: **frontend na Vercel**, **API no Render**, **PostgreSQL no Neon**.
Custo: R$ 0/mês. Único incômodo: o Render free "dorme" após 15 min sem uso e a
primeira requisição depois demora ~30-50s pra acordar.

O que já está pronto no repo: `vercel.json`, `render.yaml`, modo produção no
backend (cookies `Secure`, CORS por env, normalização da `DATABASE_URL`).

---

## 1. Banco — Neon

1. https://neon.tech → **Sign up** (com o GitHub).
2. **Create project** → nome à vontade, região mais perto (ex.: US East).
3. Na tela do projeto, copie a **connection string** (botão *Connect*, formato
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
   Guarde — é o `DATABASE_URL`.

## 2. API — Render

1. https://render.com → **Sign up** (com o GitHub) e autorize o acesso ao repo.
2. **New +** → **Blueprint** → escolha este repositório. O Render lê o
   `render.yaml` e mostra o serviço `pet-encanto-api`.
3. Ele vai pedir estas variáveis (`sync: false`):
   - `DATABASE_URL` → a string do Neon (passo 1)
   - `FRONTEND_ORIGIN` → deixe `https://localhost` por enquanto (ajusta no passo 5)
   - `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD` / `FIRST_ADMIN_NAME` → a conta
     do dono do petshop
   (`SECRET_KEY` o Render gera sozinho; `ENV=production` já está fixo.)
4. **Apply** / **Create**. O build roda `pip install` + `alembic upgrade head`
   (cria as tabelas no Neon). Aguarde ficar **Live**.
5. Copie a URL do serviço no topo: `https://pet-encanto-api-XXXX.onrender.com`.
   Teste: abrir `…/api/health` deve mostrar `{"status":"ok"}`.
6. No **Shell** do serviço (aba Shell, no painel do Render), rode uma vez:
   ```bash
   python -m scripts.seed_admin
   ```
   Isso cria a conta do dono com o e-mail/senha definidos nas variáveis acima.

## 3. Apontar o frontend pra API

1. Edite [`vercel.json`](vercel.json): nas duas linhas `"destination"`, troque
   `https://REPLACE-COM-SUA-URL-DO-RENDER.onrender.com` pela URL real do Render
   (mantenha o `/api/:path*` e `/uploads/:path*` no fim de cada uma).
2. Commit e push:
   ```bash
   git add vercel.json && git commit -m "Deploy: aponta para a API do Render" && git push
   ```

## 4. Frontend — Vercel

1. https://vercel.com → **Sign up** (com o GitHub).
2. **Add New… → Project** → importe este repositório.
3. Não mexa em nada (o `vercel.json` já define build e output). **Deploy**.
4. Ao terminar, copie a URL: `https://SEU-PROJETO.vercel.app`.

## 5. Fechar o ciclo

1. Volte no Render → serviço → **Environment**:
   - `FRONTEND_ORIGIN` = a URL da Vercel (ex.: `https://seu-projeto.vercel.app`)
   - **Save changes** (o Render re-deploya sozinho).
   > Com o rewrite da Vercel não há CORS entre domínios de verdade — essa
   > variável é só um cinto de segurança extra.

## 6. Testar

Abra a URL da Vercel. A landing deve carregar, e `/login` deve aceitar a conta
do dono criada no passo 2.6.

Primeira visita depois de um tempo parado: ~30-50s (o Render acordando). Depois
fica rápido enquanto tiver uso.

---

## Depois

- **Continuar desenvolvendo:** codar local → `git push`. Vercel e Render
  re-deployam sozinhos. Migração nova entra no build do Render
  (`alembic upgrade head`).
- **Domínio próprio:** compra e adiciona em Vercel → *Domains* (sem redeploy).
- **Fotos (upload):** neste plano, ficam em disco local do Render — **não
  sobrevivem a um redeploy** (o filesystem do free tier não é persistente).
  Enquanto o volume de fotos for pequeno, dá pra conviver; se virar problema,
  trocar para um bucket (S3/Cloudflare R2) é só mudar a função de storage, sem
  mudar o schema do banco.
- **Tirar o cold start:** plano Starter do Render (~US$ 7/mês) mantém a API
  sempre no ar.
