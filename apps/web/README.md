# BonusBridge Web

Public SEO site (Next.js App Router). **Favicon:** `app/icon.svg` (BB monogram; edit in place to refresh). **Data is static** — edit `lib/site-data.ts` to change stores, coupons, hero promo copy/links, and home sections. Hero backgrounds and brand marks: `public/hero/`, `public/brands/`. Home category carousel: `public/categories/{slug}.svg`. **Top monthly offers:** copy/links and `badgeText` in `getTopMonthlyOffers()` inside `lib/site-data.ts`. The published home row is TopCashback. Personal referral links for programs that do not allow a public website are not on the home page. Which programs may be public is `lib/referral-programs.ts` (`publicOk`).

**Right-side promo images (swap these files to change art — keep names unless you change `imageSrc` in `site-data.ts`):**

The home offer-details row currently publishes **TopCashback** only (logo, no separate promo photo).

| Offer | Logo |
| --- | --- |
| TopCashback | `apps/web/public/hot-cashback/logos/topcashback.png` |

Older promo images may still be in `public/top-offers/`. They are not used as referral cards.

**Promo art sizing:** on desktop (3-column grid) the right column is a **tall narrow strip** (~**150–190px** wide × ~**260–380px** tall in CSS, height grows with text). If `imageSrc` is omitted, a neutral circular fallback is shown. On mobile the block is **full card width** with **min-height ~200px**. The current TopCashback card omits `imageSrc`.

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
| `header_nav_articles` | Click “Guides” in header (URL `/articles`) | — |
| `articles_list_open` | Open an article from `/articles` | — |
| `article_view` | Article page mount (once) | `article_slug` |
| `chime_calc_update` | Chime calculator inputs change (debounced) | `article_slug`, `friends`, `include_dd`, `your_total_usd` |
| `article_chime_terms` | Chime official terms link in article | `article_slug` |
| `article_chime_partner_image_click` | Tap a Chime article figure image (opens partner URL) | `article_slug`, `image_key` (`referral_steps` \| `building`) |
| `article_chime_partner_cta` | Chime “View offer details” button (under figures or after calculator) | `article_slug`, `cta_place` (`under_building` \| `after_calculator`) |
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
| `footer_cookies` | Footer — Cookie Notice | — |
| `footer_disclosures` | Footer — Disclosures | — |
| `footer_guides` | Footer — Guides | — |
| `footer_terms` | Footer — Terms | — |
| `guide_outbound` | Guide page outbound referral link | `guide_slug` |
| `store_card_click` | Store card component (if used) | `store_slug` |
| `store_related_category` | “Explore more” category heading link | `category_slug` |
| `category_view_store` | Category page — “View store” | `store_slug` |
| `store_page_open_partner` | Store page — “See provider details” hero CTA | `store_slug` |

### SEO

- `app/layout.tsx` sets global metadata (`metadataBase`, title template, default robots, canonical root).
- Home, category, and store pages set their own titles, descriptions, canonicals, Open Graph, and Twitter summary tags via `pageSocialMetadata` in `app/seo.ts`. Share tags do not invent an image. Home has a visible H1. Store pages show the store name as a visible H1 plus region, conditions, and a listing-updated date. That date is a content edit, not a bonus verification. Bonus amounts are not described as verified.
- Klarna (`/stores/klarna`) and Public (`/stores/public`) stay as informational routes. Their personal referral links and promotional CTAs are not published. Each page links to the provider's public website when that non-referral URL is in `site-data`. PayPal has no store route; its hero referral slide is not published. This is not a statement that those services are unlawful or that a link is technically dead.
- `app/robots.ts` publishes robots rules and points to `/sitemap.xml`.
- `app/sitemap.ts` includes `/`, `/privacy`, `/terms`, `/articles`, each entry in `lib/articles/list.ts`, all categories, and all store pages from `site-data`.
- Key routes set canonical metadata:
  - `/` in `app/(home)/page.tsx`
  - `/categories/[slug]` in `app/(default)/categories/[slug]/page.tsx`
  - `/stores/[slug]` in `app/(default)/stores/[slug]/page.tsx`
  - `/privacy`, `/terms` in their page metadata exports (full Privacy Policy and Terms of Service copy, U.S. focused disclaimers, contact email in `lib/legal-site-meta.ts`)
  - `/articles/chime-1000-two-friends` sets `keywords`, Open Graph (`article` type, `publishedTime`, image dimensions), and Twitter card
- JSON-LD is rendered on:
  - `/` (`WebSite`)
  - `/categories/[slug]` (`CollectionPage` + `ItemList`)
  - `/stores/[slug]` (`WebPage`)
  - `/articles/chime-1000-two-friends` (`Article`)

Optional: set `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` (see [Brandfetch Logo API](https://developers.brandfetch.com/register)) so the Uber Eats hero logo can load from `cdn.brandfetch.io/ubereats.com`. Without it, `/brands/ubereats-logo.png`. The Uber rides slide always uses `/brands/uber-logo.png`.

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`
- `pnpm --filter web start` — production (default **port 3000**, same as `next start`)

## Routes

- `/articles` — **Informational Guides** index (URL unchanged); entries are validated with Zod (`ArticleListSchema` in `lib/schemas/article.schema.ts`) and listed from `lib/articles/list.ts`. Optional **`listImageSrc`** (public path) shows a thumbnail on the index card.
- `/articles/chime-1000-two-friends` — Chime invite guide: **title + lede** (informational intro), referral-steps **`ArticlePartnerFigure`**, section **Referral offer illustration** with copy, then embedded **`ChimeReferralCalculator`** (`showHeading={false}` `showLead={false}` so the card has no duplicate title or rules blurb), **View offer details** (`cta_place: after_calculator`), building figure (with CTA), **Important to understand** checklist, and disclaimer. **`ArticleViewTracker`** fires `article_view`. **`GoogleAnalytics`** in root layout loads GA4 when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set and host is not localhost. On viewports wider than 640px, figures cap at **605px** width. JSON-LD `Article` uses `lib/articles/list.ts` title and description. Clickable figures → `CHIME_PARTNER_REFERRAL_URL` in `lib/chime-article-constants.ts`.
- `/` — visible H1, affiliate disclosure, hero slider, offer details row (Robinhood only; Klarna, Public, and PayPal referral promotions are not published), category carousel, **clip-out promo grid** (8 codes in `lib/home-clip-coupons.ts`; assets e.g. `/brands/ubereats-logo.png`, `/clip-coupons/7eleven.svg`, `/clip-coupons/robinhood.svg`, `/clip-coupons/lyft.svg`, `/clip-coupons/lime.svg`, `/clip-coupons/bird.svg`, `/clip-coupons/poshmark.svg`). **Clip cards:** tapping the **code** copies it, shows a toast, then a **confirm dialog**; **See details** opens the partner URL in a new tab **immediately** (no dialog) — same pattern on store **Top offers** / **Explore more** clip rows (`useClipPartnerOfferFlow` + `ClipOpenStoreDialog`).
- `/` — header: **Stores** (mega menu by category; first nav link after the logo; each category shows the same `/categories/{slug}.svg` tile as the carousel; slate/neutral hover/active chrome, no green), **Coupons** (anchor `#coupons` to the clip grid, hidden on narrow viewports to save space), **Guides** (`/articles`, to the right of Coupons on desktop), and a **store name search** (client-side filter over `useClientCatalog()` → links to `/stores/[slug]`). `/stores` and `/coupons` redirect to `/`. Legacy `/categories/food-dining` → `/categories/food`.
- **Client catalog:** `getClientCatalog()` runs in `app/layout.tsx` and hydrates `ClientCatalogProvider` with categories → stores → active offers. `useClientCatalog()` / `StoreRelatedPanel` reuse this on store pages (and anywhere else you add client UI).
- **`app/(default)/layout.tsx`** — same shell as home: `HomeHeader`, `HomeFooter`, `home.css` (`.default-main` content width 1280px; in-content links slate, not legacy green). App font: **Plus Jakarta Sans** via `next/font` on root `app/layout.tsx` (`--font-app`).
- `/categories/[slug]` — stores in that category; each row shows a **larger logo tile** (image, inline `logoSvg`, or letter fallback), **title**, **short description** from `site-data` `description` (or a neutral fallback), **counts** of promo codes vs link-only offers, and one **View store** button to `/stores/[slug]`.
- `/stores/[slug]` — hero: large logo on the left, **About this store** + `See provider details` CTA on the right (uses this store’s first active `referralUrl` from `getOffers`) plus an affiliate disclosure below the hero. **Top offers** (single block): all active offers for that store — clip-style cards when `couponCode` is set, otherwise partner-offer link cards as **Explore more** (`StoreRelatedOfferCards` + `getCuratedLinkCardCopyForExploreMore`). Sort: **promo codes first**, then link-only offers. **Explore more** uses the same ordering for peer offers. Home `/` uses **Offer details this month** + **Partner offer guides** rows with `getHotCashbackOffers()` (slugs that appear in the monthly row are omitted from the partner-offer strip).
- `/coupons/[id]` — **308 permanent redirect** to `/stores/[slug]` for the offer’s store (`getStoreSlugForOfferId` in `site-data.ts`); unknown ids → 404. Legacy `/offers/*` still rewrites to `/coupons/*` in `next.config.ts`.

## Types

Zod schemas and inferred types live in `lib/schemas`; runtime content lives in `lib/site-data.ts`. Article registry and copy metadata live in `lib/articles/list.ts` (add new posts there and extend `ArticleListSchema` via the same pattern).
