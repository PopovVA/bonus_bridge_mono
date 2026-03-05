# apps/admin — AGENTS.md

## Responsibilities

Internal admin panel:

- CRUD: countries, categories, services, offers
- Moderation: user-submitted referrals/offers (approve/reject)
- Audit: track updates (updated_at/updated_by where applicable)
- Must follow shared style guide: `docs/design-references.md` (repo root).
- Canonical visual refs to follow: `docs/raw/retailmenot.png`, `docs/raw/coupun_today.png`, `docs/raw/nerdwallet.png`, `docs/fonts_style_icons/medium.png`.

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
- Use RetailMeNot-like listing structure for admin resources: predictable filters, sortable lists, clear card/table hierarchy.
- Use `docs/raw/retailmenot.png` as the primary structural reference for list/table + action hierarchy.
- Keep Medium-like visual mood: restrained color usage, readable typography, consistent spacing rhythm.
- Use `docs/fonts_style_icons/medium.png` as the source for font and icon style decisions.
- Use semantic color tokens and consistent spacing scale; avoid one-off colors/spacing.
- Validate responsive behavior on desktop/tablet/mobile, including table overflow handling and filter access.
- Enforce accessibility basics: keyboard support, visible focus, labeled controls, and text-backed status/error states.

## Multi-agent boundary

- If user writes `действуйте командой` or `Командой делаем`, execution MUST switch to strict multi-agent mode with role chain:
  PM -> User approval -> Full-Stack Dev -> UI/UX -> Architect -> QA.
- Single-agent execution is forbidden for this trigger.
- Do not modify apps/api or apps/web.
- If you need an API change, request it and specify the exact contract needed.
