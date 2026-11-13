import { describe, expect, it } from 'vitest'
import {
  COOKIE_CONSENT_STORAGE_KEY,
  readCookieConsent,
  writeCookieConsent
} from './cookie-notice'

describe('cookie consent storage', () => {
  it('reads accepted and declined, and treats other values as undecided', () => {
    expect(readCookieConsent({ getItem: () => 'accepted' })).toBe('accepted')
    expect(readCookieConsent({ getItem: () => 'declined' })).toBe('declined')
    expect(readCookieConsent({ getItem: () => null })).toBeNull()
    expect(readCookieConsent({ getItem: () => 'dismissed' })).toBeNull()
  })

  it('returns null when storage throws', () => {
    expect(
      readCookieConsent({
        getItem: () => {
          throw new Error('blocked')
        }
      })
    ).toBeNull()
  })

  it('writes the choice and ignores storage failures', () => {
    let saved = ''
    writeCookieConsent(
      {
        setItem: (key, value) => {
          saved = `${key}:${value}`
        }
      },
      'accepted'
    )
    expect(saved).toBe(`${COOKIE_CONSENT_STORAGE_KEY}:accepted`)
    expect(() =>
      writeCookieConsent(
        {
          setItem: () => {
            throw new Error('private')
          }
        },
        'declined'
      )
    ).not.toThrow()
  })
})
