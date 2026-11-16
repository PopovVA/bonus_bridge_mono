import { absoluteUrl } from '@/app/seo'
import { CHIME_INVITE_FRIENDS_TERMS_URL } from '@/lib/chime-article-constants'
import { CHIME_TRADEMARK_NOTICE, REFERRAL_GUIDE_DISCLOSURE } from '@/lib/site-disclaimers'

export type ArticleInline = { kind: 'text'; text: string } | { kind: 'link'; href: string; label: string }

export type ArticleFigure = {
  imageKey: 'referral_steps' | 'building'
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  priority?: boolean
  caption?: string
  partnerOfferCta?: boolean
}

export type ArticleBlock =
  | { type: 'p'; parts: ArticleInline[]; lede?: boolean }
  | { type: 'ul'; items: string[] }
  | { type: 'figure'; figure: ArticleFigure }
  | { type: 'disclosure' }
  | { type: 'cta'; slug: string; place: string }
  | { type: 'faqs' }
  | { type: 'terms'; href: string; label: string; event: string }

export type ArticleSection = {
  id: string
  heading: string
  blocks: ArticleBlock[]
  variant?: 'disclaimer'
}

export type ArticleFaq = { question: string; answer: string }

export type ArticleDocument = {
  slug: string
  updatedAt: string
  keywords: string[]
  disclosure: string
  trademark: string
  ogImage: { src: string; width: number; height: number; alt: string }
  jsonLdImages: string[]
  sections: ArticleSection[]
  faqs: ArticleFaq[]
}

const FIGURE_SIZES = '(max-width: 640px) min(400px, 100vw), min(605px, calc(100vw - 48px))'

export const chimeArticleDocument: ArticleDocument = {
  slug: 'chime-1000-two-friends',
  updatedAt: '2026-11-05T18:00:00.000Z',
  keywords: [
    'Chime referral',
    'Chime direct deposit requirements',
    'Chime referral cap',
    'qualifying direct deposit',
    'referral offer terms'
  ],
  disclosure: REFERRAL_GUIDE_DISCLOSURE,
  trademark: CHIME_TRADEMARK_NOTICE,
  ogImage: {
    src: '/articles/chime/referral-steps.png',
    width: 605,
    height: 340,
    alt: 'Chime referral steps: share a link, qualifying direct deposit, card activation'
  },
  jsonLdImages: ['/articles/chime/referral-steps.png', '/articles/chime/chime-building.png'],
  faqs: [
    {
      question: 'What direct deposit qualifies?',
      answer:
        'A payroll, benefits, or other qualifying ACH deposit of at least $200 within 45 days. Peer-to-peer transfers such as Venmo, PayPal, Cash App, and Zelle do not count.'
    },
    {
      question: 'How many referrals can post in a year?',
      answer: 'Chime’s standard program caps successful referrals at 10 per calendar year.'
    },
    {
      question: 'Is there a guaranteed referrer dollar amount?',
      answer:
        'No. The referrer bonus is set when the invited member enrolls. Older promotions used different amounts and should not be treated as the current standard offer.'
    }
  ],
  sections: [
    {
      id: 'chime-bonus-guide',
      heading: 'What this page will and will not say',
      blocks: [
        {
          type: 'p',
          lede: true,
          parts: [
            {
              kind: 'text',
              text: 'This article explains Chime’s standard referral rules. It does not promise a payout, and it does not multiply a per-friend amount into a four-figure total. The URL still uses an older slug so existing links keep working. The rules below are the ones to verify on Chime.'
            }
          ]
        },
        {
          type: 'p',
          parts: [
            { kind: 'text', text: 'A longer checklist is on the ' },
            { kind: 'link', href: '/guides/chime-referral-requirements', label: 'Chime referral requirements guide' },
            { kind: 'text', text: '.' }
          ]
        }
      ]
    },
    {
      id: 'how-it-works',
      heading: 'How the standard referral works',
      blocks: [
        {
          type: 'figure',
          figure: {
            imageKey: 'referral_steps',
            src: '/articles/chime/referral-steps.webp',
            alt: 'Chime invite screen showing a referral link and the steps Chime asks a new member to finish',
            width: 605,
            height: 340,
            sizes: FIGURE_SIZES,
            priority: true
          }
        },
        {
          type: 'ul',
          items: [
            'The invited person opens an account from the current referral link.',
            'They receive a qualifying direct deposit of at least $200 within 45 days.',
            'They activate the Chime debit card. Chime has also described a 14-day window after that deposit for the physical card.',
            'Chime confirms the steps. The referrer bonus is the amount set when that member enrolled, not a number this site guarantees.',
            'Successful referrals are capped at 10 per calendar year.'
          ]
        },
        {
          type: 'p',
          parts: [
            {
              kind: 'text',
              text: 'Payroll, government benefits, and similar ACH deposits are the kind of deposit Chime treats as qualifying. Transfers from Venmo, PayPal, Cash App, Zelle, or a friend do not count as that direct deposit.'
            }
          ]
        },
        {
          type: 'figure',
          figure: {
            imageKey: 'building',
            src: '/articles/chime/chime-building.webp',
            alt: 'Chime wordmark on a modern office building exterior',
            width: 605,
            height: 404,
            sizes: FIGURE_SIZES,
            partnerOfferCta: true,
            caption: 'Confirm the live steps on Chime. The image opens Chime in a new tab.'
          }
        }
      ]
    },
    {
      id: 'requirements',
      heading: 'Requirements',
      blocks: [
        {
          type: 'ul',
          items: [
            'Qualifying direct deposit of at least $200 within 45 days.',
            'Debit card activation.',
            'No more than 10 successful referrals in the calendar year.',
            'Chime’s help center has described a $100 bonus for the invited member after those steps. Confirm it on the live page.',
            'The referrer amount is variable. Do not budget a fixed figure from an expired promotion.'
          ]
        },
        { type: 'disclosure' },
        { type: 'cta', slug: 'chime', place: 'article_chime_requirements' }
      ]
    },
    {
      id: 'important-to-understand',
      heading: 'Important to understand',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              kind: 'text',
              text: 'Chime is a financial technology company, not a bank. Banking services are provided by partner banks. BonusBridge is not affiliated with Chime. Bonuses can be taxable. None of the steps above pay out just because an account was opened.'
            }
          ]
        }
      ]
    },
    {
      id: 'chime-faq',
      heading: 'Questions',
      blocks: [{ type: 'faqs' }]
    },
    {
      id: 'editorial-legal-disclaimer',
      heading: 'Editorial & legal disclaimer',
      variant: 'disclaimer',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              kind: 'text',
              text: 'BonusBridge publishes independent educational summaries. We are not a bank, broker, or tax advisor, and we are not affiliated with Chime. Offers change. Read Chime’s current help article before you share a number.'
            }
          ]
        },
        {
          type: 'terms',
          href: CHIME_INVITE_FRIENDS_TERMS_URL,
          label: 'See Chime’s standard referral help',
          event: 'article_chime_terms'
        }
      ]
    }
  ]
}

export const articleDocuments: ArticleDocument[] = [chimeArticleDocument]

export function getArticleDocument(slug: string): ArticleDocument | undefined {
  return articleDocuments.find((doc) => doc.slug === slug)
}

export function articleJsonLd(
  doc: ArticleDocument,
  input: { title: string; description: string; publishedAt: string }
) {
  const pageUrl = absoluteUrl(`/articles/${doc.slug}`)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: absoluteUrl('/articles') },
        { '@type': 'ListItem', position: 3, name: input.title, item: pageUrl }
      ]
    },
    {
      '@type': 'Article',
      headline: input.title,
      description: input.description,
      datePublished: input.publishedAt,
      dateModified: doc.updatedAt,
      url: pageUrl,
      author: { '@type': 'Organization', name: 'BonusBridge' },
      publisher: { '@type': 'Organization', name: 'BonusBridge' },
      image: doc.jsonLdImages.map((src) => absoluteUrl(src)),
      mainEntityOfPage: pageUrl
    }
  ]
  if (doc.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: doc.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
