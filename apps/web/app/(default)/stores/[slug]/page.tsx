import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { absoluteUrl } from '@/app/seo'
import { EmptyState } from '@/components/empty-state'
import { StorePageOpenPartnerLink } from '@/components/store-page-open-partner-link'
import { SiteDisclosure } from '@/components/site-disclosure'
import { StoreTopOffers } from '@/components/store-top-offers'
import { StoreRelatedPanel } from '@/components/store-related-panel'
import { getCategories, getOffers, getServiceBySlug, megaMenuStoreImageSrc } from '@/lib/site-data'

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
  return {
    title: store.name,
    description: blurb
      ? `${blurb} Review offer details and provider terms on BonusBridge.`
      : `Offer details and provider terms for ${store.name}.`,
    alternates: {
      canonical: `/stores/${slug}`
    }
  }
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
  const primaryPromo = coupons[0]
  const openStoreUrl = primaryPromo?.referralUrl ?? null
  const hasMainOffers = coupons.length > 0
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${store.name} offers`,
    description: aboutText,
    url: absoluteUrl(`/stores/${slug}`)
  }

  return (
    <section className="category-page-section store-page" aria-labelledby="store-page-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="app-surface-card store-page-hero">
        <h1 id="store-page-heading" className="sr-only">
          {store.name}
        </h1>
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
            {openStoreUrl ? (
              <StorePageOpenPartnerLink href={openStoreUrl} storeSlug={slug}>
                See provider details
              </StorePageOpenPartnerLink>
            ) : null}
          </div>
        </div>
      </article>
      <SiteDisclosure className="site-disclosure--store" />

      {coupons.length > 0 ? (
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
            offers={coupons}
          />
        </div>
      ) : null}

      {!hasMainOffers ? (
        <EmptyState message="No active promo codes or offers for this store yet." />
      ) : null}

      <StoreRelatedPanel storeSlug={slug} primaryCategorySlug={primaryCategorySlug} />
    </section>
  )
}
