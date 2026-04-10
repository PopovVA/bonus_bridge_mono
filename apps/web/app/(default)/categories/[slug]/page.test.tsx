import { describe, expect, it, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/lib/site-data', () => ({
  getCategories: vi.fn(),
  getServices: vi.fn(),
  getOffers: vi.fn()
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    const e = new Error('NEXT_NOT_FOUND')
    ;(e as { digest?: string }).digest = 'NEXT_NOT_FOUND'
    throw e
  })
}))

import CategoryPage, { generateMetadata, generateStaticParams } from './page'
import { getCategories, getOffers, getServices } from '@/lib/site-data'

(globalThis as { React?: typeof React }).React = React

describe('category [slug] page', () => {
  beforeEach(() => {
    vi.mocked(getServices).mockResolvedValue([])
    vi.mocked(getOffers).mockResolvedValue([])
  })

  it('generateStaticParams maps categories', async () => {
    vi.mocked(getCategories).mockResolvedValue([{ id: '1', slug: 'alpha', name: 'Alpha' } as never])
    await expect(generateStaticParams()).resolves.toEqual([{ slug: 'alpha' }])
  })

  it('generateStaticParams returns empty when getCategories fails', async () => {
    vi.mocked(getCategories).mockRejectedValue(new Error('down'))
    await expect(generateStaticParams()).resolves.toEqual([])
  })

  it('generateMetadata uses fallback when category is missing', async () => {
    vi.mocked(getCategories).mockResolvedValue([])
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })).resolves.toMatchObject({
      title: 'Category'
    })
  })

  it('generateMetadata includes category name when found', async () => {
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'c1', slug: 'electronics', name: 'Electronics' } as never
    ])
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'electronics' }) })).resolves.toMatchObject({
      title: 'Electronics stores'
    })
  })

  it('calls notFound when slug does not match a category', async () => {
    vi.mocked(getCategories).mockResolvedValue([])
    await expect(CategoryPage({ params: Promise.resolve({ slug: 'unknown' }) })).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('renders empty state when no stores', async () => {
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'c1', slug: 'travel', name: 'Travel' } as never
    ])
    const html = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'travel' }) }))
    expect(html).toContain('No stores in this category yet.')
  })

  it('uses empty data when getServices and getOffers fail', async () => {
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'c1', slug: 'travel', name: 'Travel' } as never
    ])
    vi.mocked(getServices).mockRejectedValue(new Error('down'))
    vi.mocked(getOffers).mockRejectedValue(new Error('down'))
    const html = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'travel' }) }))
    expect(html).toContain('No stores in this category yet.')
  })

  it('renders counts and View store only (no per-offer rows)', async () => {
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'c1', slug: 'electronics', name: 'Electronics' } as never
    ])
    vi.mocked(getServices).mockResolvedValue([
      {
        id: 's1',
        name: 'Empty Offers',
        slug: 'empty-offers',
        description: null,
        categoryId: 'c1'
      } as never,
      {
        id: 's2',
        name: 'Link Only',
        slug: 'link-only',
        description: 'Has link offer',
        categoryId: 'c1'
      } as never
    ])
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's2',
        title: 'No code deal',
        previewText: 'Use the link',
        couponCode: null,
        referralUrl: 'https://example.com/promo',
        status: 'active'
      } as never
    ])
    const html = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ slug: 'electronics' }) }))
    expect(html).toContain('No active promo codes or offers.')
    expect(html).toContain('1 offer')
    expect(html).toContain('View store')
    expect(html).toContain('/stores/empty-offers')
    expect(html).toContain('/stores/link-only')
    expect(html).toContain('Has link offer')
    expect(html).toContain('This store is on BonusBridge')
    expect(html).toContain('category-store-desc')
    expect(html).not.toContain('No code deal')
    expect(html).not.toContain('/coupons/')
  })
})
