# apps/web — AGENTS.md

## Responsibilities

- Public SEO website for offers/stores/categories; content is static in `lib/site-data.ts`.
- Must be fast, crawlable, and consistent URLs.
- Must follow `docs/design-references.md` (repo root).
- Canonical visual refs: `docs/raw/retailmenot.png`, `docs/raw/coupun_today.png`, `docs/raw/nerdwallet.png`, `docs/fonts_style_icons/medium.png`.

## Commands

From repo root:

- Dev: `pnpm --filter web dev`
- Build: `pnpm --filter web build`
- Lint: `pnpm --filter web lint`
- Test: `pnpm --filter web test`

## SEO rules

- Prefer server-rendered or statically generated pages where possible.
- Current URL structure:
  - `/` — home (hero, top monthly offers, category carousel, featured coupon cards)
  - `/` (home; list UIs live here), `/categories/[slug]`, `/stores/[slug]`, `/coupons/[id]` → permanent redirect to `/stores/[slug]` (index `/coupons` → `/`)
  - `/privacy`, `/terms`
- Every SEO page should include title/meta, clear H1, and internal links where relevant.

## Data/typing

- Use `lib/schemas` and inferred types; keep `lib/site-data.ts` aligned with those schemas.

## UI rules

- **Typography:** one app-wide font (Plus Jakarta Sans, `--font-app` from `app/layout.tsx` only). Do not add `next/font` imports outside `app/layout.tsx` (ESLint blocks this). Use `var(--font-app)` in CSS; monospace only for codes.
- Keep components simple; avoid heavy client JS on SEO-critical content.
- No secrets on the client.
- Listing-first structure (RetailMeNot-like), Medium-like readability — see `docs/design-references.md`.
- Responsive desktop/tablet/mobile; accessibility basics (focus, labels, non-color-only status).

## Multi-agent protocol

- For role chain, handoffs, and multi-agent triggers, see **repo root `AGENTS.md`** (workflow triggers are documented there, including the exact Russian phrases users may type).
