# BonusBridge Monorepo

Public SEO site with **fixed in-repo content** (no separate API or admin app).

- `apps/web` — Next.js (`/`, `/stores`, `/stores/[slug]`, `/coupons`, `/coupons/[id]`) with Zod schemas in `apps/web/lib/schemas`

**Content:** edit `apps/web/lib/site-data.ts` (categories, stores, coupons, hero images, premium banner, featured sections).

## Stack

- Node.js `22` (`.nvmrc`)
- pnpm workspaces
- TypeScript `5.9.3`
- Next.js `16.1.6`

## Quick start

```bash
nvm use 22
pnpm install
pnpm lint
pnpm test
pnpm build
```

## Local development

```bash
pnpm dev
```

Web: `http://localhost:3000`

## Deploy

Use the **monorepo root** as the app root (not `apps/web` alone), then:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

(`pnpm start` в корне нужен для провайдеров вроде Railpack, которые ищут скрипт `start` в корневом `package.json`; это то же самое, что `pnpm --filter web start` → `next start`.)

Default production URL is **port 3000** (`next start`). If your host sets another `PORT`, pass it the usual way for that platform or align the host’s public port with the port Next is listening on.

## Design reference

- `docs/design-references.md`

## CI

GitHub Actions: install, lint, test, web build.
