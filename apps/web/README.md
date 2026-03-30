# BonusBridge Web

Public SEO site (Next.js App Router). **Data is static** — edit `lib/site-data.ts` to change stores, coupons, hero images, and home sections.

## Local setup

From repo root:

```bash
nvm use 22
pnpm install
pnpm dev
```

Port: `http://localhost:3000`

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`
- `pnpm --filter web start` — production (default **port 3000**, same as `next start`)

## Routes

- `/` — hero slider, top stores, premium banner, hot promo codes
- `/stores` — list + category filter + search
- `/stores/[slug]` — store + coupons
- `/coupons` — list
- `/coupons/[id]` — details + copy (code or referral URL)

## Types

Zod schemas and inferred types live in `lib/schemas`; runtime content lives in `lib/site-data.ts`.
