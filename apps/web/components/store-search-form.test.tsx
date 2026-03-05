import React from 'react'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { StoreSearchForm } from './store-search-form'

describe('StoreSearchForm', () => {
  it('renders form with default values', () => {
    const html = renderToStaticMarkup(<StoreSearchForm />)
    expect(html).toContain('action="/stores"')
    expect(html).toContain('method="get"')
    expect(html).toContain('name="q"')
    expect(html).toContain('Search stores')
    expect(html).not.toContain('name="category"')
  })

  it('renders hidden category input when category is provided', () => {
    const html = renderToStaticMarkup(<StoreSearchForm category="electronics" defaultValue="test" />)
    expect(html).toContain('name="category"')
    expect(html).toContain('value="electronics"')
    expect(html).toContain('value="test"')
  })
})
