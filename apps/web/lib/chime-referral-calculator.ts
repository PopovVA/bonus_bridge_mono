/** Amounts aligned with Chime invite-friends promo copy (see official terms). */
export const CHIME_REFERRER_PER_FRIEND_USD = 300
export const CHIME_FRIEND_BONUS_USD = 100
export const CHIME_DIRECT_DEPOSIT_BONUS_USD = 400

export const CHIME_CALC_FRIENDS_MAX = 50
export const CHIME_CALC_WEEKS_MIN = 1
export const CHIME_CALC_WEEKS_MAX = 104

/**
 * Parses the friends count field — whole integers only (parseInt normalizes "02" → 2).
 * Empty input maps to 2 (calculator default).
 */
export function parseChimeFriendsField(raw: string): number {
  const t = raw.trim()
  if (t === '') return 2
  const n = parseInt(t, 10)
  if (Number.isNaN(n)) return 0
  return Math.min(CHIME_CALC_FRIENDS_MAX, Math.max(0, n))
}

/**
 * Parses the weeks (timeline) field — whole integers only (parseInt normalizes "06" → 6).
 */
export function parseChimeWeeksField(raw: string): number {
  const t = raw.trim()
  if (t === '') return CHIME_CALC_WEEKS_MIN
  const n = parseInt(t, 10)
  if (Number.isNaN(n)) return CHIME_CALC_WEEKS_MIN
  return Math.min(CHIME_CALC_WEEKS_MAX, Math.max(CHIME_CALC_WEEKS_MIN, n))
}

export type ChimeReferralTotalsInput = {
  friends: number
  includeDirectDepositBonus: boolean
}

export type ChimeReferralTotals = {
  friends: number
  referrerFromFriendsUsd: number
  directDepositBonusUsd: number
  yourTotalUsd: number
  friendsReceiveTotalUsd: number
}

/**
 * Estimates referral math for modeling only — not a guarantee of eligibility or payout timing.
 */
export function computeChimeReferralTotals(input: ChimeReferralTotalsInput): ChimeReferralTotals {
  const friends = clampInt(input.friends, 0, 50)
  const referrerFromFriendsUsd = friends * CHIME_REFERRER_PER_FRIEND_USD
  const directDepositBonusUsd = input.includeDirectDepositBonus ? CHIME_DIRECT_DEPOSIT_BONUS_USD : 0
  const yourTotalUsd = referrerFromFriendsUsd + directDepositBonusUsd
  const friendsReceiveTotalUsd = friends * CHIME_FRIEND_BONUS_USD
  return {
    friends,
    referrerFromFriendsUsd,
    directDepositBonusUsd,
    yourTotalUsd,
    friendsReceiveTotalUsd
  }
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.floor(n)))
}
