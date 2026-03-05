import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { CouponCopyButton } from '@/components/coupon-copy-button'
import { getOffers, getServiceBySlug } from '@/lib/api-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug).catch(() => null)
  if (!service) {
    return { title: 'Service coupons not found | BonusBridge' }
  }

  return {
    title: `${service.name} coupons | BonusBridge`,
    description: `Active coupons and referral links for ${service.name}.`
  }
}

export default async function ServiceCouponsPage({ params }: Props) {
  const { slug } = await params
  const [service, coupons] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getOffers({ service: slug, status: 'active' }).catch(() => [])
  ])

  if (!service) {
    return <EmptyState message="Service not found or API is unavailable." />
  }

  return (
    <section>
      <p className="meta" style={{ marginTop: 0 }}>
        <Link href="/services">Back to services</Link>
      </p>
      <article className="card">
        <h1 className="title">{service.name} coupons</h1>
        <div className="row">
          {service.logoUrl ? <span className="service-icon" style={{ backgroundImage: `url(${service.logoUrl})` }} aria-hidden /> : null}
          {service.website ? (
            <a href={service.website} target="_blank" rel="noreferrer">
              Open service link
            </a>
          ) : (
            <span className="meta">Service link is not set</span>
          )}
        </div>
      </article>

      {coupons.length === 0 ? (
        <EmptyState message="No active coupons for this service yet." />
      ) : (
        <div className="list">
          {coupons.map((coupon) => {
            const copyValue = coupon.couponCode?.trim() ? coupon.couponCode : coupon.referralUrl

            return (
              <article key={coupon.id} className="card">
                <h2 className="section-title">{coupon.title}</h2>
                <p>{coupon.previewText}</p>
                <div className="row">
                  {coupon.couponCode ? <span className="pill">Code: {coupon.couponCode}</span> : null}
                  <span className="pill">Status: {coupon.status}</span>
                </div>
                <div className="row" style={{ marginTop: 8 }}>
                  <a href={coupon.referralUrl} target="_blank" rel="noreferrer">
                    Open coupon link
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
