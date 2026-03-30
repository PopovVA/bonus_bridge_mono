import Link from 'next/link'
import type { Metadata } from 'next'
import { getOffers } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Coupons | BonusBridge',
  description: 'Browse promo codes and referral links.'
}

export default async function CouponsPage() {
  const coupons = await getOffers({ status: 'active' }).catch(() => [])

  return (
    <main>
      <h1 className="title">Coupons</h1>
      <p className="meta">Promo codes and referral links to copy.</p>
      {coupons.length === 0 ? (
        <p className="meta">No active coupons yet.</p>
      ) : (
        <div className="list">
          {coupons.map((coupon) => (
            <article className="card" key={coupon.id}>
              <h3>
                <Link href={`/coupons/${coupon.id}`}>{coupon.title}</Link>
              </h3>
              <p className="meta">Status: {coupon.status}</p>
              {coupon.description ? <p>{coupon.description}</p> : null}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
