# apps/web — AGENTS.md

## Responsibilities

- Public SEO website for offers/services/categories/countries.
- Must be fast, crawlable, and consistent URLs.

## Commands

From repo root:

- Dev: pnpm --filter web dev
- Build: pnpm --filter web build
- Lint: pnpm --filter web lint
- Test: pnpm --filter web test

## SEO rules

- Prefer server-rendered or statically generated pages where possible.
- Stable URL structure:
  - /:country
  - /:country/:category
  - /:country/:service
  - /:country/:offerSlug (or equivalent)
- Every SEO page should include:
  - title/meta
  - clear H1
  - FAQ section when relevant
  - internal links to related offers/services/categories

## Data/typing

- Do not duplicate DTOs.
- Use packages/shared types and schemas.
- API client should be typed and handle errors gracefully.

## UI rules

- Keep components simple and reusable.
- Avoid heavy client-side JS on SEO pages.
- No secrets on the client.

## Multi-agent boundary

- If user writes `действуйте командой` or `Командой делаем`, execution MUST switch to strict multi-agent mode with role chain:
  PM -> User approval -> Full-Stack Dev -> UI/UX -> Architect -> QA.
- Single-agent execution is forbidden for this trigger.
- Do not modify apps/api or apps/admin.
- If you need an API change, request it and specify the exact contract needed.
