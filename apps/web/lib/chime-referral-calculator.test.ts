import { describe, expect, it } from 'vitest'
import {
  CHIME_CALC_FRIENDS_MAX,
  CHIME_CALC_WEEKS_MAX,
  CHIME_CALC_WEEKS_MIN,
  CHIME_DIRECT_DEPOSIT_BONUS_USD,
  CHIME_FRIEND_BONUS_USD,
  CHIME_REFERRER_PER_FRIEND_USD,
  computeChimeReferralTotals,
  parseChimeFriendsField,
  parseChimeWeeksField
} from './chime-referral-calculator'

describe('computeChimeReferralTotals', () => {
  it('returns zeros for no friends and no DD bonus', () => {
    expect(computeChimeReferralTotals({ friends: 0, includeDirectDepositBonus: false })).toEqual({
      friends: 0,
      referrerFromFriendsUsd: 0,
      directDepositBonusUsd: 0,
      yourTotalUsd: 0,
      friendsReceiveTotalUsd: 0
    })
  })

  it('adds direct deposit bonus once when enabled', () => {
    const t = computeChimeReferralTotals({ friends: 0, includeDirectDepositBonus: true })
    expect(t.directDepositBonusUsd).toBe(CHIME_DIRECT_DEPOSIT_BONUS_USD)
    expect(t.yourTotalUsd).toBe(CHIME_DIRECT_DEPOSIT_BONUS_USD)
  })

  it('computes two friends example toward ~1000 headline (600 referral + 400 DD)', () => {
    const t = computeChimeReferralTotals({ friends: 2, includeDirectDepositBonus: true })
    expect(t.referrerFromFriendsUsd).toBe(2 * CHIME_REFERRER_PER_FRIEND_USD)
    expect(t.yourTotalUsd).toBe(600 + CHIME_DIRECT_DEPOSIT_BONUS_USD)
    expect(t.friendsReceiveTotalUsd).toBe(2 * CHIME_FRIEND_BONUS_USD)
  })

  it('clamps friends to 0..50', () => {
    const low = computeChimeReferralTotals({ friends: -3, includeDirectDepositBonus: false })
    expect(low.friends).toBe(0)
    const high = computeChimeReferralTotals({ friends: 999, includeDirectDepositBonus: false })
    expect(high.friends).toBe(50)
  })

  it('treats non-finite friend counts as zero', () => {
    expect(computeChimeReferralTotals({ friends: Number.NaN, includeDirectDepositBonus: false }).friends).toBe(0)
  })
})

describe('parseChimeFriendsField', () => {
  it('parses integers and clamps', () => {
    expect(parseChimeFriendsField('  3  ')).toBe(3)
    expect(parseChimeFriendsField('')).toBe(2)
    expect(parseChimeFriendsField('  ')).toBe(2)
    expect(parseChimeFriendsField('not')).toBe(0)
    expect(parseChimeFriendsField(String(CHIME_CALC_FRIENDS_MAX + 9))).toBe(CHIME_CALC_FRIENDS_MAX)
    expect(parseChimeFriendsField('02')).toBe(2)
    expect(parseChimeFriendsField('008')).toBe(8)
  })
})

describe('parseChimeWeeksField', () => {
  it('parses integers and clamps', () => {
    expect(parseChimeWeeksField('8')).toBe(8)
    expect(parseChimeWeeksField('')).toBe(CHIME_CALC_WEEKS_MIN)
    expect(parseChimeWeeksField('x')).toBe(CHIME_CALC_WEEKS_MIN)
    expect(parseChimeWeeksField('0')).toBe(CHIME_CALC_WEEKS_MIN)
    expect(parseChimeWeeksField(String(CHIME_CALC_WEEKS_MAX + 3))).toBe(CHIME_CALC_WEEKS_MAX)
    expect(parseChimeWeeksField('06')).toBe(6)
  })
})
