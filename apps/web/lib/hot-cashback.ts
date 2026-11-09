import { programClaim, requirePublicReferralUrl } from '@/lib/referral-programs'

export type HotCashbackOffer = {
  id: string
  brandName: string
  slug: string
  badgeText: string
  /** Bold line under brand — same role as clip card headline. */
  headline: string
  description: string
  ctaText: string
  href: string
  logoSrc: string
}

/** Curated partner offers for the home page (no right-rail art — logo + copy + CTA only). */
export const HOT_CASHBACK_OFFERS: HotCashbackOffer[] = [
  {
    id: 'hot-cashback-rakuten',
    brandName: 'Rakuten',
    slug: 'rakuten',
    badgeText: 'Terms apply',
    headline: 'Rakuten welcome bonus varies',
    description: programClaim('rakuten'),
    ctaText: 'Join Rakuten',
    href: requirePublicReferralUrl('rakuten'),
    logoSrc: '/hot-cashback/logos/rakuten.svg'
  },
  {
    id: 'hot-cashback-topcashback',
    brandName: 'TopCashback',
    slug: 'topcashback',
    badgeText: 'Terms apply',
    headline: 'TopCashback $10 after $10',
    description: programClaim('topcashback'),
    ctaText: 'Join TopCashback',
    href: requirePublicReferralUrl('topcashback'),
    logoSrc: '/hot-cashback/logos/topcashback.png'
  },
  {
    id: 'hot-cashback-honey',
    brandName: 'Honey',
    slug: 'honey',
    badgeText: 'Points, not cash',
    headline: 'Honey pays points, not cash',
    description: programClaim('honey'),
    ctaText: 'Join PayPal Honey',
    href: requirePublicReferralUrl('honey'),
    logoSrc: '/hot-cashback/logos/honey.svg'
  },
  {
    id: 'hot-cashback-chime',
    brandName: 'Chime',
    slug: 'chime',
    badgeText: '$100 for new members',
    headline: 'Chime referral requirements',
    description: programClaim('chime'),
    ctaText: 'Get $100 with Chime',
    href: requirePublicReferralUrl('chime'),
    logoSrc: '/stores/chime.svg'
  }
]

/** Curated badge/copy/CTA for a slug (home partner-offer guides + Explore More link-only cards). */
export function getHotCashbackOfferByStoreSlug(slug: string): HotCashbackOffer | undefined {
  return HOT_CASHBACK_OFFERS.find((h) => h.slug === slug)
}
