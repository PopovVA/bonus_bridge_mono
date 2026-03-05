import Link from 'next/link'
import type { Metadata } from 'next'
import { getOffers } from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'Offers | BonusBridge',
  description: 'Browse active referral offers with clear terms and status.'
}

export default async function OffersPage() {
  const offers = await getOffers().catch(() => [])

  return (
    <main>
      <h1 className='title'>Offers</h1>
      {offers.map((offer) => (
        <article className='card' key={offer.id}>
          <h3>
            <Link href={`/offers/${offer.id}`}>{offer.title}</Link>
          </h3>
          <p className='meta'>Status: {offer.status}</p>
          {offer.description ? <p>{offer.description}</p> : null}
        </article>
      ))}
    </main>
  )
}
