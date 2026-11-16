import type { Metadata } from 'next'
import { pageSocialMetadata } from '@/app/seo'
import { EmptyState } from '@/components/empty-state'
import { PromoBoard } from '@/components/promo-board'
import { SiteDisclosure } from '@/components/site-disclosure'
import { indexPageJsonLd } from '@/lib/page-json-ld'
import { toPromoCard } from '@/lib/promo-entries'
import { promos } from '@/lib/promos'
import type { Promo } from '@/lib/schemas/promo.schema'
import { getServices } from '@/lib/site-data'

const path = '/promos'
const title = 'Promo codes and limited-time offers'
const description =
  "Checked promo codes and limited-time offers, with the expiry and a link to each brand's official page."

export const revalidate = 3600

export const metadata: Metadata = {
  ...pageSocialMetadata({ title, description, path }),
  alternates: {
    canonical: path,
    types: { 'text/markdown': '/promos.md' }
  }
}

export function PromosPageContent({
  items,
  now,
  knownSlugs
}: {
  items: readonly Promo[]
  now: Date
  knownSlugs: ReadonlySet<string>
}) {
  const jsonLd = indexPageJsonLd({ path, name: title, description })
  const models = items.map((item) => toPromoCard(item, knownSlugs))
  return (
    <section className="article-index promo-page" aria-labelledby="promos-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="article-index__header">
        <h1 id="promos-heading" className="article-index__title">
          {title}
        </h1>
        <p className="article-index__intro">
          These are limited-time codes and offers checked against the brand&apos;s official page. Confirm the live
          offer there before you use a code.
        </p>
      </header>
      <SiteDisclosure />
      {items.length === 0 ? (
        <EmptyState
          title="No promo codes right now"
          message="Checked codes and limited-time offers will show up here, with the expiry and a link to the official page."
          actions={[{ href: '/articles', label: 'Browse guides' }]}
        />
      ) : (
        <PromoBoard items={models} nowIso={now.toISOString()} mode="directory" />
      )}
    </section>
  )
}

export default async function PromosPage() {
  const stores = await getServices()
  const knownSlugs = new Set(stores.map((store) => store.slug))
  return <PromosPageContent items={promos} now={new Date()} knownSlugs={knownSlugs} />
}
