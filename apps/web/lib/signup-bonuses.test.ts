import { describe, expect, it } from 'vitest'
import {
  buildSignupBonus,
  featuredSignupBonus,
  formatCheckedDate,
  getSignupBonus,
  listSignupBonuses,
  mobileBarBonus,
  requireSignupBonus
} from '@/lib/signup-bonuses'
import { getReferralProgram } from '@/lib/referral-programs'

describe('signup bonuses', () => {
  it('states an amount only for Chime, sourced from its official terms', () => {
    const chime = getSignupBonus('chime')
    expect(chime?.amount).toBe('$100')
    expect(chime?.sourceUrl).toBe(getReferralProgram('chime')?.termsUrl)
    expect(chime?.referralUrl).toBe(getReferralProgram('chime')?.referralUrl)
    const withAmount = listSignupBonuses().filter((b) => b.amount)
    expect(withAmount.map((b) => b.slug)).toEqual(['chime'])
  })

  it('never quotes an amount for Lyft', () => {
    expect(getSignupBonus('lyft')?.amount).toBeNull()
    expect(getSignupBonus('lyft')?.ctaLabel).not.toMatch(/\$/)
  })

  it('lists stated amounts first and returns null for unknown stores', () => {
    expect(listSignupBonuses()[0]?.slug).toBe('chime')
    expect(getSignupBonus('nope')).toBeNull()
  })

  it('features the first bonus with an amount', () => {
    expect(featuredSignupBonus()?.slug).toBe('chime')
    expect(featuredSignupBonus([])).toBeNull()
  })

  it('skips programs that are not public', () => {
    expect(
      buildSignupBonus({
        slug: 'robinhood',
        amount: '$5',
        headline: 'x',
        condition: 'y',
        ctaLabel: 'z',
        checkedAt: '2026-11-09'
      })
    ).toBeNull()
  })

  it('gives the phone bar plain props for the featured bonus', () => {
    expect(mobileBarBonus()).toMatchObject({ slug: 'chime', amount: '$100', provider: 'Chime' })
    expect(mobileBarBonus([])).toBeNull()
  })

  it('requires a bonus for hard-wired pages', () => {
    expect(requireSignupBonus('chime').amount).toBe('$100')
    expect(() => requireSignupBonus('nope')).toThrow('No public signup bonus for nope')
  })

  it('formats the check date', () => {
    expect(formatCheckedDate('2026-11-09')).toBe('Nov 9, 2026')
  })
})
