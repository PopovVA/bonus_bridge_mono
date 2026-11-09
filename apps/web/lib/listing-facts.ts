import { ListingFactsSchema, type ListingFacts } from '@/lib/schemas/listing-facts.schema'
import { unlistedStoreSlugs } from '@/lib/referral-programs'

/**
 * Store slugs whose personal referral links are not published on BonusBridge.
 * Includes programs with no store route (PayPal) so a future page cannot promote one by accident.
 * This does not mark the businesses as unlawful or the links as technically dead.
 */
export const NOT_PUBLICLY_PROMOTED_STORE_SLUGS = unlistedStoreSlugs()

const LISTING_UPDATED_NOTE =
  'This is when the BonusBridge listing text was last edited. It is not a date when a bonus was verified.'

export function isNotPubliclyPromoted(slug: string): boolean {
  return NOT_PUBLICLY_PROMOTED_STORE_SLUGS.includes(slug)
}

export function formatListingUpdated(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function buildListingFacts(input: {
  slug: string
  terms?: string | null
  listingUpdatedAt?: string | null
  /** Set when the page quotes an amount from the provider's own terms (see lib/signup-bonuses.ts). */
  quotedAmountNote?: string | null
}): ListingFacts {
  const notPromoted = isNotPubliclyPromoted(input.slug)
  const terms = input.terms?.trim() ?? ''
  const conditions = notPromoted
    ? 'This page does not promote a public referral bonus. Any provider offer, amount, or eligibility is not verified here.'
    : input.quotedAmountNote
      ? `${terms} ${input.quotedAmountNote}`.trim()
      : terms
      ? `${terms} A current bonus amount is not verified on BonusBridge.`
      : 'Eligibility and amounts are set by the provider and can depend on your account. A current bonus amount is not verified on BonusBridge.'

  return ListingFactsSchema.parse({
    reviewState: notPromoted ? 'not_publicly_promoted' : 'unverified',
    regionLabel: 'Region',
    region: notPromoted
      ? 'BonusBridge does not state where a referral offer is available for this provider.'
      : 'Where this offer is available is not confirmed on BonusBridge. It can depend on your location and account. Check the provider.',
    conditionsLabel: 'Conditions',
    conditions,
    listingUpdatedLabel: formatListingUpdated(input.listingUpdatedAt),
    listingUpdatedNote: LISTING_UPDATED_NOTE,
    promotionNote: notPromoted
      ? 'BonusBridge is not publicly promoting a referral link for this provider under the terms available to us. That is not a statement that the service is unlawful, or that every possible link is inactive.'
      : null
  })
}
