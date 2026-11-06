import { afterEach, describe, expect, it } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { COOKIE_NOTICE_STORAGE_KEY } from '@/lib/cookie-notice'
import { CookieNotice } from './cookie-notice'

describe('CookieNotice', () => {
  let root: Root | null = null
  let host: HTMLDivElement | null = null

  afterEach(() => {
    act(() => {
      root?.unmount()
    })
    host?.remove()
    root = null
    host = null
    window.localStorage.clear()
  })

  it('renders nothing on the server before the effect runs', () => {
    ;(globalThis as { React?: typeof React }).React = React
    expect(renderToStaticMarkup(<CookieNotice />)).toBe('')
  })

  it('shows the notice until it is dismissed', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    expect(host.textContent).toContain('Cookie Notice')
    const button = host.querySelector('button')
    expect(button).not.toBeNull()
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY)).toBe('dismissed')
    expect(host.textContent).not.toContain('Cookie Notice')
  })

  it('stays hidden when the notice was already dismissed', async () => {
    window.localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'dismissed')
    ;(globalThis as { React?: typeof React }).React = React
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    expect(host.textContent).not.toContain('Cookie Notice')
  })
})
