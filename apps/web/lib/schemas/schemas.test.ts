import { describe, expect, it } from 'vitest'
import {
  FeaturedOfferCreateSchema,
  FeaturedOfferWithOfferSchema,
  FeaturedStoreCreateSchema,
  FeaturedStoreWithStoreSchema,
  HeroImageCreateSchema,
  HeroSlideSchema,
  OfferCreateSchema,
  PremiumBannerCreateSchema,
  ServiceCreateSchema,
  ServicesListQuerySchema
} from './index'
import { normalizeText } from '../utils/normalize'
import { toSlug } from '../utils/slug'

describe('site schemas', () => {
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
    const noLogo = ServiceCreateSchema.parse({
      name: 'Test',
      slug: 'test',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      logoSvg: '   '
    })
    expect(noLogo.logoSvg).toBeUndefined()
    expect(() =>
      ServiceCreateSchema.parse({
        name: 'Test',
        slug: 'test',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        logoSvg: 'not-svg'
      })
    ).toThrow()
  })

  it('applies defaults for list query', () => {
    const parsed = ServicesListQuerySchema.parse({})
    expect(parsed.limit).toBe(20)
    expect(parsed.offset).toBe(0)
  })

  it('accepts valid offer create input', () => {
    const offer = OfferCreateSchema.parse({
      serviceId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Get welcome bonus',
      previewText: 'Use this code during checkout to receive the bonus.',
      couponCode: 'WELCOME10',
      referralUrl: 'https://example.com/r/bonus'
    })

    expect(offer.status).toBe('draft')
    expect(offer.couponCode).toBe('WELCOME10')
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

  it('parses hero slide image and chime variants', () => {
    const img = HeroSlideSchema.parse({
      kind: 'image',
      id: '550e8400-e29b-41d4-a716-446655440000',
      sortOrder: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      imageUrl: 'https://example.com/h.jpg'
    })
    expect(img.kind).toBe('image')
    const chime = HeroSlideSchema.parse({
      kind: 'chime',
      id: '550e8400-e29b-41d4-a716-446655440001',
      sortOrder: 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      headline: '$125 for you',
      promoHighlight: 'Open via link to qualify.',
      subtext: 'Bonus when they enroll.',
      termsUrl: 'https://example.com/terms',
      referralUrl: 'https://example.com/r/x',
      ctaText: 'Start offer',
      stepsTitle: 'How it works',
      steps: [{ title: 'One' }, { title: 'Two', hint: 'Hint' }]
    })
    expect(chime.kind).toBe('chime')
    expect(chime.promoHighlight).toBe('Open via link to qualify.')
    expect(chime.ctaText).toBe('Start offer')
    expect(chime.steps).toHaveLength(2)
  })

  it('parses hero coinbase slide', () => {
    const cb = HeroSlideSchema.parse({
      kind: 'coinbase',
      id: '550e8400-e29b-41d4-a716-446655440099',
      sortOrder: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      headline: 'Grow with friends',
      subtext: 'Earn up to $200.',
      referralUrl: 'https://coinbase.com/join/X',
      ctaText: 'Join'
    })
    expect(cb.kind).toBe('coinbase')
    expect(cb.ctaText).toBe('Join')
  })
})
