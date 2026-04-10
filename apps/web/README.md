# BonusBridge Web

Public SEO site (Next.js App Router). **Favicon:** `app/icon.svg` (BB monogram; edit in place to refresh). **Data is static** — edit `lib/site-data.ts` to change stores, coupons, hero promo copy/links, and home sections. Hero backgrounds and brand marks: `public/hero/`, `public/brands/`. Home category carousel: `public/categories/{slug}.svg`. **Top monthly offers:** copy/links, `badgeText`, and `imageSrc` in `getTopMonthlyOffers()` inside `lib/site-data.ts`. Brand logos for top cards: `apps/web/public/top-offers/logos/klarna-logo.svg`, `public-logo.svg`; Robinhood uses `/clip-coupons/robinhood.svg` in `getTopMonthlyOffers()`.

**Right-side promo images (swap these files to change art — keep names unless you change `imageSrc` in `site-data.ts`):**

| Offer | File on disk | `imageSrc` in data |
| --- | --- | --- |
| Klarna | `apps/web/public/top-offers/media/klarna-promo.png` | `/top-offers/media/klarna-promo.png` |
| Public | `apps/web/public/top-offers/media/public-promo.png` | `/top-offers/media/public-promo.png` |
| Robinhood | `apps/web/public/top-offers/media/robinhood-promo.png` | `/top-offers/media/robinhood-promo.png` |

**Promo art sizing:** on desktop (3-column grid) the right column is a **tall narrow strip** (~**150–190px** wide × ~**260–380px** tall in CSS, height grows with text). Klarna uses **`object-fit: cover`** (fills the strip; edges may crop) — prefer **portrait ~9:16 or 2:3**. **Public** uses **`object-fit: contain`** on a dark column background so a **wide landscape** banner stays **fully readable** (letterboxing OK). **Robinhood** uses **`object-fit: contain`** on a **neutral slate** column background (`#f1f5f9`) so letterboxing stays calm and the **wide landscape** wordmark stays **fully visible** (same idea as Public). If `imageSrc` is omitted, a neutral circular fallback is shown. On mobile the block is **full card width** with **min-height ~200px**.

Use PNG or WebP/JPEG if you prefer: add the file under `public/top-offers/media/` and point `imageSrc` to it (e.g. `/top-offers/media/my-klarna.jpg`). Omit `imageSrc` to show the skeleton until an asset exists. Optional `badgeText` renders a small white promo pill with a price-tag icon (same stroke language as header icons) in the **top-right** corner of the card.

## Local setup

From repo root:

```bash
nvm use 24
pnpm install
pnpm dev
```

Port: `http://localhost:3000`

### Analytics (GA4)

GA4 loads via `next/script` in `app/layout.tsx` (`GoogleAnalytics`) for all hosts except local loopback (`localhost`, `127.0.0.1`, `::1`). Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env` if needed (see `.env.example`); default is `G-9GPFJN1LKC`. Events are sent with `gtag('event', …)` from `lib/gtag-track.ts`; internal and external links use `components/tracked-link.tsx` (`TrackedLink`, `TrackedOutboundLink`).

**`clip_copy_code` / `clip_get_offer`** also send `place` and `item_id` where the parent passes them (e.g. home clip grid, store page, explore-more clip cards).

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `header_logo` | Click site title / logo | — |
| `header_nav_coupons` | Click “Coupons” in header | — |
| `header_nav_stores_open` | Open Stores menu | — |
| `header_nav_stores_close_toggle` | Close Stores via the same toggle | — |
| `header_nav_stores_close_backdrop` | Close Stores by clicking backdrop | — |
| `header_nav_stores_close_btn` | Close Stores (✕) | — |
| `header_nav_stores_category_tab` | Pick a category tab (drawer) | `category_slug` |
| `header_nav_stores_category_link` | Navigate to `/categories/{slug}` (mega menu) | `category_slug` |
| `header_nav_stores_store` | Open a store from Stores menu | `store_slug` |
| `header_nav_stores_all` | “All stores” fallback link | — |
| `header_search_store_pick` | Pick a result in store search | `store_slug` |
| `hero_carousel_prev` | Hero previous arrow | — |
| `hero_carousel_next` | Hero next arrow | — |
| `hero_carousel_dot` | Hero dot / slide index | `slide_index` |
| `hero_terms_link` | Hero “terms” link | `slide_kind` |
| `hero_main_cta` | Hero primary partner CTA | `slide_kind` |
| `monthly_offer_cta` | Top monthly offer card CTA | `offer_slug` |
| `hot_cashback_cta` | Hot cashback card CTA | `offer_slug` |
| `home_category_chip` | Category marquee chip | `category_slug` |
| `clip_copy_code` | Clip card — copy code / link | `place`, `item_id` (if set) |
| `clip_get_offer` | Clip card — get offer | `place`, `item_id` (if set) |
| `clip_dialog_not_now` | Partner dialog — “Not now” | — |
| `clip_dialog_open_tab` | Partner dialog — “Open in new tab” | — |
| `explore_link_offer_cta` | Explore more — link-only offer CTA | `offer_id` |
| `footer_privacy` | Footer — Privacy | — |
| `footer_terms` | Footer — Terms | — |
| `store_card_click` | Store card component (if used) | `store_slug` |
| `store_related_category` | “Explore more” category heading link | `category_slug` |
| `category_view_store` | Category page — “View store” | `store_slug` |
| `store_page_open_partner` | Store page — “Open Store” hero CTA | `store_slug` |

Optional: set `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` (see [Brandfetch Logo API](https://developers.brandfetch.com/register)) so the Uber Eats hero logo can load from `cdn.brandfetch.io/ubereats.com`. Without it, `/brands/ubereats-logo.png`. The Uber rides slide always uses `/brands/uber-logo.png`.

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`
- `pnpm --filter web start` — production (default **port 3000**, same as `next start`)

## Routes

- `/` — hero slider, top monthly offers (Klarna / Robinhood / Public), category carousel, **clip-out promo grid** (8 codes in `lib/home-clip-coupons.ts`; assets e.g. `/brands/ubereats-logo.png`, `/clip-coupons/7eleven.svg`, `/clip-coupons/robinhood.svg`, `/clip-coupons/lyft.svg`, `/clip-coupons/lime.svg`, `/clip-coupons/bird.svg`, `/clip-coupons/poshmark.svg`). **Clip cards:** tapping the **code** copies it, shows a toast, then a **confirm dialog**; **Get offer** opens the partner URL in a new tab **immediately** (no dialog) — same pattern on store **Top offers** / **Explore more** clip rows (`useClipPartnerOfferFlow` + `ClipOpenStoreDialog`).
- `/` — header: **Stores** (mega menu by category; each category shows the same `/categories/{slug}.svg` tile as the carousel; slate/neutral hover/active chrome, no green), **Coupons** (anchor `#coupons` to the clip grid), and a **store name search** (client-side filter over `useClientCatalog()` → links to `/stores/[slug]`). `/stores` and `/coupons` redirect to `/`. Legacy `/categories/food-dining` → `/categories/food`.
- **Client catalog:** `getClientCatalog()` runs in `app/layout.tsx` and hydrates `ClientCatalogProvider` with categories → stores → active offers. `useClientCatalog()` / `StoreRelatedPanel` reuse this on store pages (and anywhere else you add client UI).
- **`app/(default)/layout.tsx`** — same shell as home: `HomeHeader`, `HomeFooter`, `home.css` (`.default-main` content width 1280px; in-content links slate, not legacy green). App font: **Plus Jakarta Sans** via `next/font` on root `app/layout.tsx` (`--font-app`).
- `/categories/[slug]` — stores in that category; each row shows a **larger logo tile** (image, inline `logoSvg`, or letter fallback), **title**, **short description** from `site-data` `description` (or a neutral fallback), **counts** of promo codes vs link-only offers, and one **View store** button to `/stores/[slug]`.
- `/stores/[slug]` — hero: large logo on the left, **About this store** + `Open Store` CTA on the right (`Open Store` uses this store’s first active `referralUrl` from `getOffers`). **Top offers** (single block): all active offers for that store — clip-style cards when `couponCode` is set, otherwise the same hot-cashback–style link cards as **Explore more** (`StoreRelatedOfferCards` + `getCuratedLinkCardCopyForExploreMore`). Sort: **promo codes first**, then link-only offers. **Explore more** uses the same ordering for peer offers. Home `/` still uses **Top offers this month** + **Hot Cashback** rows with `getHotCashbackOffers()` (slugs that appear in the monthly row are omitted from the Hot Cashback strip).
- `/coupons/[id]` — **308 permanent redirect** to `/stores/[slug]` for the offer’s store (`getStoreSlugForOfferId` in `site-data.ts`); unknown ids → 404. Legacy `/offers/*` still rewrites to `/coupons/*` in `next.config.ts`.

## Types

Zod schemas and inferred types live in `lib/schemas`; runtime content lives in `lib/site-data.ts`.
