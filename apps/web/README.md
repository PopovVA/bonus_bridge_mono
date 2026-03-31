# BonusBridge Web

Public SEO site (Next.js App Router). **Data is static** — edit `lib/site-data.ts` to change stores, coupons, hero promo copy/links, and home sections. Hero backgrounds and brand marks: `public/hero/`, `public/brands/`. Home category carousel: `public/categories/{slug}.svg`. **Top monthly offers:** copy/links, `badgeText`, and `imageSrc` in `getTopMonthlyOffers()` inside `lib/site-data.ts`. Brand logos (replace by keeping the same filenames or update `logoSrc`): `apps/web/public/top-offers/logos/klarna-logo.svg`, `public-logo.svg`, `too-good-to-go-logo.svg`.

**Right-side promo images (swap these files to change art — keep names unless you change `imageSrc` in `site-data.ts`):**

| Offer | File on disk | `imageSrc` in data |
| --- | --- | --- |
| Klarna | `apps/web/public/top-offers/media/klarna-promo.png` | `/top-offers/media/klarna-promo.png` |
| Public | `apps/web/public/top-offers/media/public-promo.png` | `/top-offers/media/public-promo.png` |
| Too Good To Go | `apps/web/public/top-offers/media/too-good-to-go-promo.png` | `/top-offers/media/too-good-to-go-promo.png` |

**Promo art sizing:** on desktop (3-column grid) the right column is a **tall narrow strip** (~**150–190px** wide × ~**260–380px** tall in CSS, height grows with text). Klarna / Too Good To Go use **`object-fit: cover`** (fills the strip; edges may crop) — prefer **portrait ~9:16 or 2:3**. **Public** uses **`object-fit: contain`** on a dark column background so a **wide landscape** banner stays **fully readable** (letterboxing OK). On mobile the block is **full card width** with **min-height ~200px**.

Use PNG or WebP/JPEG if you prefer: add the file under `public/top-offers/media/` and point `imageSrc` to it (e.g. `/top-offers/media/my-klarna.jpg`). Omit `imageSrc` to show the skeleton until an asset exists. Optional `badgeText` renders a small white promo pill with a price-tag icon (same stroke language as header icons) in the **top-right** corner of the card.

## Local setup

From repo root:

```bash
nvm use 22
pnpm install
pnpm dev
```

Port: `http://localhost:3000`

Optional: set `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` (see [Brandfetch Logo API](https://developers.brandfetch.com/register)) so the Uber Eats hero logo can load from `cdn.brandfetch.io/ubereats.com`. Without it, `/brands/ubereats-logo.png`. The Uber rides slide always uses `/brands/uber-logo.png`.

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`
- `pnpm --filter web start` — production (default **port 3000**, same as `next start`)

## Routes

- `/` — hero slider, top monthly offers (Klarna / Public / Too Good To Go), category carousel, hot promo codes
- `/stores` — list + category filter + search
- `/stores/[slug]` — store + coupons
- `/coupons` — list
- `/coupons/[id]` — details + copy (code or referral URL)

## Types

Zod schemas and inferred types live in `lib/schemas`; runtime content lives in `lib/site-data.ts`.
