import { describe, expect, it } from 'vitest'
import { articleJsonLd, chimeArticleDocument } from '@/lib/articles/chime-document'
import { getGuideBySlug } from '@/lib/guides'
import {
  buildLlmsFullTxt,
  markdownByKind,
  renderArticleMarkdown,
  renderGuideMarkdown,
  referralTermsUrl,
  renderStoreMarkdown,
  storeMarkdownBySlug
} from './content-markdown'

const EM_DASH = '\u2014'
const EN_DASH = '\u2013'

describe('content markdown', () => {
  it('renders a guide from the same record as the page', () => {
    const guide = getGuideBySlug('rakuten-referral-bonus-how-it-works')
    if (!guide) throw new Error('missing guide')
    const text = renderGuideMarkdown(guide)
    expect(text.startsWith('# Rakuten referral bonus: how it works')).toBe(true)
    expect(text).toContain('https://bonusbridge.io/guides/rakuten-referral-bonus-how-it-works')
    expect(text).toContain('$50')
    expect(text).toContain('Nov 13, 2026')
    expect(text).toContain('https://www.rakuten.com/referral/default.do')
    expect(text).toContain('independent comparison and guide site')
    expect(text).not.toContain(EM_DASH)
    expect(text).not.toContain(EN_DASH)
    expect(text).not.toContain('--')
  })

  it('renders the chime article, including a caption and a figure without one', () => {
    const text = renderArticleMarkdown(chimeArticleDocument)
    expect(text).toContain('# Chime Referral Rules and Annual Cap')
    expect(text).toContain('https://bonusbridge.io/articles/chime-1000-two-friends')
    expect(text).toContain('/articles/chime/referral-steps.webp')
    expect(text).toContain('Confirm the live steps on Chime')
    expect(text).toContain('10 per calendar year')
    expect(text).not.toContain('--')
  })

  it('skips a call to action when the bonus is not public', () => {
    const text = renderArticleMarkdown({
      ...chimeArticleDocument,
      sections: [
        {
          id: 'only',
          heading: 'Only',
          blocks: [{ type: 'cta', slug: 'not-a-partner', place: 'missing' }]
        }
      ]
    })
    expect(text).toContain('## Only')
    expect(text).not.toContain('https://www.chime.com')
  })

  it('throws when an article document has no list row', () => {
    expect(() => renderArticleMarkdown({ ...chimeArticleDocument, slug: 'missing-article' })).toThrow(/No article list row/)
  })

  it('renders store markdown for a stated amount, a variable amount, and no bonus', () => {
    const stated = renderStoreMarkdown({
      name: 'User Interviews',
      slug: 'user-interviews',
      description: 'Paid studies.',
      bonus: {
        slug: 'user-interviews',
        provider: 'User Interviews',
        amount: '$10',
        headline: 'each after a first study',
        condition: 'First-time signups only. Some featured studies pay $30 each.',
        ctaLabel: 'Join User Interviews',
        referralUrl: 'https://www.userinterviews.com/r/kdqtpxzqk',
        sourceUrl: 'https://support.userinterviews.com/hc/en-us/articles/51535883439379-Earn-money-with-our-participant-referral-program',
        checkedAt: '2026-11-16'
      },
      termsUrl: 'https://support.userinterviews.com/hc/en-us/articles/51535883439379-Earn-money-with-our-participant-referral-program',
      offers: [{ title: 'Study referral', previewText: 'Both get $10.', terms: 'Checked Nov 16, 2026.' }]
    })
    expect(stated).toContain('$10 each after a first study')
    expect(stated).toContain('Join User Interviews')
    expect(stated.indexOf('$10')).toBeLessThan(stated.indexOf('$30'))
    expect(stated).not.toContain('--')

    const variable = renderStoreMarkdown({
      name: 'Lyft',
      slug: 'lyft',
      description: '   ',
      bonus: {
        slug: 'lyft',
        provider: 'Lyft',
        amount: null,
        headline: 'New-rider credit varies by city',
        condition: 'Check the app.',
        ctaLabel: 'Join Lyft',
        referralUrl: 'https://www.lyft.com/i/VADIM53422?utm_medium=2pi_iacc',
        sourceUrl: 'https://www.lyft.com/terms/referrals',
        checkedAt: '2026-11-09'
      },
      termsUrl: null,
      offers: [{ title: 'Ride credit', previewText: 'Market specific.', terms: null }]
    })
    expect(variable).toContain('New-rider credit varies by city')
    expect(variable).not.toContain('## About')

    const plain = renderStoreMarkdown({
      name: 'Example',
      slug: 'example',
      description: null,
      bonus: null,
      termsUrl: 'https://example.com/terms',
      offers: []
    })
    expect(plain).toContain('not verified')
    expect(plain).toContain('https://example.com/terms')

    const quieter = renderStoreMarkdown({
      name: 'Example',
      slug: 'example',
      description: null,
      bonus: null,
      termsUrl: null,
      offers: []
    })
    expect(quieter).not.toContain('Official program terms')
  })

  it('serves markdown by kind and omits unlisted stores', async () => {
    expect(await markdownByKind('guides', 'rakuten-vs-topcashback')).toContain('# Rakuten vs TopCashback')
    expect(await markdownByKind('guides', 'missing')).toBeNull()
    expect(await markdownByKind('articles', 'chime-1000-two-friends')).toContain('Chime')
    expect(await markdownByKind('articles', 'missing')).toBeNull()
    expect(await markdownByKind('stores', 'user-interviews')).toContain('Join User Interviews')
    expect(await markdownByKind('stores', 'uber')).toBeNull()
    expect(await markdownByKind('other', 'rakuten')).toBeNull()
    const store = await storeMarkdownBySlug('user-interviews')
    expect(store).toContain('Join User Interviews')
    expect(store).toContain('https://www.userinterviews.com/r/kdqtpxzqk')
    expect(await storeMarkdownBySlug('uber')).toBeNull()
    expect(await storeMarkdownBySlug('missing-store')).toBeNull()
    const full = await buildLlmsFullTxt()
    expect(full).toContain('# BonusBridge')
    expect(full).toContain('# Promo codes and limited-time offers')
    expect(full).toContain('No promo codes are listed right now.')
    expect(full).toContain('/guides/rakuten-referral-bonus-how-it-works')
    expect(full).toContain('/stores/user-interviews')
    expect(full).not.toContain(EM_DASH)
    expect(full).not.toContain('--')
    expect(referralTermsUrl('user-interviews')).toContain('support.userinterviews.com')
    expect(referralTermsUrl('airbnb')).toBeNull()
    expect(referralTermsUrl('missing-store')).toBeNull()
    const graph = articleJsonLd(chimeArticleDocument, {
      title: 'Chime',
      description: 'Rules.',
      publishedAt: '2026-11-05T18:00:00.000Z'
    })['@graph'] as { '@type': string }[]
    expect(graph.map((node) => node['@type'])).toEqual(['BreadcrumbList', 'Article', 'FAQPage'])
    const withoutFaq = articleJsonLd({ ...chimeArticleDocument, faqs: [] }, {
      title: 'Chime',
      description: 'Rules.',
      publishedAt: '2026-11-05T18:00:00.000Z'
    })['@graph'] as { '@type': string }[]
    expect(withoutFaq.map((node) => node['@type'])).toEqual(['BreadcrumbList', 'Article'])
  })
})
