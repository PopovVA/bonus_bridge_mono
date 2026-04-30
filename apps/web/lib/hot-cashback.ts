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
    headline: 'Rakuten offer details and eligibility',
    description:
      'Learn about Rakuten new-member offer details, qualifying spend requirements, and current provider terms.',
    ctaText: 'See offer details',
    href: 'https://www.rakuten.com/r/MVADIM7',
    logoSrc: '/hot-cashback/logos/rakuten.svg'
  },
  {
    id: 'hot-cashback-topcashback',
    brandName: 'TopCashback',
    slug: 'topcashback',
    badgeText: 'Terms apply',
    headline: 'TopCashback new-member offer details',
    description:
      'Review TopCashback new-member offer details, payout minimums, and eligibility on the provider site.',
    ctaText: 'Check eligibility',
    href: 'https://www.topcashback.com/ref/member344836925437',
    logoSrc: '/hot-cashback/logos/topcashback.png'
  },
  {
    id: 'hot-cashback-honey',
    brandName: 'Honey',
    slug: 'honey',
    badgeText: 'Terms apply',
    headline: 'Honey rewards eligibility explained',
    description:
      'Learn how Honey rewards and coupon tools work, including qualifying activity and PayPal/Honey terms.',
    ctaText: 'See offer details',
    href: 'https://www.joinhoney.com/ref/nwpz6sw',
    logoSrc: '/hot-cashback/logos/honey.svg'
  },
  {
    id: 'hot-cashback-lemonade',
    brandName: 'Lemonade',
    slug: 'lemonade',
    badgeText: 'Terms apply',
    headline: 'Lemonade referral terms overview',
    description:
      'Review Lemonade referral offer details for eligible insurance products and provider requirements.',
    ctaText: 'View provider terms',
    href: 'https://lemonade.com/r/vadimpopov1',
    logoSrc: '/hot-cashback/logos/lemonade.svg'
  },
  {
    id: 'hot-cashback-chime',
    brandName: 'Chime',
    slug: 'chime',
    badgeText: 'Terms apply',
    headline: 'Chime new-account offer details',
    description:
      'New account and qualifying direct deposit may be required — see Chime for current terms. Eligibility and amounts follow Chime.',
    ctaText: 'View offer details',
    href: 'https://www.chime.com/r/vadimpopov1/',
    logoSrc: '/stores/chime.svg'
  },
  /** Same copy as home offer-details row; omitted from home partner-offer list via `getHotCashbackOffers()` to avoid duplicate tiles. */
  {
    id: 'hot-cashback-public',
    brandName: 'Public',
    slug: 'public',
    badgeText: 'Terms apply',
    headline: 'Public welcome offer details',
    description:
      'Learn about Public welcome offer eligibility, funding requirements, and current provider terms.',
    ctaText: 'See offer details',
    href: 'https://share.public.com/Vadim66923',
    logoSrc: '/top-offers/logos/public-logo.svg'
  }
]

/** Curated badge/copy/CTA for a slug (home partner-offer guides + Explore More link-only cards). */
export function getHotCashbackOfferByStoreSlug(slug: string): HotCashbackOffer | undefined {
  return HOT_CASHBACK_OFFERS.find((h) => h.slug === slug)
}
