import { describe, expect, it } from 'vitest'
import { friendsInputValueAfterBlur, sanitizeFriendsDigitsInput } from './chime-friends-field-ui'

describe('sanitizeFriendsDigitsInput', () => {
  it('allows empty while editing', () => {
    expect(sanitizeFriendsDigitsInput('')).toBe('')
    expect(sanitizeFriendsDigitsInput('abc')).toBe('')
  })

  it('keeps digits only and normalizes through parse rules', () => {
    expect(sanitizeFriendsDigitsInput('5')).toBe('5')
    expect(sanitizeFriendsDigitsInput('02')).toBe('2')
    expect(sanitizeFriendsDigitsInput('99')).toBe('50')
  })
})

describe('friendsInputValueAfterBlur', () => {
  it('restores default 2 when empty or whitespace', () => {
    expect(friendsInputValueAfterBlur('')).toBe('2')
    expect(friendsInputValueAfterBlur('   ')).toBe('2')
  })

  it('preserves non-empty values', () => {
    expect(friendsInputValueAfterBlur('7')).toBe('7')
    expect(friendsInputValueAfterBlur('0')).toBe('0')
  })
})
