# apps/api — AGENTS.md

## Responsibilities

- Owns API endpoints, auth/roles checks, DB access, migrations, and business logic.
- Any contract change must update packages/shared.

## Commands

From repo root:

- Dev: pnpm --filter api dev
- Build: pnpm --filter api build
- Lint: pnpm --filter api lint
- Test: pnpm --filter api test

## Architecture rules

- Prefer NestJS modules with clear boundaries:
  - controller (HTTP) -> service (logic) -> repository/data layer
- Keep controllers thin.
- Validate inputs at boundaries (request body/query/params).
- Prefer using shared Zod schemas from packages/shared for validation and typing.

## Data / DB rules

- Any change to persisted data must include a migration (or documented equivalent).
- Keep migrations deterministic and reversible when possible.
- Seed scripts are allowed for local/dev, but must be safe to re-run.

## Error handling

- Return consistent error shapes.
- Avoid leaking internal details in error responses.

## Security

- Never log secrets.
- Admin endpoints must require admin role.
- Rate-limit sensitive endpoints (login, submission) when applicable.

## Notes for multi-agent handoff

If you changed an endpoint:

- Update packages/shared schema/types
- Document:
  - endpoint path/method
  - request schema
  - response schema
  - error cases
