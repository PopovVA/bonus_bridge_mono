# BonusBridge Monorepo

Referral and bonus aggregator with:
- `apps/api` NestJS API + Prisma (Supabase Postgres)
- `apps/web` public SEO web app (Next.js)
- `apps/admin` admin panel (Next.js)
- `packages/shared` shared Zod contracts and TypeScript types

## New Coupon Flow
- Web routes: `/stores` (list stores with category filter and search), `/stores/[slug]` (store page with referral links and coupons), `/coupons` (list coupons), `/coupons/[id]` (coupon details with copy-to-clipboard).
- Admin supports creating/updating categories, hero images (home slider, array of image URLs), premium banner (Join Our Premium Membership content), featured stores (Top Cashback Stores, selected from existing stores), featured offers (Hot Promo Codes, selected from existing coupons), stores (name, category dropdown, inline SVG logo, website link) and coupons (including `previewText` and optional `couponCode`).
- Countries removed; deploy separate instances per region if needed.

## Stack
- Node.js `22.22.0` via nvm (`.nvmrc`)
- pnpm workspaces
- TypeScript `5.9.3`
- NestJS `11.1.x`
- Next.js `16.1.6`
- Prisma `6.19.1`
- Supabase Auth (email/password, Google, Facebook, Apple, Twitter)

## Quick start
```bash
nvm use 22
pnpm install
pnpm lint
pnpm test
pnpm build
```

## Local Development

API, web и admin запускаются локально и подключаются к прод БД (Supabase) и Railway-конфигам.

### Quick start

1. Clone repo and enter it.
2. Use Node 22:
```bash
nvm use 22
```
3. Install deps:
```bash
pnpm install
```
4. Create local env files from examples:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```
5. Fill in Supabase and API URLs in env files (see Env below). Use production DB and Supabase project.
6. Start API, web, admin:
```bash
pnpm dev:local
```
API starts first; web and admin wait for it to be ready (avoids ECONNREFUSED on first load).

### Ports

- API: `http://localhost:3001`
- Web: `http://localhost:3000`
- Admin: `http://localhost:3002`

### Individual startup

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:admin
```

### Migrations (against prod DB)

```bash
pnpm db:migrate
```

### Optional: local Postgres (Docker)

If you need a local DB instead of prod:

```bash
pnpm db:up      # start Postgres
pnpm db:down    # stop Postgres
```

Then set `DATABASE_URL` and `DIRECT_DATABASE_URL` in `apps/api/.env` to `postgresql://postgres:postgres@localhost:5432/bonusbridge`.

## Env
Each app has its own `.env.example`:
- `apps/api/.env.example`
- `apps/web/.env.example`
- `apps/admin/.env.example`

**Supabase:** Use `DATABASE_URL` (pooler) and `DIRECT_DATABASE_URL` (direct, for migrations) from Supabase Connect. Both point to the same production DB.

Security note:
- Use `.env.example` only as templates.
- Never commit real secrets, tokens, or production credentials to git.

## Design Reference
- UI style guide for web/admin: `docs/design-references.md`

## Deploy
- Database/Auth: Supabase
- Runtime/API/Web/Admin: Railway

## CI
GitHub Actions workflow runs lockfile install + lint + test + build for shared/api/web/admin.
