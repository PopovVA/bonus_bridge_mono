import { afterEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/script', () => ({
  default: function ScriptMock({
    src,
    children,
    id
  }: {
    src?: string
    id?: string
    children?: string
  }) {
    if (src) {
      return <script async src={src} />
    }
    return <script id={id} dangerouslySetInnerHTML={{ __html: children ?? '' }} />
  }
}))

describe('GoogleAnalytics', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when window is unavailable', async () => {
    vi.resetModules()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
      writable: true
    })
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<GoogleAnalytics />)
    expect(html).toBe('')
    expect(info).not.toHaveBeenCalled()
  })

  it('returns early in effect when hostname is empty', async () => {
    vi.resetModules()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: '' } } as unknown as Window,
      configurable: true,
      writable: true
    })
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<GoogleAnalytics />)
    })
    expect(el.innerHTML).toBe('')
    expect(info).not.toHaveBeenCalled()
    root.unmount()
    el.remove()
  })

  it('renders nothing on localhost and logs disabled', async () => {
    vi.resetModules()
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'localhost' } } as unknown as Window,
      configurable: true,
      writable: true
    })
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<GoogleAnalytics />)
    })
    expect(el.innerHTML).toBe('')
    expect(info).toHaveBeenCalledWith('[Analytics] Disabled on host localhost.')
    root.unmount()
    el.remove()
  })

  it('renders gtag scripts on non-local host and logs enabled', async () => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TESTID99')
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(globalThis, 'window', {
      value: { location: { hostname: 'bonusbridge.io' } } as unknown as Window,
      configurable: true,
      writable: true
    })
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<GoogleAnalytics />)
    })
    expect(el.innerHTML).toContain('id="google-analytics"')
    expect(el.innerHTML).toContain("gtag('config', 'G-TESTID99')")
    expect(info).toHaveBeenCalledWith('[Analytics] Enabled on host bonusbridge.io. Measurement ID: G-TESTID99')
    root.unmount()
    el.remove()
  })
})
