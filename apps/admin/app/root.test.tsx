import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('next/navigation', () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`redirect:${to}`)
  })
}))

import RootLayout from './layout'
import RootPage from './page'

(globalThis as { React?: typeof React }).React = React

describe('admin root app routes', () => {
  it('renders root layout with children', () => {
    const html = renderToStaticMarkup(
      RootLayout({
        children: <main>admin</main>
      })
    )
    expect(html).toContain('admin')
  })

  it('redirects root page to /admin', () => {
    expect(() => RootPage()).toThrow('redirect:/admin')
  })
})
