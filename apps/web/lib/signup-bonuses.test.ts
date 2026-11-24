import { describe, expect, it } from 'vitest'
import {
  buildSignupBonus,
  featuredSignupBonus,
  formatCheckedDate,
  getSignupBonus,
  listSignupBonuses,
  mobileBarBonus,
  requireSignupBonus,
  storeFaqs,
  storeSeoDescription,
  storeSeoTitle
} from '@/lib/signup-bonuses'
import { getReferralProgram } from '@/lib/referral-programs'

describe('signup bonuses', () => {
  it('states an amount only for Chime, sourced from its official terms', () => {
    const chime = getSignupBonus('chime')
    expect(chime?.amount).toBe('$100')
    expect(chime?.sourceUrl).toBe(getReferralProgram('chime')?.termsUrl)
    expect(chime?.referralUrl).toBe(getReferralProgram('chime')?.referralUrl)
    const withAmount = listSignupBonuses().filter((b) => b.amount)
    expect(withAmount.map((b) => b.slug)).toEqual(['chime', 'user-interviews'])
    expect(getSignupBonus('visible')).toBeNull()
    expect(getSignupBonus('amex-hilton-honors')).toBeNull()
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

  it('builds search titles, descriptions and FAQs from the bonus record only', () => {
    const chime = requireSignupBonus('chime')
    const rakuten = requireSignupBonus('rakuten')
    expect(storeSeoTitle(chime)).toBe('Chime referral bonus: $100 for new members')
    expect(storeSeoTitle(rakuten)).toBe('Rakuten referral program: terms explained')
    expect(storeSeoTitle({ ...rakuten, provider: 'Hilton Honors American Express Card' })).toBe(
      'Hilton Honors American Express Card referral and terms'
    )
    expect(storeSeoDescription(chime)).toMatch(/^\$100 for new Chime members\. After a qualifying/)
    expect(storeSeoDescription(rakuten)).toMatch(/^New-member bonus set by Rakuten\. /)
    for (const b of listSignupBonuses()) {
      expect(storeSeoTitle(b).length + ' | BonusBridge'.length).toBeLessThanOrEqual(60)
      expect(storeSeoDescription(b).length).toBeLessThanOrEqual(170)
    }
    const chimeFaq = storeFaqs(chime)
    expect(chimeFaq).toHaveLength(3)
    expect(chimeFaq[0]?.answer).toContain('$100')
    expect(storeFaqs(rakuten)[0]?.answer).toContain('do not state a fixed amount')
    expect(chimeFaq[2]?.answer).toContain(chime.sourceUrl)
    const interviews = requireSignupBonus('user-interviews')
    expect(interviews.amount).toBe('$10')
    expect(interviews.ctaLabel).toBe('Join User Interviews')
    expect(interviews.referralUrl).toBe('https://www.userinterviews.com/r/kdqtpxzqk')
    expect(storeSeoTitle(interviews)).toBe('User Interviews: $10 referral bonus')
    expect(storeSeoDescription(interviews)).toContain('Both get $10')
    expect(storeSeoDescription(interviews).startsWith('$30')).toBe(false)
    expect(storeSeoTitle({ ...interviews, provider: 'A Very Long Provider Name That Will Not Fit', amount: '$10' })).toBe(
      '$10 referral bonus'
    )
    const respondent = requireSignupBonus('respondent')
    expect(respondent.amount).toBeNull()
    expect(respondent.checkedAt).toBe('2026-11-24')
    expect(respondent.ctaLabel).toBe('Join Respondent')
    expect(respondent.referralUrl).toBe('https://app.respondent.io/r/vadimpopov-df8f1e320c02')
    expect(respondent.sourceUrl).toContain('help.respondent.io')
    expect(storeSeoTitle(respondent)).toBe('Respondent referral program: terms explained')
    expect(storeSeoDescription(respondent)).toContain('No fixed signup bonus')
    expect(storeSeoDescription(respondent).startsWith('$')).toBe(false)
    expect(storeSeoDescription(respondent).length).toBeLessThanOrEqual(155)
    expect(storeFaqs(respondent)[0]?.answer).toContain('do not state a fixed amount')
  })
})
