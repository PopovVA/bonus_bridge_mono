import { describe, expect, it } from 'vitest'
import { COOKIE_NOTICE_STORAGE_KEY, dismissCookieNotice, isCookieNoticeDismissed } from './cookie-notice'

describe('cookie notice storage', () => {
  it('reads a dismissed flag and treats other values as still visible', () => {
    expect(isCookieNoticeDismissed({ getItem: () => 'dismissed' })).toBe(true)
    expect(isCookieNoticeDismissed({ getItem: () => null })).toBe(false)
    expect(isCookieNoticeDismissed({ getItem: () => 'later' })).toBe(false)
  })

  it('returns false when storage throws', () => {
    expect(
      isCookieNoticeDismissed({
        getItem: () => {
          throw new Error('blocked')
        }
      })
    ).toBe(false)
  })

  it('writes the dismissed flag and ignores storage failures', () => {
    let saved = ''
    dismissCookieNotice({
      setItem: (key, value) => {
        saved = `${key}:${value}`
      }
    })
    expect(saved).toBe(`${COOKIE_NOTICE_STORAGE_KEY}:dismissed`)
    expect(() =>
      dismissCookieNotice({
        setItem: () => {
          throw new Error('private')
        }
      })
    ).not.toThrow()
  })
})
