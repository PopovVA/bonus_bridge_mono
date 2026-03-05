# BonusBridge API

NestJS API with Prisma and Supabase JWT guards.

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

## Auth
Admin endpoints require a valid Supabase JWT (`Authorization: Bearer <token>`) and admin role claim.

Supported providers are configured in Supabase dashboard:
- Email/password
- Google
- Facebook
- Apple
- Twitter
