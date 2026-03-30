# Design References

This document defines the UI style baseline for BonusBridge (`apps/web`).

## Canonical Visual References

- `docs/raw/retailmenot.png` - primary layout reference for listing pages and offer cards.
- `docs/raw/coupun_today.png` - secondary coupon-list pattern reference (badges, trust cues, CTA rhythm).
- `docs/raw/nerdwallet.png` - secondary editorial/list composition reference for merchant + deal detail balance.
- `docs/fonts_style_icons/medium.png` - canonical reference for typography, icon style, and overall visual tone.

## Reference Direction

- Primary structure reference: RetailMeNot-like listing pages (search-first, filterable lists, clear merchant/offer cards).
- Additional pattern references: CouponToday and Nerdwallet patterns for promos, trust signals, and scannable deal metadata.
- Visual mood reference: Medium-like color and typography tone (calm, readable, editorial, low-noise UI).

## Fonts, Icons, and Style Source

- For font pairing, icon weight/shape, and UI style cues, use `docs/fonts_style_icons/medium.png` as the source reference.
- Keep icon style consistent (stroke/filled choice, corner softness, visual weight).
- Keep typography choices consistent with Medium-like readability priorities from this reference.

## Practical Rules

### Layout

- Use a clear page frame: header, primary content area, optional sidebar filters, and footer.
- Keep content width constrained on desktop for readability; center main content.
- Prefer one dominant primary action per viewport section.
- Preserve stable placement of filters, sorting, and pagination.

### Listing Cards

- Card content priority: title, key value (bonus/discount), provider/service, status, and primary CTA.
- Keep card metadata concise and scannable; avoid dense text blocks.
- Use consistent card height rhythm in grids; avoid large visual jumps between sibling cards.
- Show empty states with actionable guidance (reset filters, broaden query).

### Filters and Search

- Keep search input prominent and always available on listing pages.
- Group filters by user intent: geography, category/service, status, sort.
- Reflect active filters as visible chips/tags and allow one-click clear.
- Preserve filter state in URL query params for shareability and refresh stability.

### Typography

- Prioritize readability over decorative typography.
- Keep heading hierarchy explicit (H1 -> H2 -> H3) and avoid skipping levels.
- Use comfortable line length and spacing for paragraph text.
- Ensure body text remains legible on mobile without zoom.

### Color Tokens

- Use semantic tokens, not hardcoded random colors:
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`
  - `--color-primary`, `--color-primary-contrast`
  - `--color-success`, `--color-warning`, `--color-danger`
  - `--color-border`, `--color-focus`
- Keep contrast high enough for readability in all states (normal, hover, disabled).
- Use accent colors sparingly for status, CTA, and highlights.

### Spacing and Density

- Use a consistent spacing scale (e.g. 4/8/12/16/24/32).
- Keep vertical rhythm stable between sections, cards, and form controls.
- Avoid overly compact controls in dense lists or tables; preserve click/tap comfort.

### Responsiveness

- Support desktop, tablet, and mobile intentionally; no layout breakpoints left implicit.
- On tablet/mobile, collapse side filters into a clear drawer/sheet pattern.
- For table-heavy layouts, provide horizontal scroll fallback and key-column visibility.
- Keep core CTA and filter controls accessible within first viewport on mobile.

### Accessibility

- Keyboard navigability required for all interactive controls.
- Visible focus state required for links, buttons, and form elements.
- Labels required for inputs; placeholders are not labels.
- Status and errors must not rely on color alone; include text/icon cues.

## Do / Don't

### Do

- Do keep list pages highly scannable with clear visual hierarchy.
- Do align spacing, color semantics, and component rhythm across pages.
- Do reuse shared UI patterns for cards, filters, badges, and status labels.
- Do validate responsive behavior on desktop, tablet, and mobile before approval.

### Don't

- Don't use cluttered card layouts with multiple competing CTAs.
- Don't hide critical filters behind ambiguous controls.
- Don't introduce inconsistent token naming or ad-hoc spacing values.
- Don't ship material visual deviations from this guide without explicit PM approval.
