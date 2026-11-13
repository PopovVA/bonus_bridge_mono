import type { Metadata } from 'next'
import { TrackedLink } from '@/components/tracked-link'
import { guideList } from '@/lib/guides'
import { pageSocialMetadata } from '@/app/seo'
import { indexPageJsonLd } from '@/lib/page-json-ld'

const description =
  'Side-by-side cash-back and referral guides. Amounts vary by provider, time, and location. Confirm the live offer before you sign up.'

export const metadata: Metadata = pageSocialMetadata({
  title: 'Comparison guides',
  description,
  path: '/guides'
})

export default function GuidesIndexPage() {
  const jsonLd = indexPageJsonLd({
    path: '/guides',
    name: 'Comparison guides',
    description,
    type: 'CollectionPage',
    items: guideList.map((guide) => ({ name: guide.h1, path: `/guides/${guide.slug}` }))
  })
  return (
    <section className="article-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="article-index__header">
        <h1 className="article-index__title">Comparison guides</h1>
        <p className="article-index__intro">
          Practical pages on cash-back portals and referral rules we can publish. Each guide links the provider’s terms
          and says what we will not promise.
        </p>
      </header>
      <ul className="article-index__list">
        {guideList.map((guide) => (
          <li key={guide.slug} className="article-index__item">
            <TrackedLink href={`/guides/${guide.slug}`} className="article-index__link" event="guides_list_open">
              <span className="article-index__link-body">
                <span className="article-index__item-title">{guide.h1}</span>
                <span className="article-index__item-desc">{guide.description}</span>
              </span>
            </TrackedLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
