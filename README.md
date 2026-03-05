# BonusBridge Monorepo

Referral and bonus aggregator with:
- `apps/api` NestJS API + Prisma (Supabase Postgres)
- `apps/web` public SEO web app (Next.js)
- `apps/admin` admin panel (Next.js)
- `packages/shared` shared Zod contracts and TypeScript types

## New Coupon Flow
- Web route: `/services/[slug]/coupons` shows coupons by service with copy-to-clipboard.
- Admin supports creating/updating services (name, icon/logoUrl, service link) and coupons (including `previewText` and optional `couponCode`).

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

## Env
Each app has its own `.env.example`:
- `apps/api/.env.example`
- `apps/web/.env.example`
- `apps/admin/.env.example`

## Design Reference
- UI style guide for web/admin: `docs/design-references.md`

## Deploy
- Database/Auth: Supabase
- Runtime/API/Web/Admin: Railway

## CI
GitHub Actions workflow runs lockfile install + lint + test + build for shared/api/web/admin.
