# BonusBridge Monorepo

Public SEO site with **fixed in-repo content** (no separate API or admin app).

- `apps/web` — Next.js (`/`, `/stores`, `/stores/[slug]`, `/coupons`, `/coupons/[id]`)
- `packages/shared` — Zod schemas and TypeScript types used by the web app

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

Optional: local Postgres for other tooling — `pnpm db:up` / `pnpm db:down` (see `docker-compose.yml`).

## Deploy (Railway / any Node host)

Monorepo **root** as working directory (leave **Root Directory** empty / `.` — **not** `apps/web`):

1. **Build:** `pnpm install --frozen-lockfile && pnpm --filter @bonusbridge/shared build && pnpm --filter web build`
2. **Start:** `pnpm --filter web start`
3. Do **not** set `PORT` manually — the host injects it. Logs should show `[bonusbridge-web] cwd=... PORT=...` then Next **Ready**.
4. **Healthcheck path:** `/health` (avoids SSR on `/` during the probe). Repo root `railway.json` sets this for Railway.

If deploy logs show **Ready** but the public URL returns **502**, the router often hits a bad replica or the healthcheck on `/` fails. Use **`/health`** in Railway service settings and confirm **Root Directory** is the repo root so `pnpm --filter` sees the workspace.

## Design reference

- `docs/design-references.md`

## CI

GitHub Actions: install, shared build, lint, test, web build.
