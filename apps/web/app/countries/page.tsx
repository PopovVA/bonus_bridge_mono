import type { Metadata } from 'next'
import { getCountries } from '@/lib/api-client'
import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = {
  title: 'Countries | Bonus Bridge',
  description: 'Countries currently supported for referral offers.'
}

export default async function CountriesPage() {
  const countries = await getCountries().catch(() => [])

  return (
    <section>
      <h1 className="title">Countries</h1>
      <p className="meta">Available markets for referrals and bonuses.</p>
      {countries.length === 0 ? (
        <EmptyState message="No countries yet. Check API connection and published data." />
      ) : (
        <div className="list">
          {countries.map((country) => (
            <article key={country.id} className="card">
              <h2 className="section-title">{country.name}</h2>
              <p className="meta" style={{ margin: 0 }}>
                Code: {country.code}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
