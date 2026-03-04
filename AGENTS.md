# BonusBridge — AGENTS.md (root)

## Project summary

BonusBridge is a referral / bonus aggregator with:

- Public SEO website (Next.js)
- Admin panel (Next.js)
- API backend (NestJS)
- Shared schemas/types (Zod) used by all apps

## Repo layout

- apps/api — NestJS API
- apps/web — Next.js public site (SEO)
- apps/admin — Next.js admin panel (CRUD + moderation)
- packages/shared — Zod schemas, inferred TS types, shared utils

## Package manager

- Use pnpm only (no npm/yarn)
- TypeScript only
- No semicolons in TS

## Multi-agent protocol (Codex)

Codex may spawn multiple agents. To avoid conflicts:

### Roles (agents) and allowed scopes

- Planner Agent:
  - Produces a short plan and acceptance criteria
  - Does not edit code unless requested
- API Agent:
  - Can edit: apps/api/**, packages/shared/**
  - Must NOT edit: apps/web/**, apps/admin/** (unless explicitly required)
- Web Agent:
  - Can edit: apps/web/**, packages/shared/** (read-only preferred; edits only if explicitly required)
  - Must NOT edit: apps/api/**, apps/admin/**
- Admin Agent:
  - Can edit: apps/admin/**, packages/shared/** (read-only preferred; edits only if explicitly required)
  - Must NOT edit: apps/api/**, apps/web/**
- DB/Data Agent:
  - Can edit: apps/api/** (migrations/seed), packages/shared/**
  - Must keep schema + migrations consistent
- QA Agent:
  - Can edit tests anywhere ONLY if needed to fix failing tests or add coverage
  - Primary job: run commands and report results

### Handoff rules (non-negotiable)

- Any API request/response shape change MUST update packages/shared schemas/types.
- Web/Admin MUST consume types from packages/shared; do not duplicate DTOs locally.
- Any DB schema change requires:
  1. migration (or equivalent),
  2. updated shared schema/types,
  3. updated API implementation.

## Shared contract rules

- Define data models in packages/shared using Zod:
  - Export Schema (e.g., OfferSchema)
  - Export inferred types (e.g., type Offer = z.infer<typeof OfferSchema>)
- Prefer runtime validation on API boundaries using the same Zod schemas (or derived validators).

## Coding conventions

- Prefer async/await
- Prefer small, focused modules
- Avoid deep nesting
- Add minimal but clear comments for non-obvious logic
- Do not commit secrets; use env vars

## Definition of Done (DoD)

Before marking work as done:

- pnpm lint
- pnpm test (if tests exist)
- Build the affected app(s):
  - pnpm --filter api build
  - pnpm --filter web build
  - pnpm --filter admin build

If a command is unavailable in the repo yet, add the script or explain what is missing and propose a minimal script addition.

## Environment variables

- Use .env.example files (per app) to document required env vars.
- Do not write real keys in repo.

## Output style for Codex work

When responding with changes:

- Provide a short summary
- List files touched
- Include any commands run and their results
