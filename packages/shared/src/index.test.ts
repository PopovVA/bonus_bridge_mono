import { describe, expect, it } from 'vitest'
import {
  FeaturedOfferCreateSchema,
  FeaturedOfferWithOfferSchema,
  FeaturedStoreCreateSchema,
  FeaturedStoreWithStoreSchema,
  HeroImageCreateSchema,
  listEnvelopeSchema,
  OfferCreateSchema,
  PremiumBannerCreateSchema,
  ReferralCreateSchema,
  ServiceCreateSchema,
  ServicesListQuerySchema,
  normalizeText,
  toSlug
} from './index'

describe('shared contracts', () => {
  it('normalizes text and slugs values', () => {
    expect(normalizeText('  hello   world  ')).toBe('hello world')
    expect(toSlug('Hello World !!')).toBe('hello-world')
  })

  it('validates service with logoSvg', () => {
    const parsed = ServiceCreateSchema.parse({
      name: 'Test',
      slug: 'test',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      logoSvg: '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>'
    })
    expect(parsed.logoSvg).toContain('<svg')
  })

  it('applies defaults for list query', () => {
    const parsed = ServicesListQuerySchema.parse({})
    expect(parsed.limit).toBe(20)
    expect(parsed.offset).toBe(0)
  })

  it('accepts valid offer and referral input', () => {
    const offer = OfferCreateSchema.parse({
      serviceId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Get welcome bonus',
      previewText: 'Use this code during checkout to receive the bonus.',
      couponCode: 'WELCOME10',
      referralUrl: 'https://example.com/r/bonus'
    })
    const referral = ReferralCreateSchema.parse({
      offerId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'user@example.com'
    })

    expect(offer.status).toBe('draft')
    expect(offer.couponCode).toBe('WELCOME10')
    expect(referral.email).toBe('user@example.com')
  })

  it('parses list envelope helper', () => {
    const schema = listEnvelopeSchema(ServiceCreateSchema)
    const parsed = schema.parse([{ name: 'Test', slug: 'test', categoryId: '550e8400-e29b-41d4-a716-446655440000' }])
    expect(parsed).toHaveLength(1)
  })

  it('validates hero image create input', () => {
    const parsed = HeroImageCreateSchema.parse({
      imageUrl: 'https://example.com/hero.jpg',
      sortOrder: 0
    })
    expect(parsed.imageUrl).toBe('https://example.com/hero.jpg')
    expect(parsed.sortOrder).toBe(0)
  })

  it('validates premium banner create input', () => {
    const parsed = PremiumBannerCreateSchema.parse({
      title: 'Join Premium',
      description: 'Get exclusive deals',
      priceText: '$9.99/month',
      ctaText: 'Start Free Trial'
    })
    expect(parsed.title).toBe('Join Premium')
    expect(parsed.ctaText).toBe('Start Free Trial')
  })

  it('validates featured store create input', () => {
    const parsed = FeaturedStoreCreateSchema.parse({
      storeId: '550e8400-e29b-41d4-a716-446655440000',
      sortOrder: 0
    })
    expect(parsed.storeId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(parsed.sortOrder).toBe(0)
  })

  it('validates featured offer create input', () => {
    const parsed = FeaturedOfferCreateSchema.parse({
      offerId: '550e8400-e29b-41d4-a716-446655440001',
      sortOrder: 0
    })
    expect(parsed.offerId).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(parsed.sortOrder).toBe(0)
  })

  it('parses featured store with store relation', () => {
    const parsed = FeaturedStoreWithStoreSchema.parse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      storeId: '550e8400-e29b-41d4-a716-446655440001',
      sortOrder: 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      store: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Store',
        slug: 'store',
        categoryId: '550e8400-e29b-41d4-a716-446655440002',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    })
    expect(parsed.store?.name).toBe('Store')
  })

  it('parses featured offer with offer relation', () => {
    const parsed = FeaturedOfferWithOfferSchema.parse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      offerId: '550e8400-e29b-41d4-a716-446655440001',
      sortOrder: 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      offer: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        serviceId: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Deal',
        previewText: 'Preview',
        referralUrl: 'https://example.com',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    })
    expect(parsed.offer?.title).toBe('Deal')
  })
})
