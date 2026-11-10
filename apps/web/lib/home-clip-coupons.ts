import { programClaim, requirePublicReferralUrl } from '@/lib/referral-programs'

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

/** Only Bucket 1 programs with a public code stay on the home clip row. */
export const HOME_CLIP_COUPONS: HomeClipCoupon[] = [
  {
    id: 'clip-lyft',
    brand: 'Lyft',
    title: 'Lyft new-rider credit',
    blurb: programClaim('lyft'),
    code: 'VADIM53422',
    openUrl: requirePublicReferralUrl('lyft'),
    logoSrc: '/clip-coupons/lyft.svg'
  },
  {
    id: 'clip-visible',
    brand: 'Visible',
    title: '$20 credit on a new Visible line',
    blurb: programClaim('visible'),
    code: '69PW6WF',
    openUrl: requirePublicReferralUrl('visible'),
    logoSrc: '/brands/visible.svg'
  }
]
