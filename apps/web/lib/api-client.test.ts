import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCategories,
  getFeaturedOffers,
  getFeaturedStores,
  getHeroImages,
  getOfferById,
  getOffers,
  getPremiumBanner,
  getServiceBySlug,
  getServices
} from './api-client'

describe('web api-client', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/categories')) {
          return new Response(
            JSON.stringify({
              items: [
                {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  name: 'Fintech',
                  slug: 'fintech',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ]
            }),
            { status: 200 }
          )
        }
        if (url.includes('/services/') && !url.endsWith('/services')) {
          return new Response(
            JSON.stringify({
              id: '550e8400-e29b-41d4-a716-446655440011',
              name: 'Service',
              slug: 'service',
              categoryId: '550e8400-e29b-41d4-a716-446655440000',
              website: 'https://service.example',
              logoSvg: '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }),
            { status: 200 }
          )
        }
        if (url.includes('/services')) {
          return new Response(
            JSON.stringify({ items: [{ id: '550e8400-e29b-41d4-a716-446655440011', name: 'Service', slug: 'service', categoryId: '550e8400-e29b-41d4-a716-446655440000', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }], total: 1 }),
            { status: 200 }
          )
        }
        if (url.includes('/hero-images')) {
          return new Response(
            JSON.stringify({
              items: [
                {
                  id: '550e8400-e29b-41d4-a716-446655440099',
                  imageUrl: 'https://example.com/hero.jpg',
                  sortOrder: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ]
            }),
            { status: 200 }
          )
        }
        if (url.includes('/premium-banner') && !url.includes('/all')) {
          return new Response(
            JSON.stringify({
              id: '550e8400-e29b-41d4-a716-446655440098',
              title: 'Join Premium',
              description: 'Get exclusive deals',
              priceText: '$9.99/month',
              priceNote: 'First month free',
              ctaText: 'Start Free Trial',
              ctaHref: 'https://premium.example',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }),
            { status: 200 }
          )
        }
        if (url.includes('/featured-stores')) {
          return new Response(
            JSON.stringify([
              {
                id: '550e8400-e29b-41d4-a716-446655440097',
                storeId: '550e8400-e29b-41d4-a716-446655440011',
                sortOrder: 0,
                store: {
                  id: '550e8400-e29b-41d4-a716-446655440011',
                  name: 'Store',
                  slug: 'store',
                  categoryId: '550e8400-e29b-41d4-a716-446655440000',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]),
            { status: 200 }
          )
        }
        if (url.includes('/featured-offers')) {
          return new Response(
            JSON.stringify([
              {
                id: '550e8400-e29b-41d4-a716-446655440096',
                offerId: '550e8400-e29b-41d4-a716-446655440000',
                sortOrder: 0,
                offer: {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  serviceId: '550e8400-e29b-41d4-a716-446655440001',
                  title: 'Offer',
                  previewText: 'Preview',
                  couponCode: 'CODE10',
                  referralUrl: 'https://example.com',
                  status: 'active',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]),
            { status: 200 }
          )
        }
        if (url.includes('/offers/')) {
          return new Response(
            JSON.stringify({ id: '550e8400-e29b-41d4-a716-446655440000', serviceId: '550e8400-e29b-41d4-a716-446655440001', title: 'Offer', previewText: 'Preview', couponCode: 'CODE10', referralUrl: 'https://example.com', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
            { status: 200 }
          )
        }

        return new Response(
          JSON.stringify({ items: [{ id: '550e8400-e29b-41d4-a716-446655440000', serviceId: '550e8400-e29b-41d4-a716-446655440001', title: 'Offer', previewText: 'Preview', couponCode: 'CODE10', referralUrl: 'https://example.com', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }),
          { status: 200 }
        )
      }) as never
    )
  })

  it('parses list and details payloads', async () => {
    await expect(getCategories()).resolves.toHaveLength(1)
    await expect(getHeroImages()).resolves.toHaveLength(1)
    await expect(getPremiumBanner()).resolves.toMatchObject({ title: 'Join Premium' })
    await expect(getFeaturedStores()).resolves.toHaveLength(1)
    await expect(getFeaturedOffers()).resolves.toHaveLength(1)
    await expect(getServices()).resolves.toHaveLength(1)
    await expect(getServiceBySlug('service')).resolves.toMatchObject({ slug: 'service' })
    await expect(getOffers()).resolves.toHaveLength(1)
    await expect(getOfferById('550e8400-e29b-41d4-a716-446655440000')).resolves.toMatchObject({ title: 'Offer' })
  })

  it('handles query keys with undefined values', async () => {
    await expect(getOffers({ service: undefined } as never)).resolves.toHaveLength(1)
  })

  it('handles array envelope format', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/services')) {
          return new Response(
            JSON.stringify([
              {
                id: '550e8400-e29b-41d4-a716-446655440011',
                name: 'S1',
                slug: 's1',
                categoryId: '550e8400-e29b-41d4-a716-446655440000',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]),
            { status: 200 }
          )
        }
        return new Response(JSON.stringify([]), { status: 200 })
      }) as never
    )
    await expect(getServices()).resolves.toHaveLength(1)
  })

  it('returns null for premium banner when empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).includes('/premium-banner') && !String(input).includes('/all')) {
          return new Response('null', { status: 200 })
        }
        return new Response('{}', { status: 200 })
      }) as never
    )
    await expect(getPremiumBanner()).resolves.toBeNull()
  })

  it('throws when api response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })) as never)
    await expect(getOffers()).rejects.toThrow('API request failed: 500')
  })
})
