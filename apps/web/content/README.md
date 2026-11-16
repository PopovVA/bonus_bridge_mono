# Promo codes data

`promos.json` is the only file to edit when publishing promo codes and limited-time offers. The site loads it when the app builds. `parsePromos` in `apps/web/lib/schemas/promo.schema.ts` checks the file as soon as that module loads, so a bad edit fails `pnpm test` and `pnpm --filter web build` instead of shipping a broken page.

Keep the file as one JSON array. An empty list (`[]`) is valid and is how the site ships until a real offer is checked.

JSON does not allow comments. Put notes in the commit message, not in this file.

A bot can update offers with a single-file commit that touches only `apps/web/content/promos.json`.

## Fields

| Field | Required | Rule |
| --- | --- | --- |
| id | yes | Unique slug: lowercase letters, numbers, and single hyphens. 2 to 80 characters. |
| store | yes | Brand name readers should see. 2 to 120 characters. |
| storeSlug | no | Slug of a public `/stores/<slug>` page, or null. If the slug is missing or not a public store, the offer still shows and the name is not linked. |
| title | yes | Short offer name. 2 to 180 characters. |
| code | no | The code to copy, or null when the offer has no code. 1 to 64 characters. Do not use an empty string. |
| description | yes | What the offer is. 2 to 500 characters. |
| terms | yes | Short conditions. 2 to 280 characters. |
| url | yes | Official offer or terms page. `http` or `https` only, up to 500 characters. |
| startsAt | no | ISO datetime with `Z` or a numeric offset, or null. Omit it when the offer has already started. |
| expiresAt | yes | ISO datetime with `Z` or a numeric offset, or null when there is no set end date. Must be later than `startsAt` when both are set. |
| source | yes | Where it was checked, for example `brand newsletter`. 2 to 120 characters. |
| checkedAt | yes | Calendar date `YYYY-MM-DD`. |
| category | no | Short label such as `shopping`, or null. 2 to 80 characters. |

Do not add fields. Unknown keys fail validation.

Do not add Public.com, SoFi, or crypto partner links.

## How an offer is shown

Status is computed from `startsAt`, `expiresAt`, and the current time. It is not stored in the file.

- Active: it has started (or has no `startsAt`) and `expiresAt` is null or still in the future. Active offers are listed first, soonest `expiresAt` first. Offers with no end date come after dated ones.
- Starts later: `startsAt` is still in the future. Shown in a separate section on `/promos`, not on the store page.
- Expired: `expiresAt` is in the past. Stays on `/promos` in the Expired section (gray text, struck-through code, no copy button, no official-page button). Hidden on `/stores/<slug>`.

The page refreshes about once an hour. The browser also compares `expiresAt` with the clock, so a cached page grays an offer out when the time passes, without a new deploy.

## Example

This sample is documentation only. Do not paste it into `promos.json` unless the offer is real and the official page was just checked. The live file stays `[]` until then.

```json
[
  {
    "id": "example-store-spring",
    "store": "Example Store",
    "storeSlug": "example-store",
    "title": "Spring welcome code",
    "code": "SPRING20",
    "description": "New customers save on one order.",
    "terms": "One use per customer. US shoppers only.",
    "url": "https://example.com/terms/spring",
    "startsAt": "2026-03-01T00:00:00-05:00",
    "expiresAt": "2026-03-31T23:59:00-05:00",
    "source": "brand newsletter",
    "checkedAt": "2026-03-02",
    "category": "shopping"
  },
  {
    "id": "example-store-ongoing",
    "store": "Example Store",
    "storeSlug": null,
    "title": "Free shipping this season",
    "code": null,
    "description": "Free shipping when the brand's own threshold is met.",
    "terms": "Threshold and regions are on the official page.",
    "url": "https://example.com/terms/shipping",
    "startsAt": null,
    "expiresAt": null,
    "source": "brand newsletter",
    "checkedAt": "2026-03-02",
    "category": null
  }
]
```
