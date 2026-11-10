/**
 * Single source of truth for which referral programs may appear on public pages.
 * Personal referral URLs are stored only for programs whose terms allow an owned site.
 * Unlisted programs keep terms links and a plain-language reason, never a personal code.
 */
import { z } from 'zod'

export const ReferralProgramSchema = z
  .object({
    slug: z.string().min(2),
    name: z.string().min(1),
    bucket: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    publicOk: z.boolean(),
    referralUrl: z.string().url().nullable(),
    termsUrl: z.string().url().nullable(),
    maxClaimText: z.string().min(1).max(500),
    disclosures: z.array(z.string().min(1)).min(1)
  })
  .superRefine((program, ctx) => {
    if (program.bucket === 1 && !program.publicOk) {
      ctx.addIssue({ code: 'custom', message: 'Bucket 1 programs stay public' })
    }
    if (program.bucket !== 1 && program.publicOk) {
      ctx.addIssue({ code: 'custom', message: 'Only bucket 1 programs may be public' })
    }
    if (program.publicOk && !program.referralUrl) {
      ctx.addIssue({ code: 'custom', message: 'Public programs need a referral URL' })
    }
    if (!program.publicOk && program.referralUrl) {
      ctx.addIssue({ code: 'custom', message: 'Unlisted programs cannot store a referral URL' })
    }
  })

export type ReferralProgram = z.infer<typeof ReferralProgramSchema>

const RAW_PROGRAMS: ReferralProgram[] = [
  {
    slug: 'rakuten',
    name: 'Rakuten',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.rakuten.com/r/MVADIM7',
    termsUrl: 'https://www.rakuten.com/help/article/referral-program-terms',
    maxClaimText:
      'Welcome bonus varies by the active Rakuten promo. It typically posts after a qualifying Cash Back purchase within 90 days. Amazon and certain categories are excluded. Confirm the live offer on Rakuten’s signup page.',
    disclosures: [
      'Posting is allowed on a site you own and control. Paid ads must not send traffic straight to the referral link.'
    ]
  },
  {
    slug: 'topcashback',
    name: 'TopCashback',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.topcashback.com/ref/member344836925437',
    termsUrl: 'https://www.topcashback.com/referrals/terms/',
    maxClaimText:
      'The referrer bonus is $10 once a new member reaches $10 in eligible Cash Back within 365 days. The invitee bonus depends on the active promo. Many retailers are excluded.',
    disclosures: [
      'A public website may share this link when a privacy notice, cookie notice, and FTC disclosure are present.'
    ]
  },
  {
    slug: 'lyft',
    name: 'Lyft',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
    termsUrl: 'https://www.lyft.com/terms/referrals',
    maxClaimText:
      'New riders may get a market-specific ride credit in eligible cities after a first ride within 30 days. Lyft does not authorize one fixed dollar amount for every city. Confirm the credit in the Lyft app.',
    disclosures: [
      'Online promotion is allowed only with Lyft’s restrictions, including no paid ads and no unauthorized dollar amount.'
    ]
  },
  {
    slug: 'chime',
    name: 'Chime',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.chime.com/r/vadimpopov1/',
    termsUrl: 'https://help.chime.com/what-is-chimes-standard-referral-program-eca42e30',
    maxClaimText:
      'A qualifying direct deposit of at least $200 within 45 days and debit card activation are required. Successful referrals are capped at 10 per calendar year. The referrer bonus is set at enrollment and is not a fixed guarantee.',
    disclosures: [
      'Chime’s help center describes sharing by social, text, or email. BonusBridge states the annual cap and the direct-deposit rules next to the link.'
    ]
  },
  {
    slug: 'honey',
    name: 'PayPal Honey',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.joinhoney.com/ref/nwpz6sw',
    termsUrl: 'https://help.joinhoney.com/article/33-can-i-refer-people-to-honey',
    maxClaimText:
      'Rewards are PayPal Rewards points, not instant cash. A referrer may receive 500 points after a friend’s eligible purchase confirms, often 60–90 days later.',
    disclosures: ['Point value and caps follow PayPal Honey’s terms. Do not describe the reward as cash.']
  },
  {
    slug: 'public',
    name: 'Public',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://public.com/disclosures/referral-terms',
    maxClaimText: 'Not listed. Public’s referral terms limit sharing to people you know personally.',
    disclosures: ['Personal friends and family only. Commercial advertising is not allowed.']
  },
  {
    slug: 'klarna',
    name: 'Klarna',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://cdn.klarna.com/1.0/shared/content/legal/terms/en-US/referral',
    maxClaimText: 'Not listed. Klarna referral sharing is limited to personal contacts.',
    disclosures: ['No public posting. The prior campaign end date means we do not advertise a current bonus.']
  },
  {
    slug: 'paypal',
    name: 'PayPal',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://www.paypal.com/us/campaign/invite/terms',
    maxClaimText: 'Not listed. PayPal invite terms are for family and friends, not public pages.',
    disclosures: ['Public locations are excluded. This site does not have a PayPal store referral card.']
  },
  {
    slug: 'robinhood',
    name: 'Robinhood',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://robinhood.com/us/en/support/articles/invite-friends-pick-stock/',
    maxClaimText: 'Not listed. Robinhood’s offer is for personal use and not commercial promotion.',
    disclosures: ['Share only with a personal friend. Commercial use is outside the offer terms.']
  },
  {
    slug: 'uber',
    name: 'Uber',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://ubercab.zendesk.com/hc/en-us/articles/201832366-What-is-the-referral-code-policy',
    maxClaimText: 'Not listed. Uber treats referral codes as personal and non-commercial.',
    disclosures: ['Coupon-site distribution is outside Uber’s referral code policy.']
  },
  {
    slug: 'uber-eats',
    name: 'Uber Eats',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://ubercab.zendesk.com/hc/en-us/articles/201832366-What-is-the-referral-code-policy',
    maxClaimText: 'Not listed. Uber Eats codes follow the same personal-use referral policy as Uber.',
    disclosures: ['No public coupon-site distribution.']
  },
  {
    slug: 'lemonade',
    name: 'Lemonade',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://lemonade.com/r/vadimpopov1',
    termsUrl: 'https://www.lemonade.com/terms-and-conditions-referral-program',
    maxClaimText:
      'Lemonade’s referral terms do not state a reward amount. A referral counts when a friend gets an insurance offer within 30 days; no purchase is required. Not available in LA, MI, MS, WA or WV.',
    disclosures: [
      'BonusBridge is not a licensed insurance agent. This page links to Lemonade and its referral terms; it does not describe coverage or recommend a policy.'
    ]
  },
  {
    slug: 'amex-hilton-honors',
    name: 'Hilton Honors Amex Card',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://americanexpress.com/en-us/referral/hilton-honors?ref=VADIMP2XC4&xl=cp10o6',
    termsUrl: 'https://www.americanexpress.com/en-us/referral',
    maxClaimText:
      'American Express does not state one fixed referral offer. An approved new Card Member may be eligible for the welcome offer shown on the referral page, with its own spend requirement and deadline. Approval is up to American Express.',
    disclosures: [
      'Rates, fees and offer terms are set by American Express. BonusBridge is not a lender and does not give credit advice.'
    ]
  },
  {
    slug: 'visible',
    name: 'Visible',
    bucket: 1,
    publicOk: true,
    referralUrl: 'https://www.visible.com/get/?69PW6WF',
    termsUrl: 'https://www.visible.com/plans/bring-a-friend',
    maxClaimText:
      'A new Visible member who activates with a Bring a Friend code gets a $20 service credit. The member who shared the code also gets $20 per activation, up to 12 credits banked. Credits have no cash value.',
    disclosures: ['Visible’s Bring a Friend page says the code can be shared with anyone.']
  },
  {
    slug: 'airbnb',
    name: 'Airbnb',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: null,
    maxClaimText: 'Not listed. The previous Airbnb link was the public homepage, not a referral.',
    disclosures: ['We do not frame a plain homepage link as a referral offer.']
  },
  {
    slug: '7now',
    name: '7NOW',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: null,
    maxClaimText: 'Not listed. The previous attribution link did not reliably carry a referral.',
    disclosures: ['Removed until a working referral URL and public-posting terms are both verified.']
  },
  {
    slug: 'bird',
    name: 'Bird',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: null,
    maxClaimText: 'Not listed. US public-posting terms were not found.',
    disclosures: ['We do not guess that a public website is an allowed channel.']
  },
  {
    slug: 'lime',
    name: 'Lime',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: null,
    maxClaimText: 'Not listed. A landing credit was visible, but US public-posting terms were not found.',
    disclosures: ['Unlisted until official sharing rules are verified. We do not advertise a dollar credit.']
  },
  {
    slug: 'poshmark',
    name: 'Poshmark',
    bucket: 2,
    publicOk: false,
    referralUrl: null,
    termsUrl: 'https://poshmark.com/terms',
    maxClaimText: 'Not listed. US referral advertising rules were not verified.',
    disclosures: ['No fixed bonus claim and no public referral card until US terms are confirmed.']
  },
  {
    slug: 'coinbase',
    name: 'Coinbase',
    bucket: 3,
    publicOk: false,
    referralUrl: null,
    termsUrl: null,
    maxClaimText: 'Held. Sharing rules were not fully verified, so there is no public referral card.',
    disclosures: ['Prefer an official affiliate agreement before any public promotion.']
  }
]

export const referralPrograms: ReferralProgram[] = z.array(ReferralProgramSchema).parse(RAW_PROGRAMS)

export function getReferralProgram(slug: string): ReferralProgram | undefined {
  return referralPrograms.find((program) => program.slug === slug)
}

export function isPublicStoreSlug(slug: string): boolean {
  const program = getReferralProgram(slug)
  return Boolean(program?.publicOk)
}

export function unlistedStoreSlugs(): string[] {
  return referralPrograms.filter((program) => !program.publicOk).map((program) => program.slug)
}

export function requirePublicReferralUrl(slug: string): string {
  const program = getReferralProgram(slug)
  const url = program && program.publicOk ? program.referralUrl : null
  if (!url) {
    throw new Error(`No public referral URL for ${slug}`)
  }
  return url
}

export function programClaim(slug: string): string {
  const program = getReferralProgram(slug)
  if (!program) {
    throw new Error(`No referral program for ${slug}`)
  }
  return program.maxClaimText
}

const PUBLIC_CODES: Record<string, string> = {
  lyft: 'VADIM53422'
}

export function publicReferralCode(slug: string): string | null {
  if (!isPublicStoreSlug(slug)) return null
  return PUBLIC_CODES[slug] ?? null
}
