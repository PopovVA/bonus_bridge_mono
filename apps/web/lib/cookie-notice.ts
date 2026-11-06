export const COOKIE_NOTICE_STORAGE_KEY = 'bb-cookie-notice'

export function isCookieNoticeDismissed(storage: Pick<Storage, 'getItem'>): boolean {
  try {
    return storage.getItem(COOKIE_NOTICE_STORAGE_KEY) === 'dismissed'
  } catch {
    return false
  }
}

export function dismissCookieNotice(storage: Pick<Storage, 'setItem'>): void {
  try {
    storage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'dismissed')
  } catch {
    /* Private mode can reject storage writes. The banner still closes in memory. */
  }
}
