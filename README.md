# BonusBridge Monorepo

Public SEO site with **fixed in-repo content** (no separate API or admin app).

- `apps/web` — Next.js (`/`, `/stores`, `/stores/[slug]`, `/coupons` → `/`, `/coupons/[id]` → `/stores/[slug]`) with Zod schemas in `apps/web/lib/schemas`

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

Optional **Google Analytics 4** (gtag) runs in the web app **only in production builds** (`NODE_ENV=production`), not in local `pnpm dev`. Details and env vars: [`apps/web/README.md`](apps/web/README.md).

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

## Web conventions

- **Single app font:** `next/font/google` (and `next/font/local`) may only be imported from `apps/web/app/layout.tsx`. ESLint rule `bonusbridge/single-app-font` blocks extra font imports in other layouts or components. Details: `.cursor/rules/web-single-font.mdc`.

## Git hooks

[Husky](https://typicode.github.io/husky/) runs via the root `prepare` script after `pnpm install`:

- Hooks **`cd` to the repo root** and source **`.husky/load-nvmrc.sh`**, which loads **[nvm](https://github.com/nvm-sh/nvm)** from **`$NVM_DIR`** (or **`~/.nvm`**) and runs **`nvm use`** so the same **Node version as `.nvmrc`** is used as in an interactive shell.
- **pre-commit** — `pnpm test` (workspace tests).
- **pre-push** — `pnpm --filter web build` (Next.js production build + TypeScript).

If nvm is not installed, hooks fall back to **whatever `node` is on `PATH`**. To skip hooks: `git push --no-verify`.

CI still runs install, lint, test, and web build on Node 24.

## CI

GitHub Actions: install, lint, test, web build.

## Version notes

- **ESLint:** `apps/web` uses **ESLint 9.x** with `eslint-config-next`. **ESLint 10** is not yet supported by the Next.js ESLint preset and bundled plugins (see [vercel/next.js#91702](https://github.com/vercel/next.js/issues/91702)). Upgrade when `eslint-config-next` declares ESLint 10 compatibility.
- **Footer:** legal links only (Privacy / Terms); social links are omitted until product needs them.
