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

GA4 loads via `next/script` in `app/layout.tsx` (`GoogleAnalytics`) only after the visitor accepts the cookie banner, and only on hosts other than local loopback (`localhost`, `127.0.0.1`, `::1`). Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env` if needed (see `.env.example`); default is `G-9GPFJN1LKC`. Events are sent with `gtag('event', …)` from `lib/gtag-track.ts`; internal and external links use `components/tracked-link.tsx` (`TrackedLink`, `TrackedOutboundLink`).

**Referral clicks.** Every outbound referral or affiliate CTA sends one `bonus_cta` event with `store_slug` (partner), `page_path` (the BonusBridge path, such as `/stores/chime`), and `place` (which control was used). Report clicks in GA4 Explore with those two dimensions. `place` values include `store_page`, `store_page_open_partner`, `mobile_bar`, `guide_outbound`, `hero_main_cta`, `monthly_offer_cta`, `hot_cashback_cta`, `explore_link_offer_cta`, `home_clip`, `explore_clip`, `clip_dialog_open_tab`, `article_partner_image`, `article_partner_cta`, and `article_chime_requirements`. There is no first-party click log: this app has no backend or edge counter.

**`clip_copy_code`** still sends `place` and `item_id` when the parent passes them. A clip offer button with a partner slug sends `bonus_cta` instead of `clip_get_offer`. Opening the partner from the copy dialog sends `bonus_cta` with `place` `clip_dialog_open_tab` when the partner is known.

| Event name | When it fires | Parameters |
| --- | --- | --- |
| `header_logo` | Click site title / logo | — |
| `header_nav_coupons` | Click “Coupons” in header | — |
| `header_nav_articles` | Click “Guides” in header (URL `/articles`) | — |
| `articles_list_open` | Open an article from `/articles` | — |
| `article_view` | Article page mount (once) | `article_slug` |
| `chime_calc_update` | Chime calculator inputs change (debounced) | `article_slug`, `friends`, `include_dd`, `your_total_usd` |
| `article_chime_terms` | Chime official terms link in article | `article_slug` |
| `bonus_cta` | Chime article figure image | `store_slug` `chime`, `page_path`, `place` `article_partner_image`, `article_slug`, `image_key` |
| `bonus_cta` | Chime “View offer details” under a figure | `store_slug` `chime`, `page_path`, `place` `article_partner_cta`, `cta_place` |
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
| `bonus_cta` | Hero primary partner CTA | `store_slug`, `page_path`, `place` `hero_main_cta`, `slide_kind` |
| `bonus_cta` | Top monthly offer card CTA | `store_slug`, `page_path`, `place` `monthly_offer_cta` |
| `bonus_cta` | Hot cashback card CTA | `store_slug`, `page_path`, `place` `hot_cashback_cta` |
| `home_category_chip` | Category marquee chip | `category_slug` |
| `clip_copy_code` | Clip card — copy code / link | `place`, `item_id` (if set) |
| `clip_get_offer` | Clip card get-offer button when no partner slug is set | `place`, `item_id` (if set) |
| `bonus_cta` | Clip card get-offer button when a partner slug is set | `store_slug`, `page_path`, `place`, `item_id` |
| `clip_dialog_not_now` | Partner dialog, “Not now” | none |
| `bonus_cta` | Partner dialog, “Open in new tab”, when the partner is known | `store_slug`, `page_path`, `place` `clip_dialog_open_tab` |
| `bonus_cta` | Explore more link-only offer CTA | `store_slug`, `page_path`, `place` `explore_link_offer_cta`, `offer_id` |
| `footer_privacy` | Footer — Privacy | — |
| `footer_cookies` | Footer — Cookie Notice | — |
| `footer_disclosures` | Footer — Disclosures | — |
| `footer_guides` | Footer — Guides | — |
| `footer_terms` | Footer — Terms | — |
| `bonus_cta` | Guide page outbound referral link | `store_slug`, `page_path`, `place` `guide_outbound`, `guide_slug` |
| `store_card_click` | Store card component (if used) | `store_slug` |
| `store_related_category` | “Explore more” category heading link | `category_slug` |
| `category_view_store` | Category page — “View store” | `store_slug` |
| `bonus_cta` | Store page “See provider details” hero CTA | `store_slug`, `page_path`, `place` `store_page_open_partner` |

### SEO

- `app/layout.tsx` sets global metadata (`metadataBase`, title template, default robots, canonical root).
- Home, category, and store pages set their own titles, descriptions, canonicals, Open Graph, and Twitter summary tags via `pageSocialMetadata` in `app/seo.ts`. Share tags do not invent an image. Home has a visible H1. Store pages show the store name as a visible H1 plus region, conditions, and a listing date. That date is the offer's `checkedAt` from `lib/signup-bonuses.ts` (when the provider terms were last read), not a hardcoded listing timestamp.
- Removed store URLs (`/stores/public`, `/stores/klarna`, `/stores/robinhood`, `/stores/uber`, `/stores/uber-eats`, `/stores/lemonade`, `/stores/visible`, `/stores/amex-hilton-honors`, `/stores/airbnb`, `/stores/7now`, `/stores/bird`, `/stores/lime`, `/stores/poshmark`), `/categories/food` (including legacy `/categories/food-dining`), and the now-empty `/categories/travel` return **301** to a live page. They are not in the sitemap. PayPal and Coinbase have no store route. This is not a statement that those services are unlawful. Visible deal-page codes that the brand publishes to everyone stay on the home promo grid. They are not personal referral links.
- `app/robots.ts` publishes robots rules and points to `/sitemap.xml`. `app/llms.txt/route.ts` serves `/llms.txt` from the same public path list.
- `app/sitemap.ts` includes `/`, legal and contact pages, `/articles`, `/guides`, each article and guide, categories that have a listed store, and listed store pages.
- Key routes set canonical metadata:
  - `/` in `app/(home)/page.tsx`
  - `/categories/[slug]` in `app/(default)/categories/[slug]/page.tsx`
  - `/stores/[slug]` in `app/(default)/stores/[slug]/page.tsx`
  - `/privacy`, `/terms` in their page metadata exports (full Privacy Policy and Terms of Service copy, U.S. focused disclaimers, contact email in `lib/legal-site-meta.ts`)
  - `/articles/chime-1000-two-friends` sets `keywords`, Open Graph (`article` type, `publishedTime`, image dimensions), and Twitter card
- JSON-LD is rendered on:
  - `/` (`WebSite`)
  - `/categories/[slug]` (`CollectionPage` + `ItemList`)
  - `/stores/[slug]` (`WebPage` + `BreadcrumbList`, and `FAQPage` when the store has a public bonus)
  - `/articles` and `/guides` (`CollectionPage` + `BreadcrumbList` + `ItemList`)
  - `/privacy-policy`, `/cookies`, `/terms-of-service`, `/contact` (`WebPage` + `BreadcrumbList`)
  - `/articles/chime-1000-two-friends` and each guide (`Article` + `FAQPage` + `BreadcrumbList`)
  - `/disclosures` (`Article` + `BreadcrumbList`)

Optional: set `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` (see [Brandfetch Logo API](https://developers.brandfetch.com/register)) so the Uber Eats hero logo can load from `cdn.brandfetch.io/ubereats.com`. Without it, `/brands/ubereats-logo.png`. The Uber rides slide always uses `/brands/uber-logo.png`.

## Look and motion

- **Concept:** a bridge between the reader and the provider's own terms. Warm paper + ink type, one orange "cable" accent. Tokens for light and dark live at the top of `app/globals.css`; page and component styles are in `app/home.css`.
- **Theme:** `components/theme-toggle.tsx` switches `data-theme` on `<html>` and stores the choice in `localStorage` (`bb-theme`). `THEME_INIT_SCRIPT` (`lib/theme.ts`) runs in `<head>` so the first paint already has the right theme. Where the View Transitions API exists, the new theme grows as a circle from the toggle.
- **Motion:** load animations (split-word hero headline, bridge strokes drawing, card entrances) are CSS only. `components/site-motion.tsx` lazy-loads `gsap` + `ScrollTrigger` and `lenis` after hydration for scroll scenes (reveals, count-ups, parallax, marquee skew), smooth scrolling on desktop, cursor spotlight on cards and magnetic buttons (`data-magnetic`). The server HTML is complete without any of it.
- **Reduced motion:** `prefers-reduced-motion: reduce` turns off Lenis and every GSAP scene, collapses CSS animations to their end state, and swaps the category marquee for a static wrap.
- **Phones:** `components/mobile-cta-bar.tsx` shows a bottom bar (Guides / Codes) after the first screen; it hides over the footer and while the cookie notice is open.
- **Hero numbers** come from `lib/home-stats.ts`, which counts pages in the public sitemap. Do not hard-code counts.

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web test`
- `pnpm --filter web start` — production (default **port 3000**, same as `next start`)

## Routes

- `/articles` — **Informational Guides** index (URL unchanged); entries are validated with Zod (`ArticleListSchema` in `lib/schemas/article.schema.ts`) and listed from `lib/articles/list.ts`. Optional **`listImageSrc`** (public path) shows a thumbnail on the index card.
- `/articles/chime-1000-two-friends` — Chime invite guide: **title + lede** (informational intro), referral-steps **`ArticlePartnerFigure`**, section **Referral offer illustration** with copy, then embedded **`ChimeReferralCalculator`** (`showHeading={false}` `showLead={false}` so the card has no duplicate title or rules blurb), **View offer details** (`cta_place: after_calculator`), building figure (with CTA), **Important to understand** checklist, and disclaimer. **`ArticleViewTracker`** fires `article_view`. **`GoogleAnalytics`** in root layout loads GA4 on a public host only after the cookie banner is accepted. On viewports wider than 640px, figures cap at **605px** width. JSON-LD `Article` uses `lib/articles/list.ts` title and description. Clickable figures → `CHIME_PARTNER_REFERRAL_URL` in `lib/chime-article-constants.ts`.
- `/` — visible H1, affiliate disclosure, hero slider, offer details row (Robinhood only; Klarna, Public, and PayPal referral promotions are not published), category carousel, **clip-out promo grid** (8 codes in `lib/home-clip-coupons.ts`; assets e.g. `/brands/ubereats-logo.png`, `/clip-coupons/7eleven.svg`, `/clip-coupons/robinhood.svg`, `/clip-coupons/lyft.svg`, `/clip-coupons/lime.svg`, `/clip-coupons/bird.svg`, `/clip-coupons/poshmark.svg`). **Clip cards:** tapping the **code** copies it, shows a toast, then a **confirm dialog**; **See details** opens the partner URL in a new tab **immediately** (no dialog) — same pattern on store **Top offers** / **Explore more** clip rows (`useClipPartnerOfferFlow` + `ClipOpenStoreDialog`).
- `/` — header: **Stores** (mega menu by category; first nav link after the logo; each category shows the same `/categories/{slug}.svg` tile as the carousel; slate/neutral hover/active chrome, no green), **Coupons** (anchor `#coupons` to the clip grid, hidden on narrow viewports to save space), **Guides** (`/articles`, to the right of Coupons on desktop), and a **store name search** (client-side filter over `useClientCatalog()` → links to `/stores/[slug]`). `/stores` and `/coupons` redirect to `/`. `/categories/food` and legacy `/categories/food-dining` 301 to `/categories/shopping`. `/categories/travel` 301s to `/disclosures` because it no longer has a listed store.
- **Client catalog:** `getClientCatalog()` runs in `app/layout.tsx` and hydrates `ClientCatalogProvider` with categories → stores → active offers. `useClientCatalog()` / `StoreRelatedPanel` reuse this on store pages (and anywhere else you add client UI).
- **`app/(default)/layout.tsx`** — same shell as home: `HomeHeader`, `HomeFooter`, `home.css` (`.default-main` content width 1280px; in-content links slate, not legacy green). App font: **Plus Jakarta Sans** via `next/font` on root `app/layout.tsx` (`--font-app`).
- `/categories/[slug]` — stores in that category; each row shows a **larger logo tile** (image, inline `logoSvg`, or letter fallback), **title**, **short description** from `site-data` `description` (or a neutral fallback), **counts** of promo codes vs link-only offers, and one **View store** button to `/stores/[slug]`.
- `/stores/[slug]` — hero: large logo on the left, **About this store** + `See provider details` CTA on the right (uses this store’s first active `referralUrl` from `getOffers`) plus an affiliate disclosure below the hero. **Top offers** (single block): all active offers for that store — clip-style cards when `couponCode` is set, otherwise partner-offer link cards as **Explore more** (`StoreRelatedOfferCards` + `getCuratedLinkCardCopyForExploreMore`). Sort: **promo codes first**, then link-only offers. **Explore more** uses the same ordering for peer offers. Home `/` uses **Offer details this month** + **Partner offer guides** rows with `getHotCashbackOffers()` (slugs that appear in the monthly row are omitted from the partner-offer strip).
- `/coupons/[id]` — **308 permanent redirect** to `/stores/[slug]` for the offer’s store (`getStoreSlugForOfferId` in `site-data.ts`); unknown ids → 404. Legacy `/offers/*` still rewrites to `/coupons/*` in `next.config.ts`.

## Types

Zod schemas and inferred types live in `lib/schemas`; runtime content lives in `lib/site-data.ts`. Article registry and copy metadata live in `lib/articles/list.ts` (add new posts there and extend `ArticleListSchema` via the same pattern).
