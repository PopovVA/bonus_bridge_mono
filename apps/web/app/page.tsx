import Link from 'next/link'
import type { Metadata } from 'next'
import { getCountries, getOffers, getServices } from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'Home | BonusBridge',
  description: 'Discover referral bonuses with readable country and service guides.'
}

export default async function HomePage() {
  const [countries, services, offers] = await Promise.all([
    getCountries().catch(() => []),
    getServices().catch(() => []),
    getOffers().catch(() => [])
  ])

  return (
    <main>
      <h1 className='title'>Home</h1>
      <section className='card'>
        <h2>Readable, fast bonus discovery</h2>
        <p>
          Explore referral offers by country and service. Built with SEO-first pages and a clean editorial
          layout inspired by Medium.
        </p>
      </section>

      <section className='grid'>
        <article className='card'>
          <h3>Countries</h3>
          <p className='meta'>{countries.length} available</p>
          <ul>
            {countries.slice(0, 8).map((country) => (
              <li key={country.id}>{country.name}</li>
            ))}
          </ul>
        </article>

        <article className='card'>
          <h3>Services</h3>
          <p className='meta'>{services.length} indexed</p>
          <ul>
            {services.slice(0, 8).map((service) => (
              <li key={service.id}>{service.name}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className='card'>
        <h3>Latest offers</h3>
        <ul>
          {offers.slice(0, 8).map((offer) => (
            <li key={offer.id}>
              <Link href={`/offers/${offer.id}`}>{offer.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
