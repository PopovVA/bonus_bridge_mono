import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CouponCopyButton } from '@/components/coupon-copy-button'
import { EmptyState } from '@/components/empty-state'
import { getCategories, getOffers, getServices } from '@/lib/site-data'

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

  const offersByService = new Map<string, (typeof offers)[number][]>()
  for (const o of offers) {
    const cur = offersByService.get(o.serviceId) ?? []
    cur.push(o)
    offersByService.set(o.serviceId, cur)
  }

  return (
    <section className="category-page-section" aria-labelledby="category-page-heading">
      <header className="category-page-head section-head">
        <h1 id="category-page-heading" className="section-title app-serif-page-title">
          {cat.name}
        </h1>
        <p className="section-subtitle category-page-subtitle">
          Stores in this category and their active promo codes and offers.
        </p>
      </header>

      {stores.length === 0 ? (
        <EmptyState message="No stores in this category yet." />
      ) : (
        <div className="category-stores-list">
          {stores.map((store) => {
            const storeOffers = offersByService.get(store.id) ?? []
            return (
              <article key={store.id} className="app-surface-card category-store-card">
                <h2 className="category-store-title">
                  {store.logoSrc ? (
                    <span className="category-store-logo-wrap" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={store.logoSrc}
                        alt=""
                        width={32}
                        height={32}
                        className="category-store-logo"
                        decoding="async"
                      />
                    </span>
                  ) : null}
                  <Link href={`/stores/${store.slug}`}>{store.name}</Link>
                </h2>
                {store.description ? (
                  <p className="default-muted-text">{store.description}</p>
                ) : null}
                <p className="default-muted-text" style={{ marginTop: 8 }}>
                  <Link href={`/stores/${store.slug}`}>View store page</Link>
                </p>

                {storeOffers.length === 0 ? (
                  <p className="default-muted-text" style={{ marginTop: 12 }}>
                    No active offers listed yet. Check the store page for updates.
                  </p>
                ) : (
                  <ul className="category-store-offers">
                    {storeOffers.map((offer) => {
                      const copyValue = offer.couponCode?.trim() ? offer.couponCode : offer.referralUrl
                      return (
                        <li key={offer.id}>
                          <h3 className="category-offer-title">
                            <Link href={`/coupons/${offer.id}`}>{offer.title}</Link>
                          </h3>
                          <p className="category-offer-preview">{offer.previewText}</p>
                          <div className="category-offer-actions">
                            {offer.couponCode ? (
                              <span className="category-offer-pill">Code: {offer.couponCode}</span>
                            ) : null}
                            <a href={offer.referralUrl} target="_blank" rel="noreferrer">
                              Open offer
                            </a>
                            <CouponCopyButton
                              value={copyValue}
                              label={offer.couponCode ? 'Copy code' : 'Copy link'}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
