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

/** Curated cashback partners for the home page (no right-rail art — logo + copy + CTA only). */
export const HOT_CASHBACK_OFFERS: HotCashbackOffer[] = [
  {
    id: 'hot-cashback-rakuten',
    brandName: 'Rakuten',
    slug: 'rakuten',
    badgeText: '$50 bonus',
    headline: 'Up to $50 after qualifying spend',
    description:
      'Register for up to $50 after qualifying spend—Rakuten pays cashback when you shop its partner stores.',
    ctaText: 'Get the bonus',
    href: 'https://www.rakuten.com/r/MVADIM7',
    logoSrc: '/hot-cashback/logos/rakuten.svg'
  },
  {
    id: 'hot-cashback-topcashback',
    brandName: 'TopCashback',
    slug: 'topcashback',
    badgeText: '$40 cashback',
    headline: 'Up to $40 new-member bonus',
    description:
      'TopCashback adds up to $40 in new-member bonus cashback on store rates and pays out once you hit the minimum.',
    ctaText: 'Join TopCashback',
    href: 'https://www.topcashback.com/ref/member344836925437',
    logoSrc: '/hot-cashback/logos/topcashback.png'
  },
  {
    id: 'hot-cashback-honey',
    brandName: 'Honey',
    slug: 'honey',
    badgeText: '$10 cashback',
    headline: 'Earn Honey Gold on qualifying purchases',
    description:
      'Register, complete a qualifying first purchase, and earn Honey Gold—PayPal’s Honey finds coupons while you shop.',
    ctaText: 'Join Honey',
    href: 'https://www.joinhoney.com/ref/nwpz6sw',
    logoSrc: '/hot-cashback/logos/honey.svg'
  },
  {
    id: 'hot-cashback-lemonade',
    brandName: 'Lemonade',
    slug: 'lemonade',
    badgeText: '$10 gift card',
    headline: 'Gift card on qualifying sign-ups',
    description:
      'Qualifying sign-ups may get a $10 gift card on Lemonade’s app-based renters, home, pet, and car coverage.',
    ctaText: 'Open Lemonade',
    href: 'https://lemonade.com/r/vadimpopov1',
    logoSrc: '/hot-cashback/logos/lemonade.svg'
  },
  {
    id: 'hot-cashback-chime',
    brandName: 'Chime',
    slug: 'chime',
    badgeText: '125$',
    headline: 'See up to $125 new-account bonus (Chime)',
    description:
      'New account and qualifying direct deposit may be required — see Chime for current terms. Eligibility and amounts follow Chime.',
    ctaText: 'View offer details',
    href: 'https://www.chime.com/r/vadimpopov1/',
    logoSrc: '/stores/chime.svg'
  },
  /** Same copy as home “Top offers” row; omitted from home Hot Cashback list via `getHotCashbackOffers()` to avoid duplicate tiles. */
  {
    id: 'hot-cashback-public',
    brandName: 'Public',
    slug: 'public',
    badgeText: '20$ off',
    headline: 'Invest with friends on Public',
    description:
      'Invest with friends on Public. Join through our link for a welcome bonus when you qualify — stocks, ETFs, and more.',
    ctaText: 'Join Public',
    href: 'https://share.public.com/Vadim66923',
    logoSrc: '/top-offers/logos/public-logo.svg'
  }
]

/** Curated badge/copy/CTA for a slug (home Hot Cashback + Explore More link-only cards). */
export function getHotCashbackOfferByStoreSlug(slug: string): HotCashbackOffer | undefined {
  return HOT_CASHBACK_OFFERS.find((h) => h.slug === slug)
}
