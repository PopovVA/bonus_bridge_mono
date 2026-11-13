import { afterEach, describe, expect, it } from 'vitest'
import React from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_STORAGE_KEY } from '@/lib/cookie-notice'
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

  it('asks for a choice and stores acceptance', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    const heard = viCookieEvent()
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    expect(host.textContent).toContain('Cookie Notice')
    expect(host.textContent).toContain('Accept')
    const accept = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Accept')
    await act(async () => {
      accept?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe('accepted')
    expect(heard()).toBe(true)
    expect(host.textContent).not.toContain('Accept')
  })

  it('stores a decline', async () => {
    ;(globalThis as { React?: typeof React }).React = React
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    const decline = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Decline')
    await act(async () => {
      decline?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe('declined')
    expect(host.textContent).not.toContain('Decline')
  })

  it('stays hidden when a choice was already saved', async () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'declined')
    ;(globalThis as { React?: typeof React }).React = React
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    expect(host.textContent).not.toContain('Cookie Notice')
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted')
    await act(async () => {
      root?.render(<CookieNotice />)
    })
    expect(host.textContent).not.toContain('Accept')
  })
})

function viCookieEvent() {
  let heard = false
  window.addEventListener(COOKIE_CONSENT_EVENT, () => {
    heard = true
  })
  return () => heard
}
