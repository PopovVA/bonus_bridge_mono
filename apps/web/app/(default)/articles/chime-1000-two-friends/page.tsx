import type { Metadata } from 'next'
import { ArticlePartnerFigure } from '@/components/article-partner-figure'
import { ArticleViewTracker } from '@/components/article-view-tracker'
import { ChimeReferralCalculator } from '@/components/chime-referral-calculator'
import { StoreRelatedPanel } from '@/components/store-related-panel'
import { TrackedOutboundLink } from '@/components/tracked-link'
import { absoluteUrl } from '@/app/seo'
import { CHIME_INVITE_FRIENDS_TERMS_URL, CHIME_PARTNER_REFERRAL_URL } from '@/lib/chime-article-constants'
import {
  CHIME_DIRECT_DEPOSIT_BONUS_USD,
  CHIME_FRIEND_BONUS_USD,
  CHIME_REFERRER_PER_FRIEND_USD
} from '@/lib/chime-referral-calculator'
import { articleList } from '@/lib/articles/list'
import { getCategories, getServiceBySlug } from '@/lib/site-data'

const SLUG = 'chime-1000-two-friends'

const chimeArticle = articleList.find((a) => a.slug === SLUG)!

const modeledTwoFriendTotalUsd = 2 * CHIME_REFERRER_PER_FRIEND_USD + CHIME_DIRECT_DEPOSIT_BONUS_USD

export async function generateMetadata(): Promise<Metadata> {
  const title = chimeArticle.title
  const description = chimeArticle.description

  const ogImage = '/articles/chime/referral-steps.png'
  const pageUrl = absoluteUrl(`/articles/${SLUG}`)

  return {
    title,
    description,
    keywords: [
      'Chime referral',
      'Chime invite bonus',
      'bank referral bonus',
      'direct deposit bonus',
      'referral calculator',
      'profit calculator',
      'digital bank bonus',
      'earn money from home',
      'Chime $300',
      'Chime $400',
      'Chime $1,000'
    ],
    alternates: {
      canonical: `/articles/${SLUG}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: chimeArticle.publishedAt,
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 605,
          height: 340,
          alt: 'Chime referral program steps: share link, direct deposit, bonuses'
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

  const published = chimeArticle.publishedAt
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: chimeArticle.title,
    description: chimeArticle.description,
    datePublished: published,
    dateModified: published,
    url: absoluteUrl(`/articles/${SLUG}`),
    keywords: [
      'Chime',
      'Chime referral',
      'direct deposit bonus',
      'digital banking',
      'bank partner program',
      'referral calculator',
      'work from home'
    ],
    about: [{ '@type': 'Thing', name: 'Chime' }, { '@type': 'Thing', name: 'Referral marketing' }],
    author: {
      '@type': 'Organization',
      name: 'BonusBridge'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BonusBridge'
    },
    image: [absoluteUrl('/articles/chime/referral-steps.png'), absoluteUrl('/articles/chime/chime-building.png')],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/articles/${SLUG}`)
    },
    isAccessibleForFree: true
  }

  return (
    <>
      <ArticleViewTracker slug={SLUG} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="article-page">
        <header className="article-page__header" id="article-top">
          <p className="article-page__eyebrow">Money Guides</p>
          <h1 className="article-page__title">{chimeArticle.title}</h1>
          <p className="article-page__meta">
            Updated{' '}
            <time dateTime={published}>{new Date(published).toLocaleDateString('en-US', { dateStyle: 'long' })}</time>
          </p>
        </header>

        <section className="article-page__section" aria-labelledby="chime-bonus-guide-heading">
          <h2 id="chime-bonus-guide">Chime Bonus Guide</h2>
          <p className="article-page__lede">
            Landing this kind of payout is honestly straightforward. You are not limited to two friends. When more people
            you refer finish the steps the offer requires, your outcome can grow until you hit the program caps—the
            maximum bonuses and limits Chime sets for the promotion. Chime is one of the best-known digital banking brands
            in the United States, with a reputation for simple checking, early pay, and clear fees. This piece opens our
            series on bank partner programs you can handle from home with realistic numbers and links to official rules.
          </p>
        </section>

        <section className="article-page__section" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works">How It Works</h2>
          <ArticlePartnerFigure
            articleSlug={SLUG}
            imageKey="referral_steps"
            src="/articles/chime/referral-steps.png"
            alt="Chime invite screen showing referral link and step-by-step instructions"
            width={605}
            height={340}
            sizes="(max-width: 640px) min(400px, 100vw), min(605px, calc(100vw - 48px))"
            priority
          />
          <p>At a high level, the referral path looks like this:</p>
          <ul className="article-page__list">
            <li>You join through a referral link and meet the new-member requirements in the current offer.</li>
            <li>You share your personal invite link so friends can open accounts.</li>
            <li>Each friend completes what Chime counts as a qualifying direct deposit, if the offer requires it.</li>
            <li>Bonuses post when Chime confirms eligibility—amounts, timing, and caps follow the official terms.</li>
          </ul>
          <p>
            Competition for banking and money apps in the United States is intense, and customer acquisition spending in
            fintech runs high compared with many other sectors. Chime is a public company, and its regular filings show
            multi-year revenue growth. That growth helps explain how the business can fund attractive sign-up and referral
            offers while it fights for long-term account relationships.
          </p>
          <p>
            None of that means a bonus is automatic for you. It simply explains why a trusted brand still offers cash
            bonuses alongside the product.
          </p>
          <ArticlePartnerFigure
            articleSlug={SLUG}
            imageKey="building"
            src="/articles/chime/chime-building.png"
            alt="Chime wordmark on a modern office building exterior"
            width={605}
            height={404}
            sizes="(max-width: 640px) min(400px, 100vw), min(605px, calc(100vw - 48px))"
            partnerOfferCta
            caption="Stick to Chime's published terms for your region. Tap the image to open our partner offer in a new tab."
          />
        </section>

        <section className="article-page__section" aria-labelledby="profit-calculator-heading">
          <h2 id="profit-calculator">Profit Calculator</h2>
          <p>
            We built the Profit Calculator so you can skip the scratch pad. If you open through a referral and{' '}
            <strong>two friends</strong> set up qualifying direct deposits, the public structure we model lands around{' '}
            <strong>${modeledTwoFriendTotalUsd.toLocaleString('en-US')}</strong> for you when you also count your own{' '}
            <strong>${CHIME_DIRECT_DEPOSIT_BONUS_USD}</strong> direct deposit bonus as a new member who qualifies. You
            can invite more than two people. Use the friend count and the direct deposit toggle below to see how the
            estimate shifts.
          </p>
          <p>
            Chime advertises up to <strong>${CHIME_REFERRER_PER_FRIEND_USD}</strong> per qualifying friend for you,{' '}
            <strong>${CHIME_FRIEND_BONUS_USD}</strong> for each friend, and the separate{' '}
            <strong>${CHIME_DIRECT_DEPOSIT_BONUS_USD}</strong> welcome bonus for you when direct deposit rules are met.
            Promotions change, so treat the tool as a snapshot of the structure we describe on the page.
          </p>
          <div className="article-page__calculator-wrap">
            <ChimeReferralCalculator articleSlug={SLUG} showHeading={false} showLead={false} />
            <div className="article-page__calculator-cta">
              <TrackedOutboundLink
                href={CHIME_PARTNER_REFERRAL_URL}
                className="category-store-cta article-page__offer-cta"
                target="_blank"
                rel="noopener noreferrer sponsored"
                event="article_chime_partner_cta"
                eventParams={{ article_slug: SLUG, cta_place: 'after_calculator' }}
              >
                Get Chime Offer
              </TrackedOutboundLink>
            </div>
          </div>
        </section>

        <section className="article-page__section" aria-labelledby="requirements-heading">
          <h2 id="requirements">Requirements</h2>
          <p>
            Before you rely on any estimate, confirm what the official invite terms require in your region and for this
            offer window.
          </p>
          <ul className="article-page__list">
            <li>Confirm you are on the latest invite terms for your region and offer window.</li>
            <li>Verify what counts as a qualifying direct deposit and the minimum amount.</li>
            <li>Remember tax reporting. Bonuses may be reported as required by law.</li>
          </ul>
        </section>

        <section className="article-page__section" aria-labelledby="important-to-understand-heading">
          <h2 id="important-to-understand">Important to understand</h2>
          <p>
            The Profit Calculator is <strong>not</strong> a guarantee of what you will earn. It is a planning aid that
            turns today&apos;s public offer outline into a quick estimate. Real payouts depend on approval, timing, and
            whether each friend satisfies the rules.
          </p>
          <ul className="article-page__list">
            <li>Treat the calculator as planning help, not a promise of approval or payout timing.</li>
          </ul>
        </section>

        <section
          className="article-page__disclaimer app-surface-card"
          aria-labelledby="editorial-legal-disclaimer-heading"
        >
          <h2 className="article-page__disclaimer-title" id="editorial-legal-disclaimer">
            Editorial & legal disclaimer
          </h2>
          <p>
            BonusBridge publishes educational summaries. We are not a bank, broker, or tax advisor. Chime is a financial
            technology company, not a bank. Banking services are provided by partner banks. See Chime&apos;s site for current
            details. Offers change. Always read the official terms. BonusBridge may earn compensation when you use some
            partner links.
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
              View Chime invite-friends terms (official)
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
