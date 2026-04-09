import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackGtagEvent } from './gtag-track'

describe('trackGtagEvent', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('does not call gtag when NODE_ENV is not production', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('test_event', { a: 1 })
    expect(gtag).not.toHaveBeenCalled()
  })

  it('calls gtag with event name and params in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { place: 'home', item_id: 'x' })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', { place: 'home', item_id: 'x' })
  })

  it('omits undefined param values', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { a: '1', b: undefined })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', { a: '1' })
  })

  it('passes empty object when params only contain undefined', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
    trackGtagEvent('btn_test', { b: undefined })
    expect(gtag).toHaveBeenCalledWith('event', 'btn_test', {})
  })

  it('no-ops when gtag is not a function', () => {
    vi.stubEnv('NODE_ENV', 'production')
    Object.defineProperty(globalThis, 'window', {
      value: { gtag: undefined } as unknown as Window,
      configurable: true,
      writable: true
    })
    expect(() => trackGtagEvent('x')).not.toThrow()
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
