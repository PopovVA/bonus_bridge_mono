import type { Metadata } from 'next'
import Image from 'next/image'
import { TrackedLink } from '@/components/tracked-link'
import { articleList } from '@/lib/articles/list'

export const metadata: Metadata = {
  title: 'Informational Guides',
  description:
    'Independent guides to referral and sign-up offers. We explain eligibility, provider terms, and example scenarios.',
  alternates: {
    canonical: '/articles'
  },
  openGraph: {
    title: 'Informational Guides',
    description: 'Independent guides to referral and sign-up offers, eligibility, and provider terms.'
  }
}

export default function ArticlesIndexPage() {
  return (
    <section className="article-index">
      <header className="article-index__header">
        <h1 className="article-index__title">Informational Guides</h1>
        <p className="article-index__intro">
          Plain-English summaries of sign-up and referral offers: how the terms work, what eligibility details to confirm,
          and which provider rules matter before you continue.
        </p>
      </header>
      <ul className="article-index__list">
        {articleList.map((a) => (
          <li key={a.slug} className="article-index__item">
            <TrackedLink href={`/articles/${a.slug}`} className="article-index__link" event="articles_list_open">
              <span className="article-index__link-inner">
                {a.listImageSrc ? (
                  <span className="article-index__thumb-wrap">
                    <Image
                      src={a.listImageSrc}
                      alt=""
                      width={400}
                      height={267}
                      className="article-index__thumb-img"
                      sizes="(max-width: 640px) min(100vw, 480px), 112px"
                    />
                  </span>
                ) : null}
                <span className="article-index__link-body">
                  <span className="article-index__item-title">{a.title}</span>
                  <span className="article-index__item-meta">{new Date(a.publishedAt).toLocaleDateString('en-US')}</span>
                  <span className="article-index__item-desc">{a.description}</span>
                </span>
              </span>
            </TrackedLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
