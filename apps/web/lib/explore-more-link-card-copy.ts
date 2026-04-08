import { getHotCashbackOfferByStoreSlug } from '@/lib/hot-cashback'
import { getMonthlyTopOfferSnapshotBySlug } from '@/lib/site-data'

export type CuratedExploreLinkCardCopy = {
  badgeText: string
  /** Bold headline under brand (hot cashback); monthly uses offer title from catalog instead. */
  headline: string | null
  description: string
  ctaText: string
  href: string
  logoSrc: string
}

/**
 * Link-only cards in Explore More: prefer home **Top offers this month** copy (Klarna / Robinhood / Public),
 * then **Hot Cashback** curated rows — same strings as on `/`.
 */
export function getCuratedLinkCardCopyForExploreMore(slug: string): CuratedExploreLinkCardCopy | null {
  const monthly = getMonthlyTopOfferSnapshotBySlug(slug)
  if (monthly) {
    return {
      badgeText: monthly.badgeText ?? 'Offer',
      headline: null,
      description: monthly.description,
      ctaText: monthly.ctaText,
      href: monthly.href,
      logoSrc: monthly.logoSrc
    }
  }
  const hot = getHotCashbackOfferByStoreSlug(slug)
  if (hot) {
    return {
      badgeText: hot.badgeText,
      headline: hot.headline,
      description: hot.description,
      ctaText: hot.ctaText,
      href: hot.href,
      logoSrc: hot.logoSrc
    }
  }
  return null
}
