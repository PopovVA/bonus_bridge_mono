# BonusBridge API

NestJS API with Prisma and Supabase JWT guards.

## Local setup
From repo root:
```bash
nvm use 22
pnpm install
cp apps/api/.env.example apps/api/.env
```

For full local stack (Postgres in Docker + all services): `pnpm dev:local` (see root README).
For API only with existing DB: `pnpm db:migrate` then `pnpm --filter api dev`.

Default local port: `3001`

## Env
Copy `.env.example` to `.env` and configure Supabase + Postgres + CORS origins.

## Commands
- `pnpm --filter api dev`
- `pnpm --filter api build`
- `pnpm --filter api start`
- `pnpm --filter api test`
- `pnpm --filter api test:integration`
- `pnpm --filter api test:e2e`
- `pnpm --filter api prisma:migrate`
- `pnpm --filter api prisma:seed`

Run locally:
```bash
pnpm --filter api dev
```

## Auth
Admin endpoints require a valid Supabase JWT (`Authorization: Bearer <token>`) and admin role claim.

Security note:
- Keep secrets only in local `.env` / secret manager.
- Do not commit real keys to repository.

Supported providers are configured in Supabase dashboard:
- Email/password
- Google
- Facebook
- Apple
- Twitter
