# BonusBridge Web

Public SEO web app built with Next.js App Router.

## Local setup
From repo root:
```bash
nvm use 22
pnpm install
cp apps/web/.env.example apps/web/.env.local
```

Default local port: `3000`

## Commands
- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`

## Env
- `NEXT_PUBLIC_API_BASE_URL`

## Routes
- `/` — home page with hero slider, top stores grid, premium banner, hot promo codes
- `/stores` — list stores with category filter and search
- `/stores/[slug]` — store page with referral links and coupons
- `/coupons` — list coupons
- `/coupons/[id]` — coupon details with copy button (code or referral URL fallback)

Security note:
- Keep only public-safe values in `NEXT_PUBLIC_*`.
- Do not commit real secrets to git.
