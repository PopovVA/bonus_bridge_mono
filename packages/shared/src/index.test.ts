import { describe, expect, it } from 'vitest'
import {
  CountryCreateSchema,
  listEnvelopeSchema,
  OfferCreateSchema,
  ReferralCreateSchema,
  ServicesListQuerySchema,
  normalizeText,
  toSlug
} from './index'

describe('shared contracts', () => {
  it('normalizes text and slugs values', () => {
    expect(normalizeText('  hello   world  ')).toBe('hello world')
    expect(toSlug('Hello World !!')).toBe('hello-world')
  })

  it('validates country input', () => {
    const parsed = CountryCreateSchema.parse({ name: 'United States', code: 'us' })
    expect(parsed.code).toBe('US')
  })

  it('applies defaults for list query', () => {
    const parsed = ServicesListQuerySchema.parse({})
    expect(parsed.limit).toBe(20)
    expect(parsed.offset).toBe(0)
  })

  it('accepts valid offer and referral input', () => {
    const offer = OfferCreateSchema.parse({
      serviceId: '550e8400-e29b-41d4-a716-446655440000',
      countryId: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Get welcome bonus',
      referralUrl: 'https://example.com/r/bonus'
    })
    const referral = ReferralCreateSchema.parse({
      offerId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'user@example.com'
    })

    expect(offer.status).toBe('draft')
    expect(referral.email).toBe('user@example.com')
  })

  it('parses list envelope helper', () => {
    const schema = listEnvelopeSchema(CountryCreateSchema)
    const parsed = schema.parse([{ name: 'USA', code: 'US' }])
    expect(parsed).toHaveLength(1)
  })
})
