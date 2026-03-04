# apps/admin — AGENTS.md

## Responsibilities

Internal admin panel:

- CRUD: countries, categories, services, offers
- Moderation: user-submitted referrals/offers (approve/reject)
- Audit: track updates (updated_at/updated_by where applicable)

## Commands

From repo root:

- Dev: pnpm --filter admin dev
- Build: pnpm --filter admin build
- Lint: pnpm --filter admin lint
- Test: pnpm --filter admin test

## Auth/roles

- Admin is restricted:
  - Require authentication
  - Require admin role
- Do not implement security-by-obscurity.

## Data/typing

- Do not duplicate DTOs.
- Use packages/shared schemas/types for forms and payloads.
- Prefer validating form input with the same Zod schemas.

## UX rules

- Prioritize speed and clarity over polish:
  - simple tables + search + filters
  - clear status labels (draft/active/expired)
  - safe destructive actions (confirm dialogs)

## Multi-agent boundary

- Do not modify apps/api or apps/web.
- If you need an API change, request it and specify the exact contract needed.
