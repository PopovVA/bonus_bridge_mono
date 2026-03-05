import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/lib/api-client', () => ({
  getCountries: vi.fn(),
  getServices: vi.fn(),
  getOffers: vi.fn(),
  getOfferById: vi.fn(),
  getServiceBySlug: vi.fn()
}))

import HomePage from './page'
import RootLayout from './layout'
import CountriesPage from './countries/page'
import ServicesPage from './services/page'
import OffersPage from './offers/page'
import OfferDetailsPage, { generateMetadata } from './offers/[offerId]/page'
import ServiceCouponsPage, { generateMetadata as generateServiceCouponsMetadata } from './services/[slug]/coupons/page'
import { EmptyState } from '@/components/empty-state'
import { getCountries, getOfferById, getOffers, getServiceBySlug, getServices } from '@/lib/api-client'

(globalThis as { React?: typeof React }).React = React

describe('web routes', () => {
  it('renders home with fetched aggregates', async () => {
    vi.mocked(getCountries).mockResolvedValue([{ id: 'c1', name: 'US', code: 'US' } as never])
    vi.mocked(getServices).mockResolvedValue([{ id: 's1', name: 'Service', slug: 'service' } as never])
    vi.mocked(getOffers).mockResolvedValue([{ id: 'o1', title: 'Offer', status: 'active' } as never])
    const html = renderToStaticMarkup(await HomePage())
    expect(html).toContain('Home')
    expect(html).toContain('Latest offers')
  })

  it('renders home fallback state when APIs fail', async () => {
    vi.mocked(getCountries).mockRejectedValue(new Error('down'))
    vi.mocked(getServices).mockRejectedValue(new Error('down'))
    vi.mocked(getOffers).mockRejectedValue(new Error('down'))
    const html = renderToStaticMarkup(await HomePage())
    expect(html).toContain('Home')
    expect(html).toContain('0 available')
  })

  it('renders countries/services/offers pages', async () => {
    vi.mocked(getCountries).mockResolvedValue([{ id: 'c1', name: 'US', code: 'US' } as never])
    vi.mocked(getServices).mockResolvedValue([
      { id: 's1', name: 'Service', slug: 'service', description: 'Desc', website: 'https://service.example' } as never,
      { id: 's2', name: 'No Description', slug: 'no-description' } as never
    ])
    vi.mocked(getOffers).mockResolvedValue([
      { id: 'o1', title: 'Offer', status: 'active', description: 'Offer desc' } as never,
      { id: 'o2', title: 'No Description', status: 'active' } as never
    ])

    expect(renderToStaticMarkup(await CountriesPage())).toContain('Countries')
    expect(renderToStaticMarkup(await ServicesPage())).toContain('Services')
    expect(renderToStaticMarkup(await OffersPage())).toContain('Offers')
  })

  it('renders empty-state branches for list pages', async () => {
    vi.mocked(getCountries).mockResolvedValue([])
    vi.mocked(getServices).mockResolvedValue([])
    vi.mocked(getOffers).mockResolvedValue([])

    expect(renderToStaticMarkup(await CountriesPage())).toContain('No countries yet')
    expect(renderToStaticMarkup(await ServicesPage())).toContain('No services yet')
    expect(renderToStaticMarkup(await OffersPage())).toContain('Offers')
  })

  it('handles rejected list APIs on list pages', async () => {
    vi.mocked(getCountries).mockRejectedValue(new Error('down'))
    vi.mocked(getServices).mockRejectedValue(new Error('down'))
    vi.mocked(getOffers).mockRejectedValue(new Error('down'))

    expect(renderToStaticMarkup(await CountriesPage())).toContain('No countries yet')
    expect(renderToStaticMarkup(await ServicesPage())).toContain('No services yet')
    expect(renderToStaticMarkup(await OffersPage())).toContain('Offers')
  })

  it('renders offer details and metadata branches', async () => {
    vi.mocked(getOfferById).mockResolvedValue({
      id: 'o1',
      title: 'Offer One',
      referralUrl: 'https://example.com',
      status: 'active',
      terms: 'Do this first',
      description: 'Offer details',
      bonusAmount: '$10'
    } as never)
    const html = renderToStaticMarkup(await OfferDetailsPage({ params: Promise.resolve({ offerId: 'o1' }) }))
    expect(html).toContain('Offer One')

    await expect(generateMetadata({ params: Promise.resolve({ offerId: 'o1' }) })).resolves.toMatchObject({
      title: 'Offer One | Bonus Bridge'
    })

    vi.mocked(getOfferById).mockResolvedValueOnce(null as never)
    await expect(generateMetadata({ params: Promise.resolve({ offerId: 'missing' }) })).resolves.toMatchObject({
      title: 'Offer not found | Bonus Bridge'
    })
  })

  it('uses metadata fallback description and handles rejected offer fetch', async () => {
    vi.mocked(getOfferById).mockResolvedValueOnce({
      id: 'o3',
      title: 'Offer Three',
      referralUrl: 'https://example.com',
      status: 'active'
    } as never)
    await expect(generateMetadata({ params: Promise.resolve({ offerId: 'o3' }) })).resolves.toMatchObject({
      description: 'Offer details and referral terms.'
    })

    vi.mocked(getOfferById).mockRejectedValueOnce(new Error('down'))
    await expect(generateMetadata({ params: Promise.resolve({ offerId: 'o4' }) })).resolves.toMatchObject({
      title: 'Offer not found | Bonus Bridge'
    })

    vi.mocked(getOfferById).mockRejectedValueOnce(new Error('down'))
    const html = renderToStaticMarkup(await OfferDetailsPage({ params: Promise.resolve({ offerId: 'o4' }) }))
    expect(html).toContain('Offer not found')
  })

  it('renders missing offer branch', async () => {
    vi.mocked(getOfferById).mockResolvedValue(null as never)
    const html = renderToStaticMarkup(await OfferDetailsPage({ params: Promise.resolve({ offerId: 'none' }) }))
    expect(html).toContain('Offer not found')
  })

  it('renders offer details branch without terms', async () => {
    vi.mocked(getOfferById).mockResolvedValue({
      id: 'o2',
      title: 'Offer Two',
      referralUrl: 'https://example.com',
      status: 'active'
    } as never)
    const html = renderToStaticMarkup(await OfferDetailsPage({ params: Promise.resolve({ offerId: 'o2' }) }))
    expect(html).toContain('Offer Two')
  })

  it('renders empty state component', () => {
    const html = renderToStaticMarkup(<EmptyState message="No data" />)
    expect(html).toContain('No data')
  })

  it('renders root layout navigation', () => {
    const html = renderToStaticMarkup(
      RootLayout({
        children: <main>child</main>
      })
    )
    expect(html).toContain('BonusBridge')
    expect(html).toContain('Countries')
  })

  it('renders service coupons page and metadata', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Service',
      slug: 'service',
      categoryId: 'c1',
      website: 'https://service.example',
      logoUrl: 'https://service.example/logo.svg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([
      {
        id: 'o1',
        serviceId: 's1',
        countryId: 'c1',
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
        countryId: 'c1',
        title: 'Coupon Two',
        previewText: 'Fallback copy to referral URL',
        referralUrl: 'https://coupon.example/fallback',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as never
    ])

    const html = renderToStaticMarkup(await ServiceCouponsPage({ params: Promise.resolve({ slug: 'service' }) }))
    expect(html).toContain('Service coupons')
    expect(html).toContain('Preview text')
    await expect(
      generateServiceCouponsMetadata({ params: Promise.resolve({ slug: 'service' }) })
    ).resolves.toMatchObject({ title: 'Service coupons | BonusBridge' })
  })

  it('renders fallback branches for service coupons page', async () => {
    vi.mocked(getServiceBySlug).mockResolvedValue({
      id: 's1',
      name: 'Service',
      slug: 'service',
      categoryId: 'c1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as never)
    vi.mocked(getOffers).mockResolvedValue([])
    const noCouponsHtml = renderToStaticMarkup(await ServiceCouponsPage({ params: Promise.resolve({ slug: 'service' }) }))
    expect(noCouponsHtml).toContain('No active coupons for this service yet.')

    vi.mocked(getServiceBySlug).mockResolvedValueOnce(null as never).mockResolvedValueOnce(null as never)
    const missingHtml = renderToStaticMarkup(await ServiceCouponsPage({ params: Promise.resolve({ slug: 'missing' }) }))
    expect(missingHtml).toContain('Service not found')
    await expect(
      generateServiceCouponsMetadata({ params: Promise.resolve({ slug: 'missing' }) })
    ).resolves.toMatchObject({ title: 'Service coupons not found | BonusBridge' })
  })

  it('handles rejected service coupon data fetches', async () => {
    vi.mocked(getServiceBySlug).mockRejectedValueOnce(new Error('down')).mockRejectedValueOnce(new Error('down'))
    vi.mocked(getOffers).mockRejectedValueOnce(new Error('down'))

    const html = renderToStaticMarkup(await ServiceCouponsPage({ params: Promise.resolve({ slug: 'service' }) }))
    expect(html).toContain('Service not found or API is unavailable.')
    await expect(
      generateServiceCouponsMetadata({ params: Promise.resolve({ slug: 'service' }) })
    ).resolves.toMatchObject({ title: 'Service coupons not found | BonusBridge' })
  })
})
