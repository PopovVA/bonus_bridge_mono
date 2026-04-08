# BonusBridge Monorepo

Public SEO site with **fixed in-repo content** (no separate API or admin app).

- `apps/web` — Next.js (`/`, `/stores`, `/stores/[slug]`, `/coupons`, `/coupons/[id]`) with Zod schemas in `apps/web/lib/schemas`

**Content:** edit `apps/web/lib/site-data.ts` (categories, stores, coupons, hero slides, featured sections). Static images: `apps/web/public/`.

## Stack

- Node.js `24` LTS (see `.nvmrc`)
- pnpm `10.33` (see root `package.json` → `packageManager`)
- pnpm workspaces
- TypeScript `6.x` (`apps/web`)
- Next.js `16.x` (`apps/web`)

## Quick start

```bash
nvm use 24
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

Root `pnpm start` exists for hosts (e.g. Railpack) that expect a `start` script at the repo root; it runs the same as `pnpm --filter web start` → `next start`.

Default production URL is **port 3000** (`next start`). If your host sets another `PORT`, configure it per that platform or align the public port with the port Next listens on.

## Design reference

- `docs/design-references.md`

## CI

GitHub Actions: install, lint, test, web build.

## Version notes

- **ESLint:** `apps/web` uses **ESLint 9.x** with `eslint-config-next`. **ESLint 10** is not yet supported by the Next.js ESLint preset and bundled plugins (see [vercel/next.js#91702](https://github.com/vercel/next.js/issues/91702)). Upgrade when `eslint-config-next` declares ESLint 10 compatibility.
- **lucide-react 1.x** no longer ships brand social icons. The footer uses neutral Lucide icons; link `aria-label` text still names the intended networks (e.g. Facebook, Twitter).
