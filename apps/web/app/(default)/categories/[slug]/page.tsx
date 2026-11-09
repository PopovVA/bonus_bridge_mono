import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl, pageSocialMetadata } from '@/app/seo'
import { notFound } from 'next/navigation'
import { EmptyState } from '@/components/empty-state'
import { TrackedLink } from '@/components/tracked-link'
import type { Offer, Service } from '@/lib/schemas'
import { getCategories, getOffers, getPublishedCategories, getServices } from '@/lib/site-data'
import { guidesForCategory } from '@/lib/guides'

const CATEGORY_STORE_DESC_FALLBACK =
  'This store is on BonusBridge so you can browse active promo codes and partner offers on its store page.'

function activeOfferCountLabel(offers: Offer[]) {
  const n = offers.length
  if (n === 0) return 'No active promo codes or offers.'
  const withCode = offers.filter((o) => Boolean(o.couponCode?.trim())).length
  const linkOnly = n - withCode
  const parts: string[] = []
  if (withCode > 0) {
    parts.push(`${withCode} promo code${withCode === 1 ? '' : 's'}`)
  }
  if (linkOnly > 0) {
    parts.push(`${linkOnly} offer${linkOnly === 1 ? '' : 's'}`)
  }
  return parts.join(' · ')
}

function CategoryStoreMark({ store }: { store: Service }) {
  if (store.logoSrc) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- static brand tiles */
      <img
        src={store.logoSrc}
        alt=""
        width={56}
        height={56}
        className="category-store-logo"
        decoding="async"
      />
    )
  }
  if (store.logoSvg) {
    return (
      <span
        className="category-store-logo-svg"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(store.logoSvg)}")`
        }}
        aria-hidden
      />
    )
  }
  return (
    <span className="category-store-logo-fallback" aria-hidden>
      {store.name.charAt(0)}
    </span>
  )
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const cats = await getCategories().catch(() => [])
  return cats.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cats = await getCategories().catch(() => [])
  const cat = cats.find((c) => c.slug === slug)
  if (!cat) {
    return { title: 'Category', robots: { index: false, follow: false } }
  }
  const published = await getPublishedCategories().catch(() => [])
  const meta = pageSocialMetadata({
    title: `${cat.name} store guides`,
    description: `Informational ${cat.name} store pages on BonusBridge. Current bonuses are not verified. Eligibility depends on the provider, your account, and your location.`,
    path: `/categories/${slug}`
  })
  /* A category without stores stays reachable by URL but should not be indexed. */
  return published.some((c) => c.slug === slug) ? meta : { ...meta, robots: { index: false, follow: true } }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cats = await getCategories().catch(() => [])
  const cat = cats.find((c) => c.slug === slug)
  if (!cat) {
    notFound()
  }

  const [stores, offers] = await Promise.all([
    getServices({ category: slug }).catch(() => []),
    getOffers({ category: slug, status: 'active' }).catch(() => [])
  ])

  const relatedGuides = guidesForCategory(slug)
  const otherCategories =
    stores.length === 0 ? (await getPublishedCategories().catch(() => [])).filter((c) => c.slug !== slug) : []
  const offersByService = new Map<string, Offer[]>()
  for (const o of offers) {
    const cur = offersByService.get(o.serviceId) ?? []
    cur.push(o)
    offersByService.set(o.serviceId, cur)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} stores`,
    description: `Informational ${cat.name} store pages. Current bonuses are not verified on BonusBridge.`,
    url: absoluteUrl(`/categories/${slug}`),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stores.length,
      itemListElement: stores.map((store, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: store.name,
        url: absoluteUrl(`/stores/${store.slug}`)
      }))
    }
  }

  return (
    <section className="category-page-section" aria-labelledby="category-page-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="category-page-head section-head">
        <h1 id="category-page-heading" className="section-title app-page-title">
          {cat.name}
        </h1>
        <p className="section-subtitle category-page-subtitle">
          Stores in this category. Open a store page for what BonusBridge currently publishes. Current bonus amounts are
          not verified here. Eligibility can depend on the provider, your account, and your location.
        </p>
      </header>

      {relatedGuides.length > 0 ? (
        <nav className="guide-page__links" aria-label="Related guides">
          {relatedGuides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              {guide.h1}
            </Link>
          ))}
        </nav>
      ) : null}
      {stores.length === 0 ? (
        <EmptyState
          title={`No ${cat.name.toLowerCase()} stores yet`}
          message="No stores in this category yet. BonusBridge only lists providers whose terms we can link to. Try a category that has stores, or read the guides."
          actions={[
            { href: '/articles', label: 'Read the guides' },
            ...otherCategories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name }))
          ]}
        />
      ) : (
        <div className="category-stores-list">
          {stores.map((store) => {
            const storeOffers = offersByService.get(store.id) ?? []
            const blurb = store.description?.trim() || CATEGORY_STORE_DESC_FALLBACK
            return (
              <article key={store.id} className="app-surface-card category-store-card">
                <div className="category-store-row">
                  <div className="category-store-row-main">
                    <div className="category-store-head">
                      <div className="category-store-logo-wrap">
                        <CategoryStoreMark store={store} />
                      </div>
                      <div className="category-store-head-text">
                        <h2 className="category-store-title">
                          {/* Stretched link: the whole card is the click target, one link per card for screen readers */}
                          <TrackedLink
                            href={`/stores/${store.slug}`}
                            className="category-store-link"
                            event="category_view_store"
                            eventParams={{ store_slug: store.slug }}
                          >
                            <span className="category-store-name">{store.name}</span>
                          </TrackedLink>
                        </h2>
                        <p className="category-store-desc">{blurb}</p>
                        <p className="category-store-count default-muted-text">
                          {activeOfferCountLabel(storeOffers)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="category-store-row-cta" aria-hidden="true">
                    <span className="category-store-cta">View store</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
