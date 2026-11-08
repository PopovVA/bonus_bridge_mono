import React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BridgeArt } from '@/components/bridge-art'
import { HomeHero } from '@/components/home-hero'
import { HowItWorks } from '@/components/how-it-works'
import { MobileCtaBar } from '@/components/mobile-cta-bar'
import { SplitWords } from '@/components/split-words'
import { ThemeToggle } from '@/components/theme-toggle'
import { THEME_STORAGE_KEY } from '@/lib/theme'

;(globalThis as { React?: typeof React; IS_REACT_ACT_ENVIRONMENT?: boolean }).React = React
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLDivElement
let root: Root

function mount(node: React.ReactNode) {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root.render(node))
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  document.documentElement.removeAttribute('data-theme')
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('SplitWords', () => {
  it('wraps each word and keeps one stagger across runs', () => {
    const html = renderToStaticMarkup(<SplitWords text="and provider terms" start={2} />)
    expect(html.match(/split-word__inner/g)).toHaveLength(3)
    expect(html).toContain('--i:2')
    expect(html).toContain('--i:4')
  })
})

describe('HomeHero', () => {
  it('shows the real heading text and published counts', () => {
    const html = renderToStaticMarkup(<HomeHero stats={{ guides: 5, stores: 7, categories: 6 }} />)
    expect(html).toContain('<span class="sr-only">Referral guides and provider terms</span>')
    expect(html).toContain('data-count="7"')
    expect(html).toContain('href="/articles"')
    expect(html).toContain('provider terms')
    expect(html).toContain('class="bridge"')
  })
})

describe('BridgeArt', () => {
  it('is decorative and draws cables and hangers', () => {
    const html = renderToStaticMarkup(<BridgeArt />)
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('bridge__cable')
    expect(html.match(/bridge__hanger/g)?.length).toBeGreaterThan(10)
  })
})

describe('HowItWorks', () => {
  it('lists three steps and the operator notice', () => {
    const html = renderToStaticMarkup(<HowItWorks />)
    expect(html.match(/class="how-step"/g)).toHaveLength(3)
    expect(html).toContain('Apis Systems LLC')
  })
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia
  })

  it('switches theme instantly when View Transitions are unavailable', () => {
    document.documentElement.dataset.theme = 'light'
    mount(<ThemeToggle />)
    act(() => host.querySelector('button')!.click())
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('defaults to light when no theme is set yet', () => {
    mount(<ThemeToggle />)
    act(() => host.querySelector('button')!.click())
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('grows the new theme from the button via a view transition', () => {
    const start = vi.fn((update: () => void) => update())
    ;(document as Document & { startViewTransition?: unknown }).startViewTransition = start
    document.documentElement.dataset.theme = 'dark'
    mount(<ThemeToggle />)
    act(() => host.querySelector('button')!.click())
    expect(start).toHaveBeenCalledOnce()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.getPropertyValue('--vt-r')).toMatch(/px$/)
    delete (document as Document & { startViewTransition?: unknown }).startViewTransition
  })

  it('still switches when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    document.documentElement.dataset.theme = 'light'
    mount(<ThemeToggle />)
    act(() => host.querySelector('button')!.click())
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('MobileCtaBar', () => {
  it('stays hidden at the top and appears after the first screen', () => {
    mount(<MobileCtaBar />)
    const nav = host.querySelector('nav')!
    expect(nav.className).not.toContain('mobile-cta--shown')
    Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true })
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(nav.className).toContain('mobile-cta--shown')
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  it('hides while the footer is on screen', () => {
    let notify: (entries: { isIntersecting: boolean }[]) => void = () => {}
    const observe = vi.fn()
    const disconnect = vi.fn()
    class FakeObserver {
      constructor(cb: typeof notify) {
        notify = cb
      }
      observe = observe
      disconnect = disconnect
    }
    ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeObserver
    const footer = document.createElement('footer')
    footer.className = 'home-footer'
    document.body.appendChild(footer)
    Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true })

    mount(<MobileCtaBar />)
    const nav = host.querySelector('nav')!
    expect(observe).toHaveBeenCalledWith(footer)
    expect(nav.className).toContain('mobile-cta--shown')
    act(() => notify([{ isIntersecting: true }]))
    expect(nav.className).not.toContain('mobile-cta--shown')

    act(() => root.unmount())
    expect(disconnect).toHaveBeenCalled()
    footer.remove()
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })
})
