import { afterEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
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
    vi.unstubAllEnvs()
  })

  it('renders nothing when NODE_ENV is development', async () => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'development')
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<GoogleAnalytics />)
    expect(html).toBe('')
  })

  it('renders gtag scripts when NODE_ENV is production', async () => {
    vi.resetModules()
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TESTID99')
    const { GoogleAnalytics } = await import('./google-analytics')
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<GoogleAnalytics />)
    expect(html).toContain('googletagmanager.com/gtag/js?id=G-TESTID99')
    expect(html).toContain('id="google-analytics"')
    expect(html).toContain("gtag('config', 'G-TESTID99')")
  })
})
