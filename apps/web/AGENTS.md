# apps/web — AGENTS.md

## Responsibilities

- Public SEO website for offers/stores/categories; content is static in `lib/site-data.ts`.
- Must be fast, crawlable, and consistent URLs.
- Must follow shared style guide: `docs/design-references.md` (repo root).
- Canonical visual refs to follow: `docs/raw/retailmenot.png`, `docs/raw/coupun_today.png`, `docs/raw/nerdwallet.png`, `docs/fonts_style_icons/medium.png`.

## Commands

From repo root:

- Dev: pnpm --filter web dev
- Build: pnpm --filter web build
- Lint: pnpm --filter web lint
- Test: pnpm --filter web test

## SEO rules

- Prefer server-rendered or statically generated pages where possible.
- Stable URL structure:
  - /:category
  - /:category/:service
  - /:offerSlug (or equivalent)
- Every SEO page should include:
  - title/meta
  - clear H1
  - FAQ section when relevant
  - internal links to related offers/services/categories

## Data/typing

- Do not duplicate DTOs.
- Use packages/shared types and schemas.
- Keep `lib/site-data.ts` typed; use shared schemas if you add runtime validation for static data.

## UI rules

- Keep components simple and reusable.
- Avoid heavy client-side JS on SEO pages.
- No secrets on the client.
- Use listing-first structure inspired by RetailMeNot patterns: clear filters + scannable cards + stable pagination/sorting.
- Follow Medium-like readability mood: calm palette, strong hierarchy, comfortable spacing, high contrast text.
- Use `docs/fonts_style_icons/medium.png` as the source for font and icon style decisions.
- Use `docs/raw/retailmenot.png` as the primary structural reference when choosing listing/card composition.
- Use semantic color tokens and consistent spacing scale; avoid ad-hoc visual values.
- Keep responsive behavior explicit for desktop/tablet/mobile and verify filter/card usability on small screens.
- Enforce accessibility basics: keyboard navigation, visible focus states, labeled inputs, non-color-only status cues.

## Multi-agent boundary

- If user writes `действуйте командой` or `Командой делаем`, execution MUST switch to strict multi-agent mode with role chain:
  PM -> User approval -> Full-Stack Dev -> UI/UX -> Architect -> QA.
- Single-agent execution is forbidden for this trigger.
- Content changes belong in `lib/site-data.ts` (or small JSON modules imported there).
