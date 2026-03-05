import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCountries, getOfferById, getOffers, getServiceBySlug, getServices } from './api-client'

describe('web api-client', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/countries')) {
          return new Response(JSON.stringify([{ id: '550e8400-e29b-41d4-a716-446655440010', name: 'US', code: 'US', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]), { status: 200 })
        }
        if (url.includes('/services/') && !url.endsWith('/services')) {
          return new Response(
            JSON.stringify({
              id: '550e8400-e29b-41d4-a716-446655440011',
              name: 'Service',
              slug: 'service',
              categoryId: '550e8400-e29b-41d4-a716-446655440000',
              website: 'https://service.example',
              logoUrl: 'https://service.example/logo.svg',
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
        if (url.includes('/offers/')) {
          return new Response(
            JSON.stringify({ id: '550e8400-e29b-41d4-a716-446655440000', serviceId: '550e8400-e29b-41d4-a716-446655440001', countryId: '550e8400-e29b-41d4-a716-446655440002', title: 'Offer', previewText: 'Preview', couponCode: 'CODE10', referralUrl: 'https://example.com', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
            { status: 200 }
          )
        }

        return new Response(
          JSON.stringify({ items: [{ id: '550e8400-e29b-41d4-a716-446655440000', serviceId: '550e8400-e29b-41d4-a716-446655440001', countryId: '550e8400-e29b-41d4-a716-446655440002', title: 'Offer', previewText: 'Preview', couponCode: 'CODE10', referralUrl: 'https://example.com', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] }),
          { status: 200 }
        )
      }) as never
    )
  })

  it('parses list and details payloads', async () => {
    await expect(getCountries()).resolves.toHaveLength(1)
    await expect(getServices()).resolves.toHaveLength(1)
    await expect(getServiceBySlug('service')).resolves.toMatchObject({ slug: 'service' })
    await expect(getOffers()).resolves.toHaveLength(1)
    await expect(getOfferById('550e8400-e29b-41d4-a716-446655440000')).resolves.toMatchObject({ title: 'Offer' })
  })

  it('handles query keys with undefined values', async () => {
    await expect(getOffers({ service: undefined } as never)).resolves.toHaveLength(1)
  })

  it('throws when api response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })) as never)
    await expect(getOffers()).rejects.toThrow('API request failed: 500')
  })
})
