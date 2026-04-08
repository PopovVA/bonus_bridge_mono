import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { CouponCopyButton } from '@/components/coupon-copy-button'
import { getOffers, getServiceBySlug } from '@/lib/site-data'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await getServiceBySlug(slug).catch(() => null)
  if (!store) {
    return { title: 'Store not found | BonusBridge' }
  }

  return {
    title: `${store.name} | BonusBridge`,
    description: `Promo codes and offers for ${store.name}.`
  }
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params
  const [store, coupons] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getOffers({ service: slug, status: 'active' }).catch(() => [])
  ])

  if (!store) {
    return <EmptyState message="Store not found." />
  }

  return (
    <section className="category-page-section" aria-labelledby="store-page-heading">
      <article className="app-surface-card store-page-hero">
        <h1 id="store-page-heading" className="section-title app-page-title">
          {store.name}
        </h1>
        <div className="store-page-meta-row">
          {store.logoSrc ? (
            <img
              src={store.logoSrc}
              alt=""
              width={40}
              height={40}
              className="store-page-logo-img"
              decoding="async"
            />
          ) : store.logoSvg ? (
            <span
              className="store-icon store-page-logo"
              style={{
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(store.logoSvg)}")`
              }}
              aria-hidden
            />
          ) : null}
          {store.website ? (
            <a href={store.website} target="_blank" rel="noreferrer">
              Open store website
            </a>
          ) : (
            <span className="default-muted-text">Store link is not set</span>
          )}
        </div>
      </article>

      {coupons.length === 0 ? (
        <EmptyState message="No active promo codes or offers for this store yet." />
      ) : (
        <div className="category-stores-list store-coupons-block">
          <h2 className="section-title store-coupons-heading">Promo codes and offers</h2>
          {coupons.map((coupon) => {
            const copyValue = coupon.couponCode?.trim() ? coupon.couponCode : coupon.referralUrl

            return (
              <article key={coupon.id} className="app-surface-card">
                <h3 className="category-store-title">{coupon.title}</h3>
                <p className="category-offer-preview">{coupon.previewText}</p>
                <div className="category-offer-actions">
                  {coupon.couponCode ? (
                    <span className="category-offer-pill">Code: {coupon.couponCode}</span>
                  ) : null}
                  <a href={coupon.referralUrl} target="_blank" rel="noreferrer">
                    Open link
                  </a>
                  <CouponCopyButton value={copyValue} label={coupon.couponCode ? 'Copy code' : 'Copy link'} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
