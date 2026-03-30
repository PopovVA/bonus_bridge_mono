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
  - `/` — home (hero, featured stores/offers, premium banner)
  - `/stores`, `/stores/[slug]`
  - `/coupons`, `/coupons/[id]`
  - `/privacy`, `/terms`
- Every SEO page should include title/meta, clear H1, and internal links where relevant.

## Data/typing

- Use `lib/schemas` and inferred types; keep `lib/site-data.ts` aligned with those schemas.

## UI rules

- Keep components simple; avoid heavy client JS on SEO-critical content.
- No secrets on the client.
- Listing-first structure (RetailMeNot-like), Medium-like readability — see `docs/design-references.md`.
- Responsive desktop/tablet/mobile; accessibility basics (focus, labels, non-color-only status).

## Multi-agent protocol

- For role chain and handoffs, see **repo root `AGENTS.md`** (including `действуйте командой` / `Командой делаем`).
