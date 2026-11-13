export const COOKIE_CONSENT_STORAGE_KEY = 'bb-cookie-consent'
export const COOKIE_CONSENT_EVENT = 'bb-cookie-consent'

export type CookieConsent = 'accepted' | 'declined'

export function readCookieConsent(storage: Pick<Storage, 'getItem'>): CookieConsent | null {
  try {
    const value = storage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (value === 'accepted' || value === 'declined') return value
    return null
  } catch {
    return null
  }
}

export function writeCookieConsent(storage: Pick<Storage, 'setItem'>, value: CookieConsent): void {
  try {
    storage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
  } catch {
    /* Private mode can reject storage writes. The banner still closes in memory. */
  }
}
