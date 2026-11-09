import { getReferralProgram, requirePublicReferralUrl } from '@/lib/referral-programs'

/**
 * What a NEW member gets, as each provider's own terms page states it.
 *
 * Rule: `amount` is set only when the official page states a fixed amount for the invitee.
 * Rakuten, TopCashback and PayPal Honey do not state one; Lyft forbids quoting an unauthorized amount.
 * Re-check `sourceUrl` and bump `checkedAt` whenever an amount changes.
 */
export type SignupBonus = {
  slug: string
  provider: string
  /** e.g. "$100"; null when the provider's terms give no fixed invitee amount. */
  amount: string | null
  /** Short line under the amount or in place of it. */
  headline: string
  /** Conditions in one sentence, taken from the provider's terms. */
  condition: string
  ctaLabel: string
  referralUrl: string
  sourceUrl: string
  /** ISO date the source page was last read. */
  checkedAt: string
}

export type SignupBonusDraft = Omit<SignupBonus, 'referralUrl' | 'sourceUrl' | 'provider'>

const CHECKED = '2026-11-09'

const DRAFTS: SignupBonusDraft[] = [
  {
    slug: 'chime',
    amount: '$100',
    headline: 'for new Chime members',
    condition: 'After a qualifying direct deposit of $200 or more within 45 days of opening, plus card activation.',
    ctaLabel: 'Get $100 with Chime',
    checkedAt: CHECKED
  },
  {
    slug: 'rakuten',
    amount: null,
    headline: 'New-member bonus set by Rakuten',
    condition: 'Make a qualifying Cash Back purchase within 90 days of joining. Amazon.com is excluded.',
    ctaLabel: 'Join Rakuten',
    checkedAt: CHECKED
  },
  {
    slug: 'topcashback',
    amount: null,
    headline: 'Welcome promo set by TopCashback',
    condition: 'Sign up through the link and verify your account. Cash Back rates vary by retailer.',
    ctaLabel: 'Join TopCashback',
    checkedAt: CHECKED
  },
  {
    slug: 'honey',
    amount: null,
    headline: 'Earn PayPal Rewards points',
    condition: 'Points are earned on eligible purchases after you join. Points are not cash.',
    ctaLabel: 'Join PayPal Honey',
    checkedAt: CHECKED
  },
  {
    slug: 'lyft',
    amount: null,
    headline: 'New-rider credit varies by city',
    condition: 'Check the credit shown in the Lyft app before your first ride.',
    ctaLabel: 'Join Lyft',
    checkedAt: CHECKED
  }
]

/** Exported for tests. Drops drafts whose program is not public. */
export function buildSignupBonus(draft: SignupBonusDraft): SignupBonus | null {
  const program = getReferralProgram(draft.slug)
  if (!program?.publicOk || !program.termsUrl) return null
  return {
    ...draft,
    provider: program.name,
    referralUrl: requirePublicReferralUrl(draft.slug),
    sourceUrl: program.termsUrl
  }
}

const BONUSES: SignupBonus[] = DRAFTS.map(buildSignupBonus).filter((b): b is SignupBonus => b !== null)

export function getSignupBonus(slug: string): SignupBonus | null {
  return BONUSES.find((b) => b.slug === slug) ?? null
}

/** For pages hard-wired to one provider (e.g. the Chime article): fail the build instead of rendering without a CTA. */
export function requireSignupBonus(slug: string): SignupBonus {
  const bonus = getSignupBonus(slug)
  if (!bonus) throw new Error(`No public signup bonus for ${slug}`)
  return bonus
}

/** Bonuses with a stated amount first, then the rest in catalog order. */
export function listSignupBonuses(): SignupBonus[] {
  return [...BONUSES].sort((a, b) => Number(b.amount !== null) - Number(a.amount !== null))
}

/** The bonus to feature across the site: the first with a stated amount. */
export function featuredSignupBonus(list: SignupBonus[] = BONUSES): SignupBonus | null {
  return list.find((b) => b.amount !== null) ?? null
}

/** Plain props for the phone bottom bar (a client component): the featured bonus, if any. */
export function mobileBarBonus(list: SignupBonus[] = BONUSES) {
  const b = featuredSignupBonus(list)
  return b ? { slug: b.slug, amount: b.amount as string, provider: b.provider, referralUrl: b.referralUrl } : null
}

export function formatCheckedDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}
