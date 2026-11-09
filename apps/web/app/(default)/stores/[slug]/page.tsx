import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { absoluteUrl, pageSocialMetadata } from '@/app/seo'
import { ListingFacts } from '@/components/listing-facts'
import { formatCheckedDate, getSignupBonus } from '@/lib/signup-bonuses'
import { buildListingFacts, isNotPubliclyPromoted } from '@/lib/listing-facts'
import { BonusCta } from '@/components/bonus-cta'
import { EmptyState } from '@/components/empty-state'
import { StorePageOpenPartnerLink } from '@/components/store-page-open-partner-link'
import { SiteDisclosure } from '@/components/site-disclosure'
import { StoreTopOffers } from '@/components/store-top-offers'
import { StoreRelatedPanel } from '@/components/store-related-panel'
import { getCategories, getOffers, getServiceBySlug, megaMenuStoreImageSrc } from '@/lib/site-data'
import { guidesForStore } from '@/lib/guides'
import { getReferralProgram } from '@/lib/referral-programs'

const STORE_PAGE_FALLBACK_BLURB =
  'This store is on BonusBridge so you can review referral and sign-up offer details in one place. Use the cards below to copy a code or link and open the provider page in a new tab.'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await getServiceBySlug(slug).catch(() => null)
  if (!store) {
    return { title: 'Store not found', robots: { index: false, follow: false } }
  }

  const blurb = store.description?.trim()
  const meta = pageSocialMetadata({
    title: store.name,
    description: blurb
      ? `${blurb} Current bonus amounts are not verified on BonusBridge.`
      : `Informational page for ${store.name}. Current bonus amounts are not verified on BonusBridge.`,
    path: `/stores/${slug}`
  })
  if (isNotPubliclyPromoted(slug)) {
    return { ...meta, robots: { index: false, follow: true } }
  }
  return meta
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params
  const [store, coupons, categories] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getOffers({ service: slug, status: 'active' }).catch(() => []),
    getCategories().catch(() => [])
  ])

  if (!store) {
    notFound()
  }

  const primaryCategorySlug = categories.find((c) => c.id === store.categoryId)?.slug ?? null
  const storeOfferLogoSrc = megaMenuStoreImageSrc({ logoSrc: store.logoSrc ?? null })
  const aboutText = store.description?.trim() || STORE_PAGE_FALLBACK_BLURB
  const hidePublicReferral = isNotPubliclyPromoted(slug)
  const program = getReferralProgram(slug)
  const bonus = hidePublicReferral ? null : getSignupBonus(slug)
  const relatedGuides = guidesForStore(slug)
  const visibleCoupons = hidePublicReferral ? [] : coupons
  const primaryPromo = visibleCoupons[0]
  const openStoreUrl = primaryPromo?.referralUrl ?? null
  const hasMainOffers = visibleCoupons.length > 0
  const facts = buildListingFacts({
    slug,
    terms: primaryPromo?.terms ?? null,
    listingUpdatedAt: primaryPromo?.updatedAt ?? store.updatedAt,
    quotedAmountNote: bonus?.amount
      ? `The ${bonus.amount} above is quoted from ${bonus.provider}’s official terms, checked ${formatCheckedDate(bonus.checkedAt)}.`
      : null
  })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${store.name} on BonusBridge`,
    description: aboutText,
    url: absoluteUrl(`/stores/${slug}`),
    dateModified: primaryPromo?.updatedAt ?? store.updatedAt
  }

  return (
    <section className="category-page-section store-page" aria-labelledby="store-page-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="app-surface-card store-page-hero">
        <h1 id="store-page-heading" className="store-page-title">
          {store.name}
        </h1>
        {bonus ? <BonusCta bonus={bonus} place="store_page" /> : null}
        <ListingFacts facts={facts} />
        <div className="store-page-hero-grid">
          <div className="store-page-hero-main">
            <div className="store-page-logo-box">
              {store.logoSrc ? (
                <img
                  src={store.logoSrc}
                  alt=""
                  width={120}
                  height={120}
                  className="store-page-logo-img"
                  decoding="async"
                />
              ) : store.logoSvg ? (
                <span
                  className="store-page-logo-svg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(store.logoSvg)}")`
                  }}
                  aria-hidden
                />
              ) : (
                <span className="store-page-logo-fallback" aria-hidden>
                  {store.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="store-page-hero-about">
            <h2 className="store-page-about-heading">About this store</h2>
            <p className="store-page-about-body">{aboutText}</p>
            <SiteDisclosure className="site-disclosure--store" />
            {openStoreUrl && !bonus ? (
              <StorePageOpenPartnerLink href={openStoreUrl} storeSlug={slug}>
                See provider details
              </StorePageOpenPartnerLink>
            ) : null}
            {program?.termsUrl ? (
              <a className="store-page-provider-link" href={program.termsUrl} target="_blank" rel="noopener noreferrer">
                Official program terms
              </a>
            ) : null}
            {hidePublicReferral && store.website ? (
              <a className="store-page-provider-link" href={store.website} target="_blank" rel="noopener noreferrer">
                Provider website
              </a>
            ) : null}
            {hidePublicReferral ? (
              <p className="store-page-about-body">
                This page does not include a personal referral link.{' '}
                <Link href="/disclosures">Read how we vet programs</Link>.
              </p>
            ) : null}
            {relatedGuides.length > 0 ? (
              <nav className="guide-page__links" aria-label="Related guides">
                {relatedGuides.map((guide) => (
                  <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                    {guide.h1}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </article>

      {visibleCoupons.length > 0 ? (
        <div className="store-top-offers-wrap clip-coupons-section store-page-clip-section">
          <div className="section-head clip-coupons-head">
            <h2 id="store-top-offers-heading" className="section-title">
              Top offers
            </h2>
          </div>
          <StoreTopOffers
            storeName={store.name}
            storeSlug={slug}
            storeLogoSrc={storeOfferLogoSrc}
            offers={visibleCoupons}
          />
        </div>
      ) : null}

      {!hasMainOffers ? (
        <EmptyState
          message={
            hidePublicReferral
              ? 'BonusBridge is not publishing a referral offer for this provider.'
              : 'No active promo codes or offers for this store yet.'
          }
        />
      ) : null}

      <StoreRelatedPanel storeSlug={slug} primaryCategorySlug={primaryCategorySlug} />
    </section>
  )
}
