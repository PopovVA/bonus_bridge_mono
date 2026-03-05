# BonusBridge Admin

Internal Next.js admin panel with Supabase auth scaffold and typed API client.

## Local setup
From repo root:
```bash
nvm use 22
pnpm install
cp apps/admin/.env.example apps/admin/.env.local
```

Default local port: `3002`

## Notes
- `/admin/*` requires authenticated user with `admin` role claim in Next.js proxy.
- Services page supports create/update for name, slug, category, website (service link), logoUrl (icon), and description.
- Coupons page supports create/update for offers including required `previewText` and optional `couponCode`.

## Commands
- `pnpm --filter admin dev`
- `pnpm --filter admin build`
- `pnpm --filter admin test`

## Environment
Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Security note:
- Use `.env.example` as templates only.
- Never commit real Supabase keys or other secrets to repository.
