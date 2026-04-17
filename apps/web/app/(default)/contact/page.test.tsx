import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ContactPage from './page'

describe('contact page', () => {
  it('renders contact copy and mailto', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(<ContactPage />)
    expect(html).toContain('Contact')
    expect(html).toContain('support@bonusbridge.io')
    expect(html).toContain('independent informational website')
  })
})
