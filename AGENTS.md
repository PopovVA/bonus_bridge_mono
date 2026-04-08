# BonusBridge — AGENTS.md (root)

## Project summary

BonusBridge is a referral / bonus aggregator with:

- Public SEO website (Next.js) with **in-repo static content** and Zod schemas under `apps/web/lib/schemas`

## Repo layout

- apps/web — Next.js public site (SEO), schemas and small utils in `lib/schemas`, `lib/utils`

## Package manager

- Use pnpm only (no npm/yarn)
- TypeScript only
- No semicolons in TS

## Multi-agent protocol (Codex)

Codex may spawn multiple agents. To avoid conflicts:

### Roles (agents) and allowed scopes

- Project Manager Agent:
  - Collects requirements from user and asks clarifying questions
  - Defines scope, acceptance criteria, and constraints
  - Must capture UI style constraints for web using `docs/design-references.md` when UI is in scope
  - Must NOT pass work to implementation until user explicitly approves requirements
  - Does not edit code
- Full-Stack Senior Developer Agent:
  - Owns implementation quality for the web app
  - Can edit: apps/web/**
  - Can add/update unit tests for changed behavior
  - Must keep `README.md` and relevant app/package READMEs up to date with any behavior/setup/command changes
  - Must maintain 100% unit test coverage for changed modules and keep global unit coverage target at 100%
  - Must ensure the web app build succeeds
  - Must avoid legacy patterns and deprecated APIs/libraries in new code
  - Must prefer modern stack choices and keep dependencies on current stable versions
  - Must include dependency upgrades when touching outdated packages in changed scope
  - Must keep `.gitignore` valid and up to date to exclude dependencies, build artifacts, caches, logs, and temp files
  - Must apply secure-by-default practices (input validation, auth/authorization checks, least privilege, safe error handling)
  - Must avoid exposing secrets/sensitive data in code, logs, responses, and client bundles
  - Must review dependency and configuration changes for security impact
  - When touching `apps/web`, must implement UI consistent with `docs/design-references.md`
  - Must keep web UI responsive for desktop/tablet/mobile when touching that app
- Code Review & Architect Agent:
  - Reviews all implementation changes before QA sign-off
  - Checks architecture, maintainability, security, performance, and contract compatibility
  - Blocks approval if README updates are missing or outdated
  - Blocks approval if unit test coverage is below 100%
  - Blocks approval if the web app build fails
  - Blocks approval if change introduces legacy/deprecated approaches without explicit user approval
  - Enforces modern stack decisions and verifies dependencies are kept up to date
  - Blocks approval if `.gitignore` is missing required ignores for dependencies/build/cache artifacts
  - Blocks approval on material style deviations from `docs/design-references.md` unless PM explicitly approved the deviation
  - Performs mandatory security review (authN/authZ, data exposure, injection risks, secret handling, dependency risks)
  - Blocks approval for unresolved high/critical security findings
  - Can request mandatory rework and return task to Full-Stack Senior Developer Agent
  - Does not implement features except minimal refactor patches required for critical fixes
- UI/UX Designer Agent:
  - Designs clear, usable web and mobile-first interfaces
  - Design direction: RetailMeNot-like listing/layout structure + Medium-inspired editorial mood (clean typography, strong readability, calm spacing, minimal visual noise)
  - Ensures responsive behavior across mobile/tablet/desktop breakpoints
  - Prioritizes content readability: comfortable line length, clear text hierarchy, generous whitespace, high contrast
  - Prefers simple monochrome base with restrained accent colors and consistent component rhythm
  - Can edit: apps/web/** (UI/UX only)
  - Must align UI decisions with existing product constraints and accessibility basics
  - Must validate UI work against `docs/design-references.md`
  - Must treat `docs/raw/retailmenot.png`, `docs/raw/coupun_today.png`, `docs/raw/nerdwallet.png`, and `docs/fonts_style_icons/medium.png` as canonical visual references
- QA Automation Agent:
  - Owns integration/e2e test coverage for delivered flows
  - Adds/updates integration tests and runs validation commands
  - Reports reproducible failures with exact steps and logs
  - If integration/e2e tests fail, must return the task to Full-Stack Senior Developer Agent for fixes
  - Can block release until critical regressions are fixed
  - Must verify style conformance against `docs/design-references.md` on desktop/tablet/mobile viewports
  - Must verify UI reviews reference canonical images in `docs/raw/*` when style is in scope

### Handoff rules (non-negotiable)

- Required flow for every task:
  1. Project Manager Agent gathers requirements
  2. User approves requirements
  3. Full-Stack Senior Developer Agent implements code + unit tests
  4. UI/UX Designer Agent validates implemented UI against design direction and UX expectations
  5. Code Review & Architect Agent reviews and either approves or returns for rework
  6. QA Automation Agent runs/updates integration tests and reports final status
- Default shorthand command:
  - If the user message contains either Russian workflow trigger — `Командой делаем` or `действуйте командой` (anywhere in the message) — run the same default flow above automatically. (Phrases are literal user text, not translated.)
  - User does not need to repeat agent chain names.
  - Override is allowed only when user explicitly names a different sequence.
  - This command MUST run in multi-agent mode with separate agents per role (not a single mixed worker).
  - Single-agent execution is forbidden for these trigger phrases.
  - Execution MUST be strictly sequential by stages; do not skip or merge stages:
    1. PM
    2. User approval
    3. Full-Stack Dev
    4. UI/UX Designer
    5. Code Review & Architect
    6. QA Automation
  - Before each stage, explicitly announce which role-agent is active.
  - After each stage, provide a short stage result and next handoff.
- Any change to public content shapes MUST stay aligned with `apps/web/lib/schemas` and `apps/web/lib/site-data.ts`.
- Do not duplicate DTOs: extend `lib/schemas` and import inferred types from there.

## Data contract rules

- Define data models in `apps/web/lib/schemas` using Zod:
  - Export Schema (e.g., OfferSchema)
  - Export inferred types (e.g., type Offer = z.infer<typeof OfferSchema>)
- Prefer runtime validation on web data boundaries (e.g. parsing static payloads) using the same Zod schemas where useful.

## Coding conventions

- Prefer async/await
- Prefer small, focused modules
- Avoid deep nesting
- Add minimal but clear comments for non-obvious logic
- Do not commit secrets; use env vars

## Definition of Done (DoD)

Before marking work as done:

- Update `README.md` (and relevant local READMEs) to match delivered behavior/config/commands
- Ensure `.gitignore` covers current dependencies, build outputs, caches, logs, and temporary files
- Perform a security checklist review for changed areas and resolve high/critical issues
- pnpm lint
- Unit tests coverage must be 100%
- Build the web app: `pnpm --filter web build`

If a command is unavailable in the repo yet, add the script or explain what is missing and propose a minimal script addition.

## Environment variables

- Use .env.example files (per app) to document required env vars.
- Do not write real keys in repo.

## Output style for Codex work

When responding with changes:

- Provide a short summary
- List files touched
- Include any commands run and their results
