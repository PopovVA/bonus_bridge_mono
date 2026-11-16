import { afterEach, describe, expect, it, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { PromoBoard, PromoCard } from './promo-board'
import type { PromoCardModel } from '@/lib/promo-entries'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children?: React.ReactNode
    href: string
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}))

function card(overrides: Partial<PromoCardModel> = {}): PromoCardModel {
  return {
    id: 'card',
    store: 'Example Store',
    storeSlug: 'example-store',
    storeHref: null,
    title: 'Sample offer',
    code: 'SAVE',
    description: 'A checked offer.',
    terms: 'See the official page.',
    url: 'https://example.com/terms',
    startsAt: null,
    expiresAt: '2099-01-01T00:00:00Z',
    source: 'brand newsletter',
    checkedAt: '2026-03-02',
    category: null,
    ...overrides
  }
}

const directoryItems: PromoCardModel[] = [
  card({
    id: 'soon',
    store: 'Rakuten',
    storeSlug: 'rakuten',
    storeHref: '/stores/rakuten',
    title: 'Soon deal',
    code: 'SOON',
    expiresAt: '2026-11-20T23:59:00Z',
    category: 'shopping'
  }),
  card({
    id: 'open',
    store: 'Example Store',
    title: 'Open deal',
    code: null,
    expiresAt: null
  }),
  card({
    id: 'future',
    title: 'Future deal',
    code: 'LATER',
    startsAt: '2026-12-01T00:00:00Z',
    expiresAt: '2026-12-31T00:00:00Z'
  }),
  card({
    id: 'gone',
    title: 'Gone deal',
    code: 'GONE',
    expiresAt: '2026-01-02T00:00:00Z'
  })
]

describe('PromoBoard', () => {
  let root: Root | null = null
  let host: HTMLDivElement | null = null

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount()
      })
    }
    host?.remove()
    root = null
    host = null
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  function mount(node: React.ReactNode) {
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    act(() => {
      root?.render(node)
    })
    return host
  }

  it('renders an empty directory as nothing', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<PromoBoard items={[]} nowIso="2026-11-16T18:00:00.000Z" mode="directory" />)).toBe('')
  })

  it('lists active offers first and grays out expired ones in the server markup', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <PromoBoard items={directoryItems} nowIso="2026-11-16T18:00:00.000Z" mode="directory" />
    )
    expect(html.indexOf('Soon deal')).toBeLessThan(html.indexOf('Open deal'))
    expect(html.indexOf('id="promo-group-active"')).toBeLessThan(html.indexOf('id="promo-group-upcoming"'))
    expect(html.indexOf('id="promo-group-upcoming"')).toBeLessThan(html.indexOf('id="promo-group-expired"'))
    expect(html).toContain('href="/stores/rakuten"')
    expect(html).toContain('shopping')
    expect(html).toContain('No code required')
    expect(html).toContain('No set end date')
    expect(html).toContain('Starts Dec 1, 2026, 12:00 AM UTC')
    expect(html).toContain('Copy code')
    expect(html).toContain('promo-card--expired')
    expect(html).toContain('Expired Jan 2, 2026')
    expect(html).toContain('https://example.com/terms')
    const expiredStart = html.indexOf('promo-card--expired')
    expect(html.slice(expiredStart)).not.toContain('Copy code')
    expect(html.slice(expiredStart)).not.toContain('Official offer page')

    const activeOnly = renderToStaticMarkup(
      <PromoBoard
        items={[card({ id: 'only', title: 'Only active', expiresAt: '2099-01-01T00:00:00Z' })]}
        nowIso="2026-11-16T18:00:00.000Z"
        mode="directory"
      />
    )
    expect(activeOnly).toContain('Only active')
    expect(activeOnly).not.toContain('Starts later')
    expect(activeOnly).not.toContain('promo-group-expired')
  })

  it('shows active store promos and hides a store section that has none', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <PromoBoard
        items={[card({ title: 'Store deal', code: 'SHOP' })]}
        nowIso="2026-11-16T18:00:00.000Z"
        mode="store"
      />
    )
    expect(html).toContain('Promo codes')
    expect(html).toContain('SHOP')
    expect(html).toContain('href="/promos"')
    expect(
      renderToStaticMarkup(
        <PromoBoard
          items={[card({ expiresAt: '2000-01-01T00:00:00Z' })]}
          nowIso="2026-11-16T18:00:00.000Z"
          mode="store"
        />
      )
    ).toBe('')
  })

  it('grays out a cached active offer after it expires, including on a timer', () => {
    ;(globalThis as { React?: typeof React }).React = React
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-01T00:00:00.000Z'))
    const el = mount(
      <PromoBoard
        items={[card({ id: 'clock', title: 'Clock deal', code: 'CLOCK', expiresAt: '2026-11-15T00:00:00Z' })]}
        nowIso="2026-11-01T00:00:00.000Z"
        mode="directory"
      />
    )
    expect(el.innerHTML).toContain('Copy code')
    expect(el.innerHTML).not.toContain('promo-card--expired')
    act(() => {
      vi.setSystemTime(new Date('2026-12-01T00:00:00.000Z'))
      vi.advanceTimersByTime(60_000)
    })
    expect(el.innerHTML).toContain('promo-card--expired')
    expect(el.innerHTML).toContain('Expired Nov 15, 2026')
    expect(el.innerHTML).not.toContain('Copy code')
    const clear = vi.spyOn(window, 'clearInterval')
    act(() => {
      root?.unmount()
    })
    root = null
    expect(clear).toHaveBeenCalled()
  })

  it('drops a store promo once the browser clock passes expiresAt and reveals one that has started', () => {
    ;(globalThis as { React?: typeof React }).React = React
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-01T00:00:00.000Z'))
    const ending = mount(
      <PromoBoard
        items={[card({ code: 'END', expiresAt: '2026-11-15T00:00:00Z' })]}
        nowIso="2026-11-01T00:00:00.000Z"
        mode="store"
      />
    )
    expect(ending.textContent).toContain('END')
    act(() => {
      vi.setSystemTime(new Date('2026-12-01T00:00:00.000Z'))
      vi.advanceTimersByTime(60_000)
    })
    expect(ending.textContent).not.toContain('END')

    act(() => {
      root?.unmount()
    })
    root = null
    host?.remove()
    vi.setSystemTime(new Date('2026-11-01T00:00:00.000Z'))
    const starting = mount(
      <PromoBoard
        items={[
          card({
            code: 'BEGIN',
            startsAt: '2026-11-20T00:00:00Z',
            expiresAt: '2026-12-20T00:00:00Z'
          })
        ]}
        nowIso="2026-11-01T00:00:00.000Z"
        mode="store"
      />
    )
    expect(starting.textContent).not.toContain('BEGIN')
    act(() => {
      vi.setSystemTime(new Date('2026-11-21T00:00:00.000Z'))
      vi.advanceTimersByTime(60_000)
    })
    expect(starting.textContent).toContain('BEGIN')
  })

  it('copies a code and reports a clipboard failure', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    const writeText = vi.fn().mockResolvedValue(undefined)
    const gtag = vi.fn()
    Object.defineProperty(window, 'gtag', { configurable: true, value: gtag })
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    const el = mount(
      <PromoBoard
        items={[card({ id: 'copy-me', code: 'COPYME', expiresAt: '2099-01-01T00:00:00Z' })]}
        nowIso="2026-11-16T18:00:00.000Z"
        mode="directory"
      />
    )
    const button = () => el.querySelector('button') as HTMLButtonElement
    await act(async () => {
      button().click()
    })
    expect(button().textContent).toBe('Could not copy')
    expect(gtag).not.toHaveBeenCalled()

    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    await act(async () => {
      button().click()
    })
    expect(writeText).toHaveBeenCalledWith('COPYME')
    expect(button().textContent).toBe('Copied')
    expect(gtag).toHaveBeenCalledWith('event', 'promo_copy', {
      promo_id: 'copy-me',
      store_slug: 'example-store',
      page_path: '/',
      place: 'promos_page',
      promo_status: 'active'
    })

    const official = el.querySelector('.promo-card__official') as HTMLAnchorElement
    await act(async () => {
      official.click()
    })
    expect(gtag).toHaveBeenCalledWith('event', 'promo_click', {
      promo_id: 'copy-me',
      store_slug: 'example-store',
      page_path: '/',
      place: 'promos_page',
      promo_status: 'active'
    })

    writeText.mockRejectedValueOnce(new Error('denied'))
    await act(async () => {
      button().click()
    })
    expect(button().textContent).toBe('Could not copy')
    expect(gtag.mock.calls.filter((call) => call[1] === 'promo_copy')).toHaveLength(1)
  })

  it('renders defensive labels when a status has no timestamp', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const expired = renderToStaticMarkup(
      <PromoCard
        item={card({ expiresAt: null, code: null, category: null, storeHref: null })}
        status="expired"
        copied={false}
        failed={true}
        place="promos_page"
        onCopy={() => undefined}
      />
    )
    expect(expired).toContain('Expired Invalid date')
    expect(expired).not.toContain('Could not copy')
    const upcoming = renderToStaticMarkup(
      <PromoCard
        item={card({ startsAt: null, expiresAt: null })}
        status="upcoming"
        copied={true}
        failed={false}
        place="promos_page"
        onCopy={() => undefined}
      />
    )
    expect(upcoming).toContain('Starts Invalid date')
    expect(upcoming).toContain('Official offer page')
    const labeled = renderToStaticMarkup(
      <PromoCard
        item={card({ code: 'SAVE' })}
        status="active"
        copied={true}
        failed={false}
        place="store_page"
        onCopy={() => undefined}
      />
    )
    expect(labeled).toContain('Copied')
  })
})
