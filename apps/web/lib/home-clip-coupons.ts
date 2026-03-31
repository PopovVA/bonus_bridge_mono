/** Home “tear-off” promo grid — static copy; edit here to change codes and URLs. */
export type HomeClipCoupon = {
  id: string
  brand: string
  title: string
  blurb: string
  code: string
  openUrl: string
  /** Brand mark path under `/public` (e.g. `/brands/…`, `/clip-coupons/…`). */
  logoSrc: string
}

/** Uber rides wordmark — `hero-slider` Uber slide. */
const CLIP_CARD_LOGO_UBER = '/brands/uber-logo.png'
/** Uber Eats mark — `hero-slider` Uber Eats fallback asset. */
const CLIP_CARD_LOGO_UBER_EATS = '/brands/ubereats-logo.png'
/** 7‑Eleven / 7Now mark — `public/clip-coupons/7eleven.svg`. */
const CLIP_CARD_LOGO_7NOW = '/clip-coupons/7eleven.svg'

export const HOME_CLIP_COUPONS: HomeClipCoupon[] = [
  {
    id: 'clip-ubereats',
    brand: 'Uber Eats',
    title: '$20 off delivery orders',
    blurb: 'New users; minimum spend and expiry per Uber Eats.',
    code: 'eats-zywrn58e0v',
    openUrl: 'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
    logoSrc: CLIP_CARD_LOGO_UBER_EATS
  },
  {
    id: 'clip-uber-rides',
    brand: 'Uber',
    title: '50% off your next 2 trips',
    blurb: 'Up to $10 off each ride at half price — caps, timing, and eligibility follow Uber’s current offer.',
    code: 'zfj232q2gjsx',
    openUrl: 'https://referrals.uber.com/refer?id=zfj232q2gjsx',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-7now',
    brand: '7Now Delivery',
    title: '$10 off your next order',
    blurb: '$10 credit on a qualifying order — minimum spend and expiry follow 7Now’s current offer.',
    code: 'my1w2j',
    openUrl: 'https://smart.link/370flfia27552?cp_0=my1w2j',
    logoSrc: CLIP_CARD_LOGO_7NOW
  },
  {
    id: 'clip-instacart',
    brand: 'Instacart',
    title: '$30 off first order',
    blurb: 'Grocery delivery; minimum cart and fees may apply.',
    code: 'CARTNEW30',
    openUrl: 'https://example.com/promos/instacart-stub',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-starbucks',
    brand: 'Starbucks',
    title: 'BOGO handcrafted drink',
    blurb: 'Rewards members; afternoons on select days.',
    code: 'STAR-BOGO-PM',
    openUrl: 'https://example.com/promos/starbucks-stub',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-chipotle',
    brand: 'Chipotle',
    title: 'Free chips & guac',
    blurb: 'App or online order over $10; limited time.',
    code: 'EXTRA-GUAC-24',
    openUrl: 'https://example.com/promos/chipotle-stub',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-target',
    brand: 'Target',
    title: '$10 off $50 Circle offer',
    blurb: 'Circle membership; excludes some categories.',
    code: 'CIRCLE1050',
    openUrl: 'https://example.com/promos/target-stub',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-nike',
    brand: 'Nike',
    title: '20% off members',
    blurb: 'Nike.com and app; members-only promo window.',
    code: 'NIKE-MEMBER20',
    openUrl: 'https://example.com/promos/nike-stub',
    logoSrc: CLIP_CARD_LOGO_UBER
  }
]
