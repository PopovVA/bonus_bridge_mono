# BonusBridge Admin

Internal Next.js admin panel with Supabase auth scaffold and typed API client.

## Notes
- `/admin/*` requires authenticated user with `admin` role claim in Next.js proxy.
- Current CRUD pages are read-only operational previews (no fake action buttons).

## Commands
- `pnpm --filter admin dev`
- `pnpm --filter admin build`
- `pnpm --filter admin test`

## Environment
Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
