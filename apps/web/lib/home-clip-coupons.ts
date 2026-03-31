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
/** Lyft wordmark — `public/clip-coupons/lyft.svg`. */
const CLIP_CARD_LOGO_LYFT = '/clip-coupons/lyft.svg'
/** Robinhood wordmark — `public/clip-coupons/robinhood.svg`. */
const CLIP_CARD_LOGO_ROBINHOOD = '/clip-coupons/robinhood.svg'
/** Lime wordmark — `public/clip-coupons/lime.svg`. */
const CLIP_CARD_LOGO_LIME = '/clip-coupons/lime.svg'
/** Bird wordmark — `public/clip-coupons/bird.svg`. */
const CLIP_CARD_LOGO_BIRD = '/clip-coupons/bird.svg'
/** Poshmark wordmark — `public/clip-coupons/poshmark.svg`. */
const CLIP_CARD_LOGO_POSHMARK = '/clip-coupons/poshmark.svg'

export const HOME_CLIP_COUPONS: HomeClipCoupon[] = [
  {
    id: 'clip-ubereats',
    brand: 'Uber Eats',
    title: '$20 off delivery orders',
    blurb: 'New accounts get delivery savings. Minimum spend and expiry follow Uber Eats.',
    code: 'eats-zywrn58e0v',
    openUrl: 'https://ubereats.com/feed?promoCode=eats-zywrn58e0v',
    logoSrc: CLIP_CARD_LOGO_UBER_EATS
  },
  {
    id: 'clip-uber-rides',
    brand: 'Uber',
    title: '50% off your next 2 trips',
    blurb: 'Up to $10 off each of two rides at half price. Caps, timing, and eligibility follow Uber’s current offer.',
    code: 'zfj232q2gjsx',
    openUrl: 'https://referrals.uber.com/refer?id=zfj232q2gjsx',
    logoSrc: CLIP_CARD_LOGO_UBER
  },
  {
    id: 'clip-7now',
    brand: '7Now Delivery',
    title: '$10 off your next order',
    blurb: '$10 credit on a qualifying order. Minimum spend and expiry follow 7Now’s current offer.',
    code: 'my1w2j',
    openUrl: 'https://smart.link/370flfia27552?cp_0=my1w2j',
    logoSrc: CLIP_CARD_LOGO_7NOW
  },
  {
    id: 'clip-robinhood',
    brand: 'Robinhood',
    title: 'Get $5 to $200 in stock',
    blurb: 'Gift stock after you sign up and meet funding rules. Many rewards are $5 to $10. Limits and terms on Robinhood.',
    code: 'vadimp-4f32ef3',
    openUrl: 'https://join.robinhood.com/vadimp-4f32ef3',
    logoSrc: CLIP_CARD_LOGO_ROBINHOOD
  },
  {
    id: 'clip-lyft',
    brand: 'Lyft',
    title: '50% off your next ride',
    blurb: 'Up to $10 off one ride for new riders. Market rules and expiry follow Lyft’s current offer.',
    code: 'VADIM53422',
    openUrl: 'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
    logoSrc: CLIP_CARD_LOGO_LYFT
  },
  {
    id: 'clip-lime',
    brand: 'Lime',
    title: '$5 sign-up credit',
    blurb: 'New riders get account credit after sign-up. Amount, markets, and expiry follow Lime’s current offer.',
    code: 'REGUD7BFJWT',
    openUrl: 'https://lime.bike/referral_signin/REGUD7BFJWT',
    logoSrc: CLIP_CARD_LOGO_LIME
  },
  {
    id: 'clip-bird',
    brand: 'Bird',
    title: 'Up to $5 ride credit',
    blurb: 'New riders can get up to $5. Enter the code in the app after sign-up. Terms follow Bird.',
    code: 'X86GGD',
    openUrl: 'https://links.bird.co/rKbyq2',
    logoSrc: CLIP_CARD_LOGO_BIRD
  },
  {
    id: 'clip-poshmark',
    brand: 'Poshmark',
    title: '$10 credit when you join',
    blurb: '$10 when you sign up with this code. Further rules and expiry follow Poshmark.',
    code: 'VADIMPOPOV',
    openUrl: 'https://posh.mk/QW6tN2UJW1b',
    logoSrc: CLIP_CARD_LOGO_POSHMARK
  }
]
