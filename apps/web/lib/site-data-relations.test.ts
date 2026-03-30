import { describe, expect, it } from 'vitest'
import { offerWithService, serviceWithCategory } from './site-data-relations'

const ISO = '2026-01-01T00:00:00.000Z'

const categories = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    name: 'Finance',
    slug: 'finance',
    createdAt: ISO,
    updatedAt: ISO
  }
]

const serviceOk = {
  id: '22222222-2222-4222-8222-222222222201',
  name: 'Acme',
  slug: 'acme',
  categoryId: '11111111-1111-4111-8111-111111111101',
  website: 'https://example.com' as const,
  description: 'Hi',
  logoSvg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' as const,
  createdAt: ISO,
  updatedAt: ISO
}

const serviceOrphanCat = { ...serviceOk, id: '22222222-2222-4222-8222-222222222299', categoryId: '99999999-9999-4999-8999-999999999999' }

describe('site-data-relations', () => {
  it('attaches category when id matches', () => {
    const w = serviceWithCategory(serviceOk, categories)
    expect(w.category?.slug).toBe('finance')
  })

  it('omits category when id does not match any category', () => {
    const w = serviceWithCategory(serviceOrphanCat, categories)
    expect(w.category).toBeUndefined()
  })

  it('omits service on offer when service id is unknown', () => {
    const offer = {
      id: '33333333-3333-4333-8333-333333333301',
      serviceId: '00000000-0000-4000-8000-000000000001',
      title: 'T',
      previewText: 'P',
      couponCode: null,
      bonusAmount: null,
      description: null,
      referralUrl: 'https://example.com',
      terms: null,
      status: 'active' as const,
      createdAt: ISO,
      updatedAt: ISO
    }
    const w = offerWithService(offer, [serviceOk], categories)
    expect(w.service).toBeUndefined()
  })

  it('nests service with category on offer', () => {
    const offer = {
      id: '33333333-3333-4333-8333-333333333302',
      serviceId: serviceOk.id,
      title: 'T',
      previewText: 'P',
      couponCode: null,
      bonusAmount: null,
      description: null,
      referralUrl: 'https://example.com',
      terms: null,
      status: 'active' as const,
      createdAt: ISO,
      updatedAt: ISO
    }
    const w = offerWithService(offer, [serviceOk], categories)
    expect(w.service?.category?.slug).toBe('finance')
  })
})
