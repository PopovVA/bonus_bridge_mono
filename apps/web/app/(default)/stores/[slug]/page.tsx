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
    description: `Referral links and coupons for ${store.name}.`
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
    <section>
      <p className="meta" style={{ marginTop: 0 }}>
        <Link href="/stores">Back to stores</Link>
      </p>
      <article className="card">
        <h1 className="title">{store.name}</h1>
        <div className="row">
          {store.logoSvg ? (
            <span
              className="store-icon"
              style={{
                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(store.logoSvg)}")`
              }}
              aria-hidden
            />
          ) : null}
          {store.website ? (
            <a href={store.website} target="_blank" rel="noreferrer">
              Open store
            </a>
          ) : (
            <span className="meta">Store link is not set</span>
          )}
        </div>
      </article>

      {coupons.length === 0 ? (
        <EmptyState message="No active coupons for this store yet." />
      ) : (
        <div className="list">
          <h2 className="section-title">Coupons</h2>
          {coupons.map((coupon) => {
            const copyValue = coupon.couponCode?.trim() ? coupon.couponCode : coupon.referralUrl

            return (
              <article key={coupon.id} className="card">
                <h3 className="section-title">{coupon.title}</h3>
                <p>{coupon.previewText}</p>
                <div className="row">
                  {coupon.couponCode ? <span className="pill">Code: {coupon.couponCode}</span> : null}
                </div>
                <div className="row" style={{ marginTop: 8 }}>
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
