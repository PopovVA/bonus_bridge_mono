import { beforeEach, describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/lib/site-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/site-data')>()
  return {
    ...actual,
    getCategories: vi.fn(),
    getClientCatalog: vi.fn(),
    getServices: vi.fn(),
    getOffers: vi.fn(),
    getStoreSlugForOfferId: vi.fn(),
    getServiceBySlug: vi.fn(),
    getHeroSlides: vi.fn(),
    getTopMonthlyOffers: vi.fn(),
    getHomeClipCoupons: vi.fn(),
    getHomeCategoryMarquee: vi.fn(),
    getAllHotCashbackOffers: vi.fn(),
    getHotCashbackOffers: vi.fn(),
    getStoresMegaMenu: vi.fn()
  }
})

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn((url: string) => {
    throw new Error(`MOCK_REDIRECT:${url}`)
  }),
  notFound: vi.fn(() => {
    throw new Error('MOCK_NOT_FOUND')
  })
}))

import { notFound, permanentRedirect } from 'next/navigation'
import HomePage from './(home)/page'
import HomeLayout from './(home)/layout'
import RootLayout from './layout'
import DefaultLayout from './(default)/layout'
import CouponToStoreRedirectPage, {
  generateMetadata as generateCouponRedirectMetadata
} from './(default)/coupons/[id]/page'
import StorePage, { generateMetadata as generateStoreMetadata } from './(default)/stores/[slug]/page'
import CategoryPage, { generateMetadata as generateCategoryMetadata } from './(default)/categories/[slug]/page'
import { EmptyState } from '@/components/empty-state'
import {
  getCategories,
  getClientCatalog,
  getStoreSlugForOfferId,
  getOffers,
  getHeroSlides,
  getHomeClipCoupons,
  getHomeCategoryMarquee,
  getAllHotCashbackOffers,
  getHotCashbackOffers,
  getTopMonthlyOffers,
  getServiceBySlug,
  getServices,
  getStoresMegaMenu
} from '@/lib/site-data'

(globalThis as { React?: typeof React }).React = React

vi.mocked(getClientCatalog).mockResolvedValue({ categories: [] })

describe('web routes', () => {
  beforeEach(() => {
    vi.mocked(getAllHotCashbackOffers).mockReset()
    vi.mocked(getAllHotCashbackOffers).mockResolvedValue([])
    vi.mocked(getCategories).mockReset()
    vi.mocked(getCategories).mockResolvedValue([
      {
        id: 'c1',
        name: 'Electronics',
        slug: 'electronics',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z'
      }
    ] as never)
  })

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
    expect(html).toContain('Get offer')
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

  it('permanentRedirect to store when coupon id maps to a store', async () => {
    vi.mocked(getStoreSlugForOfferId).mockResolvedValue('uber')
    await expect(
      CouponToStoreRedirectPage({
        params: Promise.resolve({ id: '33333333-3333-4333-8333-333333333303' })
      })
    ).rejects.toThrow('MOCK_REDIRECT:/stores/uber')
    expect(vi.mocked(permanentRedirect)).toHaveBeenCalledWith('/stores/uber')
  })

  it('coupon redirect calls notFound when id is unknown', async () => {
    vi.mocked(getStoreSlugForOfferId).mockResolvedValue(null)
    await expect(
      CouponToStoreRedirectPage({ params: Promise.resolve({ id: '00000000-0000-4000-8000-000000000099' }) })
    ).rejects.toThrow('MOCK_NOT_FOUND')
    expect(vi.mocked(notFound)).toHaveBeenCalled()
  })

  it('coupon redirect metadata for known and unknown ids', async () => {
    vi.mocked(getStoreSlugForOfferId).mockResolvedValueOnce('uber')
    await expect(
      generateCouponRedirectMetadata({
        params: Promise.resolve({ id: '33333333-3333-4333-8333-333333333303' })
      })
    ).resolves.toMatchObject({ robots: { index: false, follow: true } })

    vi.mocked(getStoreSlugForOfferId).mockResolvedValueOnce(null)
    await expect(
      generateCouponRedirectMetadata({
        params: Promise.resolve({ id: '00000000-0000-4000-8000-000000000099' })
      })
    ).resolves.toMatchObject({ title: 'Offer not found | BonusBridge' })
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
    const tree = await RootLayout({
      children: <main>child</main>
    })
    const html = renderToStaticMarkup(tree)
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
    expect(html).toContain('1 promo code')
    expect(html).toContain('/stores/tech-shop')
    expect(html).toContain('View store')
    expect(html).not.toContain('/coupons/')
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
    expect(html).toContain('About this store')
    expect(html).toContain('Open Store')
    expect(html).toContain('href="https://coupon.example"')
    expect(html).toContain('clip-coupon-card')
    expect(html).toContain('CODE10')
    expect(html).not.toContain('Referral link')
    expect(html).toContain('Get offer')
    expect(html).toContain('hot-cashback-card')
    expect(html).toContain('store-top-offers-heading')
    expect(html).toContain('Top offers')
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'store' }) })
    ).resolves.toMatchObject({
      title: 'Store | BonusBridge',
      description: 'Promo codes and offers for Store.'
    })
  })

  it('renders Top offers with curated Klarna link card when offer has no promo code', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-klarna',
      name: 'Klarna',
      slug: 'klarna',
      categoryId: 'c1',
      logoSrc: '/top-offers/logos/klarna-logo.svg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o-klarna',
        serviceId: 's-klarna',
        title: 'Shop now with Klarna',
        previewText: 'Flexible payments',
        couponCode: null,
        referralUrl: 'https://invite.klarna.com/us/n33cxpeu/default-us',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'klarna' }) }))
    expect(html).toContain('store-top-offers-heading')
    expect(html).toContain('Top offers')
    expect(html).toContain('hot-cashback-card')
    expect(html).toContain('Open Klarna')
    expect(html).toContain('20$ off')
    expect(html).not.toContain('store-monthly-spotlight')
    expect(html).not.toContain('No active promo codes or offers for this store yet.')
  })

  it('store page still renders Top offers clip card when only promo-code offers exist', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Store',
      slug: 'store',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's1',
        title: 'Deal',
        previewText: 'P',
        couponCode: 'X',
        referralUrl: 'https://example.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(html).toContain('Top offers')
    expect(html).toContain('clip-coupon-card')
  })

  it('store page treats failed getCategories as empty categories list', async () => {
    vi.mocked(getCategories).mockRejectedValueOnce(new Error('categories down'))
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Store',
      slug: 'store',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's1',
        title: 'Deal',
        previewText: 'P',
        couponCode: 'X',
        referralUrl: 'https://example.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(html).toContain('Store')
    expect(html).toContain('clip-coupon-card')
  })

  it('store metadata uses service description when set', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-desc',
      name: 'Desc Store',
      slug: 'desc-store',
      categoryId: 'c1',
      description: 'A test blurb about the merchant.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'desc-store' }) })
    ).resolves.toMatchObject({
      description: 'A test blurb about the merchant. Find promo codes and offers on BonusBridge.'
    })
  })

  it('store page hero partner link uses first offer referral URL', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-one',
      name: 'One Coupon Store',
      slug: 'one-coupon',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'only-o',
        serviceId: 's-one',
        title: 'Solo deal',
        previewText: 'Only one',
        couponCode: 'X',
        referralUrl: 'https://example.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'one-coupon' }) }))
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('Open Store')
    expect(html).not.toContain('href="/coupons/')
  })


  it('renders Top offers hot-cashback card for Rakuten link-only offer (curated copy)', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-r',
      name: 'Rakuten',
      slug: 'rakuten',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'r-offer',
        serviceId: 's-r',
        title: 'Cashback only',
        previewText: 'No coupon',
        couponCode: null,
        referralUrl: 'https://www.rakuten.com/r/MVADIM7',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'rakuten' }) }))
    expect(html).toContain('Top offers')
    expect(html).toContain('hot-cashback-card')
    expect(html).toContain('$50 bonus')
    expect(html).toContain('Get the bonus')
    expect(html).toContain('Register for up to $50 after qualifying spend')
    expect(html).not.toContain('clip-coupon-card')
    expect(html).not.toContain('No active promo codes or offers for this store yet.')
  })

  it('renders Top offers for Public link-only offer (monthly snapshot copy, no duplicate spotlight)', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-pub',
      name: 'Public',
      slug: 'public',
      categoryId: 'c1',
      logoSrc: '/top-offers/logos/public-logo.svg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'pub-offer',
        serviceId: 's-pub',
        title: 'Public — investing welcome bonus',
        previewText: 'Join through our link.',
        couponCode: null,
        referralUrl: 'https://share.public.com/Vadim66923',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'public' }) }))
    expect(html).toContain('Top offers')
    expect(html).toContain('hot-cashback-card')
    expect(html).toContain('Join Public')
    expect(html).toContain('Invest with friends on Public')
    expect(html).not.toContain('store-monthly-spotlight')
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
    expect(html).toContain('About this store')
    expect(html).not.toContain('Open Store')
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
    expect(noCouponsHtml).toContain('About this store')

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
