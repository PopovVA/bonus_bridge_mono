import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticlePartnerFigure } from '@/components/article-partner-figure'
import { ArticleReferralDisclosure } from '@/components/article-referral-disclosure'
import { ArticleViewTracker } from '@/components/article-view-tracker'
import { StoreRelatedPanel } from '@/components/store-related-panel'
import { TrackedOutboundLink } from '@/components/tracked-link'
import { absoluteUrl } from '@/app/seo'
import { CHIME_INVITE_FRIENDS_TERMS_URL, CHIME_PARTNER_REFERRAL_URL } from '@/lib/chime-article-constants'
import { articleList } from '@/lib/articles/list'
import { CHIME_TRADEMARK_NOTICE, FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { getCategories, getServiceBySlug } from '@/lib/site-data'

const SLUG = 'chime-1000-two-friends'
const UPDATED = '2026-11-05T18:00:00.000Z'

const chimeArticle = articleList.find((a) => a.slug === SLUG)!

const faqs = [
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
]

export async function generateMetadata(): Promise<Metadata> {
  const title = chimeArticle.title
  const description = chimeArticle.description

  const ogImage = '/articles/chime/referral-steps.png'
  const pageUrl = absoluteUrl(`/articles/${SLUG}`)

  return {
    title: { absolute: `${title} | BonusBridge` },
    description,
    keywords: [
      'Chime referral',
      'Chime direct deposit requirements',
      'Chime referral cap',
      'qualifying direct deposit',
      'referral offer terms'
    ],
    alternates: {
      canonical: `/articles/${SLUG}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: chimeArticle.publishedAt,
      modifiedTime: UPDATED,
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 605,
          height: 340,
          alt: 'Chime referral steps: share a link, qualifying direct deposit, card activation'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export default async function ChimeArticlePage() {
  const [store, categoriesResult] = await Promise.all([
    Promise.resolve()
      .then(() => getServiceBySlug('chime'))
      .catch(() => null),
    Promise.resolve()
      .then(() => getCategories())
      .catch(() => [] as Awaited<ReturnType<typeof getCategories>>)
  ])
  const categories = Array.isArray(categoriesResult) ? categoriesResult : []
  const primaryCategorySlug = store ? categories.find((c) => c.id === store.categoryId)?.slug ?? null : null

  const pageUrl = absoluteUrl(`/articles/${SLUG}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Articles', item: absoluteUrl('/articles') },
          { '@type': 'ListItem', position: 3, name: chimeArticle.title, item: pageUrl }
        ]
      },
      {
        '@type': 'Article',
        headline: chimeArticle.title,
        description: chimeArticle.description,
        datePublished: chimeArticle.publishedAt,
        dateModified: UPDATED,
        url: pageUrl,
        author: { '@type': 'Organization', name: 'BonusBridge' },
        publisher: { '@type': 'Organization', name: 'BonusBridge' },
        image: [absoluteUrl('/articles/chime/referral-steps.png'), absoluteUrl('/articles/chime/chime-building.png')],
        mainEntityOfPage: pageUrl
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  }

  return (
    <>
      <ArticleViewTracker slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="article-page">
        <header className="article-page__header" id="article-top">
          <p className="article-page__eyebrow">Informational Guides</p>
          <h1 className="article-page__title">{chimeArticle.title}</h1>
          <p className="article-page__meta">
            Updated{' '}
            <time dateTime={UPDATED}>
              {new Date(UPDATED).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })}
            </time>
          </p>
        </header>

        <ArticleReferralDisclosure />
        <p className="article-page__trademark-note">{CHIME_TRADEMARK_NOTICE}</p>

        <section className="article-page__section" aria-labelledby="chime-bonus-guide">
          <h2 id="chime-bonus-guide">What this page will and will not say</h2>
          <p className="article-page__lede">
            This article explains Chime’s standard referral rules. It does not promise a payout, and it does not multiply
            a per-friend amount into a four-figure total. The URL still uses an older slug so existing links keep working.
            The rules below are the ones to verify on Chime.
          </p>
          <p>
            A longer checklist is on the{' '}
            <Link href="/guides/chime-referral-requirements">Chime referral requirements guide</Link>.
          </p>
        </section>

        <section className="article-page__section" aria-labelledby="how-it-works">
          <h2 id="how-it-works">How the standard referral works</h2>
          <ArticlePartnerFigure
            articleSlug={SLUG}
            imageKey="referral_steps"
            src="/articles/chime/referral-steps.webp"
            alt="Chime invite screen showing a referral link and the steps Chime asks a new member to finish"
            width={605}
            height={340}
            sizes="(max-width: 640px) min(400px, 100vw), min(605px, calc(100vw - 48px))"
            priority
          />
          <ul className="article-page__list">
            <li>The invited person opens an account from the current referral link.</li>
            <li>They receive a qualifying direct deposit of at least $200 within 45 days.</li>
            <li>They activate the Chime debit card. Chime has also described a 14-day window after that deposit for the physical card.</li>
            <li>Chime confirms the steps. The referrer bonus is the amount set when that member enrolled, not a number this site guarantees.</li>
            <li>Successful referrals are capped at 10 per calendar year.</li>
          </ul>
          <p>
            Payroll, government benefits, and similar ACH deposits are the kind of deposit Chime treats as qualifying.
            Transfers from Venmo, PayPal, Cash App, Zelle, or a friend do not count as that direct deposit.
          </p>
          <ArticlePartnerFigure
            articleSlug={SLUG}
            imageKey="building"
            src="/articles/chime/chime-building.webp"
            alt="Chime wordmark on a modern office building exterior"
            width={605}
            height={404}
            sizes="(max-width: 640px) min(400px, 100vw), min(605px, calc(100vw - 48px))"
            partnerOfferCta
            caption="Confirm the live steps on Chime. The image opens Chime in a new tab."
          />
        </section>

        <section className="article-page__section" aria-labelledby="requirements">
          <h2 id="requirements">Requirements</h2>
          <ul className="article-page__list">
            <li>Qualifying direct deposit of at least $200 within 45 days.</li>
            <li>Debit card activation.</li>
            <li>No more than 10 successful referrals in the calendar year.</li>
            <li>Chime’s help center has described a $100 bonus for the invited member after those steps. Confirm it on the live page.</li>
            <li>The referrer amount is variable. Do not budget a fixed figure from an expired promotion.</li>
          </ul>
          <p>{FTC_AFFILIATE_DISCLOSURE}</p>
          <p>
            <TrackedOutboundLink
              href={CHIME_PARTNER_REFERRAL_URL}
              className="category-store-cta article-page__offer-cta"
              target="_blank"
              rel="noopener noreferrer sponsored"
              event="article_chime_partner_cta"
              eventParams={{ article_slug: SLUG, cta_place: 'requirements' }}
            >
              View offer details
            </TrackedOutboundLink>
          </p>
        </section>

        <section className="article-page__section" aria-labelledby="important-to-understand">
          <h2 id="important-to-understand">Important to understand</h2>
          <p>
            Chime is a financial technology company, not a bank. Banking services are provided by partner banks.
            BonusBridge is not affiliated with Chime. Bonuses can be taxable. None of the steps above pay out just
            because an account was opened.
          </p>
        </section>

        <section className="article-page__section" aria-labelledby="chime-faq">
          <h2 id="chime-faq">Questions</h2>
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        <section
          className="article-page__disclaimer app-surface-card"
          aria-labelledby="editorial-legal-disclaimer"
        >
          <h2 className="article-page__disclaimer-title" id="editorial-legal-disclaimer">
            Editorial & legal disclaimer
          </h2>
          <p>
            BonusBridge publishes independent educational summaries. We are not a bank, broker, or tax advisor, and we are
            not affiliated with Chime. Offers change. Read Chime’s current help article before you share a number.
          </p>
          <p>
            <TrackedOutboundLink
              href={CHIME_INVITE_FRIENDS_TERMS_URL}
              className="article-page__terms-link"
              event="article_chime_terms"
              eventParams={{ article_slug: SLUG }}
              rel="noopener noreferrer"
              target="_blank"
            >
              See Chime’s standard referral help
            </TrackedOutboundLink>
          </p>
        </section>

        <div className="article-page__explore" id="explore-more">
          <StoreRelatedPanel storeSlug="chime" primaryCategorySlug={primaryCategorySlug} />
        </div>
      </article>
    </>
  )
}
