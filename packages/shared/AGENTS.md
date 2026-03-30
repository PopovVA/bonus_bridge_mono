# packages/shared — AGENTS.md

## Responsibilities

Single source of truth for:

- Zod schemas (runtime validation)
- inferred TS types (compile-time)
- shared helpers that are truly cross-app

## Commands

From repo root:

- Build: pnpm --filter shared build
- Lint: pnpm --filter shared lint
- Test: pnpm --filter shared test

## Rules

- Export Zod schemas and inferred types.
- Avoid importing from apps/\* here (shared must be dependency-leaf).
- Keep it stable; breaking changes require coordinated updates in apps/web (and `lib/site-data.ts`).

## Versioning mindset (even inside monorepo)

- Treat schema changes as contract changes.
- Prefer additive changes:
  - add optional fields rather than removing/renaming
  - when deprecating, keep backward compatibility if possible

## Suggested structure

- src/schemas/\* (OfferSchema, ServiceSchema, etc.)
- src/types/\* (if any extra types)
- src/index.ts (re-exports)

## Multi-agent trigger

- If user writes `действуйте командой` or `Командой делаем`, execution MUST switch to strict multi-agent mode with role chain:
  PM -> User approval -> Full-Stack Dev -> UI/UX -> Architect -> QA.
- Single-agent execution is forbidden for this trigger.
