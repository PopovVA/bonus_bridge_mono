import { afterEach, describe, expect, it, vi } from 'vitest'
import { isAnalyticsEnabledForHostname, trackGtagEvent } from './gtag-track'

describe('isAnalyticsEnabledForHostname', () => {
  it('disables localhost hosts', () => {
    expect(isAnalyticsEnabledForHostname('localhost')).toBe(false)
    expect(isAnalyticsEnabledForHostname('127.0.0.1')).toBe(false)
    expect(isAnalyticsEnabledForHostname('::1')).toBe(false)
  })

  it('enables non-local hosts', () => {
    expect(isAnalyticsEnabledForHostname('bonusbridge.io')).toBe(true)
  })
})

describe('trackGtagEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not call gtag on localhost and logs skip reason', () => {
    const gtag = vi.fn()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'localhost' }, gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('test_event', { a: 1 })
    expect(gtag).not.toHaveBeenCalled()
    expect(info).toHaveBeenCalledWith(expect.stringContaining('not sent because analytics is disabled'))
  })

  it('calls gtag and logs sent status on non-local host', () => {
    const gtag = vi.fn()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'bonusbridge.io' }, gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { place: 'home', item_id: 'x' })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', { place: 'home', item_id: 'x' })
    expect(info).toHaveBeenCalledWith('[Analytics] Event "btn_test" sent.', { place: 'home', item_id: 'x' })
  })

  it('omits undefined param values', () => {
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'bonusbridge.io' }, gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { a: '1', b: undefined })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', { a: '1' })
  })

  it('passes empty object when params only contain undefined', () => {
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'bonusbridge.io' }, gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { b: undefined })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', {})
  })

  it('logs not available when gtag is not a function', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'bonusbridge.io' }, gtag: undefined } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('x')
    expect(info).toHaveBeenCalledWith('[Analytics] Event "x" not sent because gtag is not available yet.')
  })

  it('treats missing location as localhost and skips send', () => {
    const gtag = vi.fn()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('no_location')
    expect(gtag).not.toHaveBeenCalled()
    expect(info).toHaveBeenCalledWith(expect.stringContaining('not sent because analytics is disabled'))
  })

  it('returns early when window is undefined (SSR)', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    const prev = globalThis.window
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
      writable: true
    })
    trackGtagEvent('ssr_should_skip')
    expect(gtag).not.toHaveBeenCalled()
    Object.defineProperty(globalThis, 'window', {
      value: prev,
      configurable: true,
      writable: true
    })
  })
})
