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

export type StoreFaq = { question: string; answer: string }

/** Search-intent title for a store page, e.g. "Chime referral bonus: $100 for new members". */
export function storeSeoTitle(bonus: SignupBonus): string {
  return bonus.amount
    ? `${bonus.provider} referral bonus: ${bonus.amount} for new members`
    : `${bonus.provider} referral program: terms explained`
}

export function storeSeoDescription(bonus: SignupBonus): string {
  const lead = bonus.amount ? `${bonus.amount} ${bonus.headline}. ` : `${bonus.headline}. `
  return `${lead}${bonus.condition} Official ${bonus.provider} terms linked.`
}

/** Three answers built only from the bonus record, so the FAQ never says more than the provider's terms. */
export function storeFaqs(bonus: SignupBonus): StoreFaq[] {
  const checked = formatCheckedDate(bonus.checkedAt)
  return [
    {
      question: `How much do new members get from the ${bonus.provider} referral bonus?`,
      answer: bonus.amount
        ? `${bonus.provider}’s official terms state ${bonus.amount} ${bonus.headline}. Checked ${checked}. Amounts can change.`
        : `${bonus.provider}’s official terms do not state a fixed amount for new members. ${bonus.headline}. Checked ${checked}.`
    },
    {
      question: `What do I need to do to qualify?`,
      answer: bonus.condition
    },
    {
      question: `Where are the official ${bonus.provider} terms?`,
      answer: `On ${bonus.provider}’s own site: ${bonus.sourceUrl}. BonusBridge may earn a referral bonus when you sign up through our link.`
    }
  ]
}
