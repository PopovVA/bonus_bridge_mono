import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EmptyState } from '@/components/empty-state'
import { TrackedLink } from '@/components/tracked-link'
import type { Offer, Service } from '@/lib/schemas'
import { getCategories, getOffers, getServices } from '@/lib/site-data'

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
    return { title: 'Category | BonusBridge' }
  }
  return {
    title: `${cat.name} stores | BonusBridge`,
    description: `Browse stores and promo codes in ${cat.name}.`
  }
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

  const offersByService = new Map<string, Offer[]>()
  for (const o of offers) {
    const cur = offersByService.get(o.serviceId) ?? []
    cur.push(o)
    offersByService.set(o.serviceId, cur)
  }

  return (
    <section className="category-page-section" aria-labelledby="category-page-heading">
      <header className="category-page-head section-head">
        <h1 id="category-page-heading" className="section-title app-page-title">
          {cat.name}
        </h1>
        <p className="section-subtitle category-page-subtitle">
          Stores in this category — open a store page for promo codes and partner offers.
        </p>
      </header>

      {stores.length === 0 ? (
        <EmptyState message="No stores in this category yet." />
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
                          <span className="category-store-name">{store.name}</span>
                        </h2>
                        <p className="category-store-desc">{blurb}</p>
                        <p className="category-store-count default-muted-text">
                          {activeOfferCountLabel(storeOffers)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="category-store-row-cta">
                    <TrackedLink
                      href={`/stores/${store.slug}`}
                      className="category-store-cta"
                      event="category_view_store"
                      eventParams={{ store_slug: store.slug }}
                    >
                      View store
                    </TrackedLink>
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
