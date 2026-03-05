import type { Metadata } from 'next'
import Link from 'next/link'
import { getOfferById } from '@/lib/api-client'

type Props = {
  params: Promise<{ offerId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { offerId } = await params
  const offer = await getOfferById(offerId).catch(() => null)

  if (!offer) {
    return {
      title: 'Offer not found | Bonus Bridge'
    }
  }

  return {
    title: `${offer.title} | Bonus Bridge`,
    description: offer.description ?? 'Offer details and referral terms.'
  }
}

export default async function OfferDetailsPage({ params }: Props) {
  const { offerId } = await params
  const offer = await getOfferById(offerId).catch(() => null)

  if (!offer) {
    return (
      <section className="card">
        <h1 className="title">Offer not found</h1>
        <p className="meta">This offer is missing or the API is unavailable.</p>
      </section>
    )
  }

  return (
    <article className="card">
      <p className="meta" style={{ marginTop: 0 }}>
        <Link href="/offers">Back to offers</Link>
      </p>
      <h1 className="title">{offer.title}</h1>
      <div className="row">
        <span className="pill">Status: {offer.status}</span>
        {offer.bonusAmount ? <span className="pill">Bonus: {offer.bonusAmount}</span> : null}
      </div>
      {offer.description ? <p>{offer.description}</p> : null}
      {offer.terms ? (
        <section>
          <h2 className="section-title">Terms</h2>
          <p>{offer.terms}</p>
        </section>
      ) : null}
      <p>
        <a href={offer.referralUrl} target="_blank" rel="noreferrer">
          Open referral link
        </a>
      </p>
    </article>
  )
}
