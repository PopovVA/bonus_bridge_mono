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
  usePathname: vi.fn(() => '/'),
  permanentRedirect: vi.fn((url: string) => {
    throw new Error(`MOCK_REDIRECT:${url}`)
  }),
  notFound: vi.fn(() => {
    throw new Error('MOCK_NOT_FOUND')
  })
}))

vi.mock('next/image', () => ({
  default: function ImageMock(props: {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
  }) {
    /* eslint-disable-next-line @next/next/no-img-element -- test double for `next/image` */
    return <img src={props.src} alt={props.alt} width={props.width} height={props.height} className={props.className} />
  }
}))

vi.mock('@/components/article-view-tracker', () => ({
  ArticleViewTracker: () => null
}))

vi.mock('@/components/chime-referral-calculator', () => ({
  ChimeReferralCalculator: () => <div className="chime-referral-calculator-mock" />
}))

vi.mock('@/components/article-partner-figure', () => ({
  ArticlePartnerFigure: () => <div className="article-partner-figure-mock" />
}))

vi.mock('@/components/store-related-panel', () => ({
  StoreRelatedPanel: () => (
    <section className="store-related-panel">
      <h2 className="section-title store-related-panel-title">Explore more</h2>
    </section>
  )
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
import ArticlesIndexPage from './(default)/articles/page'
import ChimeArticlePage, {
  generateMetadata as generateChimeArticleMetadata
} from './(default)/articles/chime-1000-two-friends/page'
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
        href: 'https://example.com/monthly',
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
        badgeText: 'Terms apply',
        headline: 'Rakuten offer details and eligibility',
        description: 'Test cashback copy.',
        ctaText: 'See offer details',
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
    expect(html).toContain('Offer details this month')
    expect(html).toContain('Codes and offer details')
    expect(html).toContain('Partner offer guides')
    expect(html).toContain('Test cashback copy.')
    expect(html).toContain('Test klarna offer')
    expect(html).toContain('href="https://example.com/monthly"')
    expect(html).toContain('Referral guides and provider terms')
    expect(html).not.toContain('Open partner site?')
    expect(html).toContain('clip-coupons-section')
    expect(html).toContain('/brands/uber-logo.png')
    expect(html).toContain('TESTCODE')
    expect(html).toContain('See details')
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
    ).resolves.toMatchObject({
      robots: { index: false, follow: true },
      title: { absolute: 'BonusBridge' }
    })

    vi.mocked(getStoreSlugForOfferId).mockResolvedValueOnce(null)
    await expect(
      generateCouponRedirectMetadata({
        params: Promise.resolve({ id: '00000000-0000-4000-8000-000000000099' })
      })
    ).resolves.toMatchObject({ title: 'Offer not found' })
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
    expect(html).toContain('Contact')
    expect(html).toContain('independent comparison and guide site')
    expect(html).toContain('affiliate commission')
    expect(html).toContain('BonusBridge is operated by Apis Systems LLC (Texas, USA)')
    expect(html).toContain('support@bonusbridge.io')
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
    expect(html).toContain('Guides')
    expect(html).toContain('Contact')
    expect(html).toContain('affiliate commission')
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

  it('renders articles index', () => {
    const html = renderToStaticMarkup(<ArticlesIndexPage />)
    expect(html).toContain('Informational Guides')
    expect(html).toContain('/articles/chime-1000-two-friends')
    expect(html).toContain('chime-building.webp')
  })

  it('renders chime article with structured data, partner links, terms link, and Explore more', async () => {
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('article-partner-figure-mock')
    expect(html).toContain('Explore more')
    expect(html).toContain('https://www.chime.com/r/vadimpopov1/')
    expect(html).toContain('what-is-chimes-standard-referral-program')
    expect(html).toContain('application/ld+json')
    expect(html).toContain('FAQPage')
    expect(html).toContain('id="requirements"')
    expect(html).toContain('id="chime-bonus-guide"')
    expect(html).toContain('id="how-it-works"')
    expect(html).toContain('10 per calendar year')
    expect(html).toContain('This guide explains how referral offers can work')
    expect(html).not.toContain('$1,000')
    expect(html).not.toContain('chime-referral-calculator')
  })

  it('chime article still renders when getServiceBySlug fails', async () => {
    vi.mocked(getServiceBySlug).mockRejectedValueOnce(new Error('down'))
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('Chime Referral Rules and Annual Cap')
  })

  it('chime article still renders when getCategories fails', async () => {
    vi.mocked(getCategories).mockRejectedValueOnce(new Error('down'))
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('Chime Referral Rules and Annual Cap')
  })

  it('chime article tolerates non-array getCategories result', async () => {
    vi.mocked(getCategories).mockResolvedValueOnce(undefined as never)
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('Chime Referral Rules and Annual Cap')
  })

  it('chime article sets primaryCategorySlug when Chime store matches catalog categories', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValueOnce({
      id: 's-chime',
      name: 'Chime',
      slug: 'chime',
      categoryId: 'c1'
    } as never)
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('Explore more')
  })

  it('chime article uses null primaryCategorySlug when store category is not in the list', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValueOnce({
      id: 's-chime',
      name: 'Chime',
      slug: 'chime',
      categoryId: 'no-such-category'
    } as never)
    const html = renderToStaticMarkup(await ChimeArticlePage())
    expect(html).toContain('Chime Referral Rules and Annual Cap')
  })

  it('generateMetadata for chime article sets canonical and keywords', async () => {
    const m = await generateChimeArticleMetadata()
    expect(m.alternates).toMatchObject({ canonical: '/articles/chime-1000-two-friends' })
    expect(m.title).toBeTruthy()
    expect(m.keywords).toBeDefined()
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
    ).resolves.toMatchObject({ title: 'Electronics store guides' })
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
    expect(html).toContain('See provider details')
    expect(html).toContain('href="https://coupon.example"')
    expect(html).toContain('clip-coupon-card')
    expect(html).toContain('CODE10')
    expect(html).not.toContain('Referral link')
    expect(html).toContain('See details')
    expect(html).toContain('hot-cashback-card')
    expect(html).toContain('store-top-offers-heading')
    expect(html).toContain('Top offers')
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'store' }) })
    ).resolves.toMatchObject({
      title: 'Store',
      description: 'Informational page for Store. Current bonus amounts are not verified on BonusBridge.'
    })
  })

  it('does not publish a Klarna referral promotion even if offer data includes one', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-klarna',
      name: 'Klarna',
      slug: 'klarna',
      categoryId: 'c1',
      website: 'https://www.klarna.com/',
      logoSrc: '/top-offers/logos/klarna-logo.svg',
      createdAt: new Date().toISOString(),
      updatedAt: '2026-03-01T12:00:00.000Z'
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o-klarna',
        serviceId: 's-klarna',
        title: 'Shop now with Klarna',
        previewText: 'Flexible payments',
        couponCode: null,
        referralUrl: 'https://example.com/should-not-render',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'klarna' }) }))
    expect(html).toContain('not publicly promoting a referral link')
    expect(html).toContain('href="https://www.klarna.com/"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).not.toContain('sponsored')
    expect(html).not.toContain('https://example.com/should-not-render')
    expect(html).not.toContain('See provider details')
    expect(html).toContain('BonusBridge is not publishing a referral offer for this provider.')
    expect(html).toContain('March 1, 2026')
    expect(html).toContain('/disclosures')
    await expect(generateStoreMetadata({ params: Promise.resolve({ slug: 'klarna' }) })).resolves.toMatchObject({
      robots: { index: false, follow: true }
    })
  })

  it('store page with a stated bonus uses a search title, H1 tail and FAQ schema', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's-chime',
      name: 'Chime',
      slug: 'chime',
      description: 'Banking app.',
      categoryId: 'c1',
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([])
    await expect(generateStoreMetadata({ params: Promise.resolve({ slug: 'chime' }) })).resolves.toMatchObject({
      title: 'Chime referral bonus: $100 for new members'
    })
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'chime' }) }))
    expect(html).toContain('store-page-title__sub')
    expect(html).toContain('"@type":"FAQPage"')
    expect(html).toContain('Questions about the Chime referral bonus')
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
        terms: 'Provider terms apply.',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: '2026-03-01T12:00:00.000Z'
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'store' }) }))
    expect(html).toContain('Top offers')
    expect(html).toContain('clip-coupon-card')
    expect(html).toContain('Provider terms apply.')
    expect(html).toContain('A current bonus amount is not verified on BonusBridge.')
    expect(html).toContain('March 1, 2026')
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
      description: 'A test blurb about the merchant. Current bonus amounts are not verified on BonusBridge.'
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
    expect(html).toContain('See provider details')
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
    expect(html).toContain('Terms apply')
    expect(html).toContain('Join Rakuten')
    expect(html).toContain('Welcome bonus varies')
    expect(html).toContain('clip-coupon-card__brand')
    expect(html).not.toContain('<article class="clip-coupon-card"')
    expect(html).not.toContain('No active promo codes or offers for this store yet.')
  })

  it('does not publish a Public referral promotion and omits a provider link when website is absent', async () => {
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
        title: 'Public investing welcome offer details',
        previewText: 'Join through our link.',
        couponCode: null,
        referralUrl: 'https://example.com/public-should-not-render',
        terms: 'Should not be shown as an active offer.',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])
    const html = renderToStaticMarkup(await StorePage({ params: Promise.resolve({ slug: 'public' }) }))
    expect(html).toContain('not publicly promoting a referral link')
    expect(html).not.toContain('https://example.com/public-should-not-render')
    expect(html).not.toContain('Provider website')
    expect(html).not.toContain('See provider details')
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
    await expect(StorePage({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow('MOCK_NOT_FOUND')
    expect(vi.mocked(notFound)).toHaveBeenCalled()
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'missing' }) })
    ).resolves.toMatchObject({ title: 'Store not found' })
  })

  it('handles rejected store data fetches', async () => {
    vi.mocked(getServiceBySlug).mockRejectedValueOnce(new Error('down')).mockRejectedValueOnce(new Error('down'))
    vi.mocked(getOffers).mockRejectedValueOnce(new Error('down'))

    await expect(StorePage({ params: Promise.resolve({ slug: 'store' }) })).rejects.toThrow('MOCK_NOT_FOUND')
    expect(vi.mocked(notFound)).toHaveBeenCalled()
    await expect(
      generateStoreMetadata({ params: Promise.resolve({ slug: 'store' }) })
    ).resolves.toMatchObject({ title: 'Store not found' })
  })
})
