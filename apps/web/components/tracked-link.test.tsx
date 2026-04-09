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
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
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
    vi.stubEnv('NODE_ENV', 'production')
    const gtag = vi.fn()
    Object.defineProperty(globalThis, 'window', {
      value: { gtag } as unknown as Window,
      configurable: true,
      writable: true
    })
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
})
