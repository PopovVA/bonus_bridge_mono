import type { Metadata } from 'next'
import { TrackedLink } from '@/components/tracked-link'
import { guideList } from '@/lib/guides'
import { pageSocialMetadata } from '@/app/seo'

export const metadata: Metadata = pageSocialMetadata({
  title: 'Comparison guides',
  description:
    'Side-by-side cash-back and referral guides. Amounts vary by provider, time, and location. Confirm the live offer before you sign up.',
  path: '/guides'
})

export default function GuidesIndexPage() {
  return (
    <section className="article-index">
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
