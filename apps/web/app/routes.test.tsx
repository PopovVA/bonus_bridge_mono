import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/lib/site-data', () => ({
  getCategories: vi.fn(),
  getServices: vi.fn(),
  getOffers: vi.fn(),
  getOfferById: vi.fn(),
  getServiceBySlug: vi.fn(),
  getHeroSlides: vi.fn(),
  getTopMonthlyOffers: vi.fn(),
  getHomeClipCoupons: vi.fn(),
  getHomeCategoryMarquee: vi.fn(),
  getHotCashbackOffers: vi.fn(),
  getStoresMegaMenu: vi.fn()
}))

import HomePage from './(home)/page'
import HomeLayout from './(home)/layout'
import RootLayout from './layout'
import DefaultLayout from './(default)/layout'
import CouponDetailsPage, { generateMetadata } from './(default)/coupons/[id]/page'
import StorePage, { generateMetadata as generateStoreMetadata } from './(default)/stores/[slug]/page'
import CategoryPage, { generateMetadata as generateCategoryMetadata } from './(default)/categories/[slug]/page'
import { EmptyState } from '@/components/empty-state'
import {
  getCategories,
  getOfferById,
  getOffers,
  getHeroSlides,
  getHomeClipCoupons,
  getHomeCategoryMarquee,
  getHotCashbackOffers,
  getTopMonthlyOffers,
  getServiceBySlug,
  getServices,
  getStoresMegaMenu
} from '@/lib/site-data'

(globalThis as { React?: typeof React }).React = React

describe('web routes', () => {
  it('renders home with fetched aggregates', async () => {
    vi.mocked(getHeroSlides).mockResolvedValue([
      {
        kind: 'image',
        id: 'h1',
        imageUrl: 'https://example.com/hero.jpg',
        sortOrder: 0,
        createdAt: '',
        updatedAt: ''
      }
    ] as never)
    vi.mocked(getTopMonthlyOffers).mockResolvedValue([
      {
        id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01',
        brandName: 'Klarna',
        slug: 'klarna',
        description: 'Test klarna offer.',
        ctaText: 'Open',
        href: 'https://invite.klarna.com/test',
        logoSrc: '/top-offers/logos/klarna-logo.svg',
        imageSrc: '/top-offers/media/klarna-promo.png',
        badgeText: '20$ off'
      }
    ])
    vi.mocked(getHomeCategoryMarquee).mockResolvedValue([
      {
        slug: 'finance',
        name: 'Finance',
        imageSrc: '/categories/finance.svg',
        href: '/categories/finance'
      }
    ])
    vi.mocked(getHotCashbackOffers).mockResolvedValue([
      {
        id: 'hot-cashback-rakuten',
        brandName: 'Rakuten',
        slug: 'rakuten',
        badgeText: '$50 bonus',
        description: 'Test cashback copy.',
        ctaText: 'Invite a friend',
        href: 'https://www.rakuten.com/r/MVADIM7',
        logoSrc: '/hot-cashback/logos/rakuten.svg'
      }
    ])
    vi.mocked(getHomeClipCoupons).mockResolvedValue([
      {
        id: 'clip-test',
        brand: 'Test Brand',
        title: 'Test deal',
        blurb: 'Test blurb.',
        code: 'TESTCODE',
        openUrl: 'https://example.com/offer',
        logoSrc: '/brands/uber-logo.png'
      }
    ])
    const html = renderToStaticMarkup(await HomePage())
    expect(html).toContain('Top offers this month')
    expect(html).toContain('Codes worth clipping')
    expect(html).toContain('Hot Cashback')
    expect(html).toContain('Test cashback copy.')
    expect(html).toContain('Test klarna offer')
    expect(html).toContain('href="https://invite.klarna.com/test"')
    expect(html).toContain('clip-coupons-section')
    expect(html).toContain('/brands/uber-logo.png')
    expect(html).toContain('TESTCODE')
    expect(html).toContain('Copy code &amp; open offer')
    expect(html).toContain('category-marquee-section')
    expect(html).toContain('/categories/finance.svg')
  })

  it('renders home fallback state when APIs fail', async () => {
    vi.mocked(getHeroSlides).mockRejectedValue(new Error('down'))
    vi.mocked(getTopMonthlyOffers).mockRejectedValue(new Error('down'))
    vi.mocked(getHomeClipCoupons).mockRejectedValue(new Error('down'))
    vi.mocked(getHomeCategoryMarquee).mockRejectedValue(new Error('down'))
    vi.mocked(getHotCashbackOffers).mockRejectedValue(new Error('down'))
    const html = renderToStaticMarkup(await HomePage())
    expect(html).not.toContain('monthly-offers-section')
    expect(html).not.toContain('clip-coupons-section')
    expect(html).not.toContain('hot-cashback-section')
  })

  it('renders coupon details and metadata branches', async () => {
    vi.mocked(getOfferById).mockResolvedValue({
      id: 'o1',
      title: 'Coupon One',
      referralUrl: 'https://example.com',
      status: 'active',
      terms: 'Do this first',
      description: 'Coupon details',
      bonusAmount: '$10'
    } as never)
    const html = renderToStaticMarkup(await CouponDetailsPage({ params: Promise.resolve({ id: 'o1' }) }))
    expect(html).toContain('Coupon One')

    await expect(generateMetadata({ params: Promise.resolve({ id: 'o1' }) })).resolves.toMatchObject({
      title: 'Coupon One | Bonus Bridge'
    })

    vi.mocked(getOfferById).mockResolvedValueOnce(null as never)
    await expect(generateMetadata({ params: Promise.resolve({ id: 'missing' }) })).resolves.toMatchObject({
      title: 'Coupon not found | Bonus Bridge'
    })
  })

  it('uses metadata fallback description and handles rejected coupon fetch', async () => {
    vi.mocked(getOfferById).mockResolvedValueOnce({
      id: 'o3',
      title: 'Coupon Three',
      referralUrl: 'https://example.com',
      status: 'active'
    } as never)
    await expect(generateMetadata({ params: Promise.resolve({ id: 'o3' }) })).resolves.toMatchObject({
      description: 'Coupon details and referral terms.'
    })

    vi.mocked(getOfferById).mockRejectedValueOnce(new Error('down'))
    await expect(generateMetadata({ params: Promise.resolve({ id: 'o4' }) })).resolves.toMatchObject({
      title: 'Coupon not found | Bonus Bridge'
    })

    vi.mocked(getOfferById).mockRejectedValueOnce(new Error('down'))
    const html = renderToStaticMarkup(await CouponDetailsPage({ params: Promise.resolve({ id: 'o4' }) }))
    expect(html).toContain('Coupon not found')
  })

  it('renders missing coupon branch', async () => {
    vi.mocked(getOfferById).mockResolvedValue(null as never)
    const html = renderToStaticMarkup(await CouponDetailsPage({ params: Promise.resolve({ id: 'none' }) }))
    expect(html).toContain('Coupon not found')
  })

  it('renders coupon details branch without terms', async () => {
    vi.mocked(getOfferById).mockResolvedValue({
      id: 'o2',
      title: 'Coupon Two',
      referralUrl: 'https://example.com',
      status: 'active'
    } as never)
    const html = renderToStaticMarkup(await CouponDetailsPage({ params: Promise.resolve({ id: 'o2' }) }))
    expect(html).toContain('Coupon Two')
  })

  it('renders coupon with couponCode for copy button', async () => {
    vi.mocked(getOfferById).mockResolvedValue({
      id: 'o5',
      title: 'Coupon With Code',
      referralUrl: 'https://example.com',
      couponCode: 'SAVE20',
      status: 'active'
    } as never)
    const html = renderToStaticMarkup(await CouponDetailsPage({ params: Promise.resolve({ id: 'o5' }) }))
    expect(html).toContain('Coupon With Code')
    expect(html).toContain('Copy code')
  })

  it('renders empty state component', () => {
    const html = renderToStaticMarkup(<EmptyState message="No data" />)
    expect(html).toContain('No data')
    expect(html).toContain('app-surface-card')
  })

  it('renders home layout', async () => {
    vi.mocked(getStoresMegaMenu).mockResolvedValue({
      categories: [{ slug: 'finance', name: 'Finance', imageSrc: '/categories/finance.svg' }],
      storesByCategorySlug: { finance: [] }
    })
    const tree = await HomeLayout({
      children: <main>child</main>
    })
    const html = renderToStaticMarkup(tree)
    expect(html).toContain('BonusBridge')
    expect(html).toContain('Privacy Policy')
    expect(html).toContain('child')
  })

  it('renders home layout when getStoresMegaMenu fails', async () => {
    vi.mocked(getStoresMegaMenu).mockRejectedValue(new Error('down'))
    const tree = await HomeLayout({
      children: <main>fallback</main>
    })
    const html = renderToStaticMarkup(tree)
    expect(html).toContain('BonusBridge')
    expect(html).toContain('fallback')
  })

  it('renders root layout', async () => {
    const html = renderToStaticMarkup(
      RootLayout({
        children: <main>child</main>
      })
    )
    expect(html).toContain('child')
  })

  it('renders default layout with navigation', async () => {
    vi.mocked(getStoresMegaMenu).mockResolvedValue({
      categories: [
        { slug: 'electronics', name: 'Electronics', imageSrc: '/categories/electronics.svg' }
      ],
      storesByCategorySlug: {
        electronics: [{ slug: 'store', name: 'Store', imageSrc: '/icon.svg' }]
      }
    })
    const html = renderToStaticMarkup(
      await DefaultLayout({
        children: <main>child</main>
      })
    )
    expect(html).toContain('BonusBridge')
    expect(html).toContain('Stores')
    expect(html).toContain('Coupons')
  })

  it('renders default layout when getStoresMegaMenu fails', async () => {
    vi.mocked(getStoresMegaMenu).mockRejectedValue(new Error('down'))
    const html = renderToStaticMarkup(
      await DefaultLayout({
        children: <main>child</main>
      })
    )
    expect(html).toContain('BonusBridge')
    expect(html).toContain('child')
  })

  it('renders category page with stores and offers', async () => {
    vi.mocked(getCategories).mockResolvedValue([
      { id: 'c1', name: 'Electronics', slug: 'electronics' } as never
    ])
    vi.mocked(getServices).mockResolvedValue([
      {
        id: 's1',
        name: 'Tech Shop',
        slug: 'tech-shop',
        description: 'Gadgets',
        categoryId: 'c1'
      } as never
    ])
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's1',
        title: '10% off',
        previewText: 'Save on first order',
        couponCode: 'SAVE10',
        referralUrl: 'https://example.com',
        status: 'active'
      } as never
    ])
    const html = renderToStaticMarkup(
      await CategoryPage({ params: Promise.resolve({ slug: 'electronics' }) })
    )
    expect(html).toContain('Electronics')
    expect(html).toContain('Tech Shop')
    expect(html).toContain('10% off')
    expect(html).toContain('SAVE10')
    await expect(
      generateCategoryMetadata({ params: Promise.resolve({ slug: 'electronics' }) })
    ).resolves.toMatchObject({ title: 'Electronics stores | BonusBridge' })
  })

  it('renders store page and metadata', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Store',
      slug: 'store',
      categoryId: 'c1',
      website: 'https://store.example',
      logoSrc: '/brands/uber-logo.png',
      logoSvg: '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's1',
        title: 'Coupon One',
        previewText: 'Preview text',
        couponCode: 'CODE10',
        referralUrl: 'https://coupon.example',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never,
      {
        id: 'o2',
        serviceId: 's1',
        title: 'Coupon Two',
        previewText: 'Fallback copy to referral URL',
        referralUrl: 'https://coupon.example/fallback',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])

    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(html).toContain('Store')
    expect(html).toContain('Preview text')
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'store' }) })
    ).resolves.toMatchObject({ title: 'Store | BonusBridge' })
  })

  it('renders store page with inline SVG when logoSrc is absent', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-svg',
      name: 'SVG Store',
      slug: 'svg-store',
      categoryId: 'c1',
      website: 'https://example.com',
      logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle r="10"/></svg>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'svg-store' }) }))
    expect(html).toContain('data:image/svg+xml')
  })

  it('renders fallback branches for store page', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Store',
      slug: 'store',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([])
    const noCouponsHtml = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(noCouponsHtml).toContain('No active promo codes or offers for this store yet.')

    vi.mocked(getServiceBySlug).mockResolvedValueOnce(null as never).mockResolvedValueOnce(null as never)
    const missingHtml = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'missing' }) }))
    expect(missingHtml).toContain('Store not found')
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'missing' }) })
    ).resolves.toMatchObject({ title: 'Store not found | BonusBridge' })
  })

  it('handles rejected store data fetches', async () => {
    vi.mocked(getServiceBySlug).mockRejectedValueOnce(new Error('down')).mockRejectedValueOnce(new Error('down'))
    vi.mocked(getOffers).mockRejectedValueOnce(new Error('down'))

    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(html).toContain('Store not found')
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'store' }) })
    ).resolves.toMatchObject({ title: 'Store not found | BonusBridge' })
  })
})
