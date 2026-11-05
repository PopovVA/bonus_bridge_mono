import { describe, expect, it } from 'vitest'
import { clipMetaDescription, pageSocialMetadata } from './seo'

describe('page social metadata', () => {
  it('leaves a short description unchanged and clips a long one on a word', () => {
    expect(clipMetaDescription('Short description.')).toBe('Short description.')
    const long = `${'Referral guides for riders and shoppers. '.repeat(12)}Extra.`
    const clipped = clipMetaDescription(long, 80)
    expect(clipped.endsWith('…')).toBe(true)
    expect(clipped.length).toBeLessThanOrEqual(80)
    expect(clipped.includes('  ')).toBe(false)
  })

  it('clips a long string that has no useful word break', () => {
    const clipped = clipMetaDescription(`hi ${'x'.repeat(200)}`, 80)
    expect(clipped.endsWith('…')).toBe(true)
    expect(clipped.startsWith('hi')).toBe(true)
  })

  it('sets canonical, Open Graph, and Twitter fields without an invented image', () => {
    const meta = pageSocialMetadata({
      title: 'Uber',
      description: 'A short store blurb.',
      path: '/stores/uber'
    })
    expect(meta.title).toBe('Uber')
    expect(meta.description).toBe('A short store blurb.')
    expect(meta.alternates).toMatchObject({ canonical: '/stores/uber' })
    expect(meta.openGraph).toMatchObject({
      title: 'Uber',
      url: 'https://bonusbridge.io/stores/uber',
      siteName: 'BonusBridge',
      type: 'website'
    })
    expect(meta.openGraph && 'images' in meta.openGraph).toBe(false)
    expect(meta.twitter).toMatchObject({ card: 'summary', title: 'Uber' })
  })
})
