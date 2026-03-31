import type { Metadata } from 'next'
import Link from 'next/link'
import { CouponCopyButton } from '@/components/coupon-copy-button'
import { getOfferById } from '@/lib/site-data'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const coupon = await getOfferById(id).catch(() => null)

  if (!coupon) {
    return {
      title: 'Coupon not found | Bonus Bridge'
    }
  }

  return {
    title: `${coupon.title} | Bonus Bridge`,
    description: coupon.description ?? 'Coupon details and referral terms.'
  }
}

export default async function CouponDetailsPage({ params }: Props) {
  const { id } = await params
  const coupon = await getOfferById(id).catch(() => null)

  if (!coupon) {
    return (
      <section className="card">
        <h1 className="title">Coupon not found</h1>
        <p className="meta">This coupon does not exist.</p>
      </section>
    )
  }

  const copyValue = coupon.couponCode?.trim() ? coupon.couponCode : coupon.referralUrl

  return (
    <article className="card">
      <p className="meta" style={{ marginTop: 0 }}>
        <Link href="/#coupons">Back to coupons</Link>
      </p>
      <h1 className="title">{coupon.title}</h1>
      <div className="row">
        <span className="pill">Status: {coupon.status}</span>
        {coupon.bonusAmount ? <span className="pill">Bonus: {coupon.bonusAmount}</span> : null}
      </div>
      {coupon.description ? <p>{coupon.description}</p> : null}
      {coupon.terms ? (
        <section>
          <h2 className="section-title">Terms</h2>
          <p>{coupon.terms}</p>
        </section>
      ) : null}
      <div className="row" style={{ marginTop: 16 }}>
        <a href={coupon.referralUrl} target="_blank" rel="noreferrer">
          Open referral link
        </a>
        <CouponCopyButton value={copyValue} label={coupon.couponCode ? 'Copy code' : 'Copy link'} />
      </div>
    </article>
  )
}
