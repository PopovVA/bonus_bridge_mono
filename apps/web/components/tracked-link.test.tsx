import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { TrackedLink, TrackedOutboundLink } from './tracked-link'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...rest
  }: {
    children?: React.ReactNode
    href: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  } & Record<string, unknown>) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}))

describe('TrackedLink', () => {
  beforeEach(() => {
    ;(globalThis as { React?: typeof React }).React = React
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('fires gtag and optional onClick on press', async () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    const userClick = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(
        <TrackedLink href="/x" event="test_internal" eventParams={{ n: 1 }} onClick={userClick}>
          Hi
        </TrackedLink>
      )
    })
    const a = el.querySelector('a')
    expect(a).toBeTruthy()
    await act(async () => {
      a!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(gtag).toHaveBeenCalledWith('event', 'test_internal', { n: 1 })
    expect(userClick).toHaveBeenCalled()
    root.unmount()
    el.remove()
  })
})

describe('TrackedOutboundLink', () => {
  beforeEach(() => {
    ;(globalThis as { React?: typeof React }).React = React
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('fires gtag on click', async () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(
        <TrackedOutboundLink href="https://ex.com" event="out_ev" target="_blank" rel="noreferrer">
          Go
        </TrackedOutboundLink>
      )
    })
    const a = el.querySelector('a')
    await act(async () => {
      a!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(gtag).toHaveBeenCalledWith('event', 'out_ev', {})
    root.unmount()
    el.remove()
  })

  it('fires bonus_cta for a partner and still runs the caller click', async () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    const userClick = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(
        <TrackedOutboundLink
          href="https://ex.com"
          event="bonus_cta"
          partnerSlug="rakuten"
          eventParams={{ place: 'guide_outbound' }}
          onClick={userClick}
        >
          Go
        </TrackedOutboundLink>
      )
    })
    const a = el.querySelector('a')
    await act(async () => {
      a!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(gtag).toHaveBeenCalledWith('event', 'bonus_cta', {
      place: 'guide_outbound',
      store_slug: 'rakuten',
      page_path: '/'
    })
    expect(userClick).toHaveBeenCalled()
    root.unmount()
    el.remove()
  })

  it('uses the event name as place when a partner click has no place', async () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    const el = document.createElement('div')
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(
        <TrackedOutboundLink href="https://ex.com" event="hero_main_cta" partnerSlug="chime">
          Go
        </TrackedOutboundLink>
      )
    })
    const a = el.querySelector('a')
    await act(async () => {
      a!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(gtag).toHaveBeenCalledWith('event', 'bonus_cta', {
      store_slug: 'chime',
      place: 'hero_main_cta',
      page_path: '/'
    })
    root.unmount()
    el.remove()
  })
})
