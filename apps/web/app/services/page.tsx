import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'
import { getServices } from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'Services | Bonus Bridge',
  description: 'Discover services that offer referral bonuses.'
}

export default async function ServicesPage() {
  const services = await getServices().catch(() => [])

  return (
    <section>
      <h1 className="title">Services</h1>
      <p className="meta">Structured catalog with readable descriptions and links.</p>
      {services.length === 0 ? (
        <EmptyState message="No services yet. Publish services in API and refresh." />
      ) : (
        <div className="list">
          {services.map((service) => (
            <article key={service.id} className="card">
              <h2 className="section-title">{service.name}</h2>
              <p className="meta" style={{ marginTop: 0 }}>
                Slug: {service.slug}
              </p>
              <div className="row">
                <Link href={`/services/${service.slug}/coupons`}>View coupons</Link>
                {service.website ? (
                  <a href={service.website} target="_blank" rel="noreferrer">
                    Service link
                  </a>
                ) : null}
              </div>
              {service.description ? <p>{service.description}</p> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
