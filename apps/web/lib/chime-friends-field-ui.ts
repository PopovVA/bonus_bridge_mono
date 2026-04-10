import { parseChimeFriendsField } from '@/lib/chime-referral-calculator'

/** Strip non-digits, cap length, normalize through parse rules. Empty means user cleared the field. */
export function sanitizeFriendsDigitsInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 2)
  if (digits === '') return ''
  return String(parseChimeFriendsField(digits))
}

/** After blur, restore default friend count when the field was left empty. */
export function friendsInputValueAfterBlur(current: string): string {
  if (current.trim() === '') return '2'
  return current
}
