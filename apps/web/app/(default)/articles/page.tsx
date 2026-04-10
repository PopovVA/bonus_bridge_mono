import type { Metadata } from 'next'
import Image from 'next/image'
import { TrackedLink } from '@/components/tracked-link'
import { articleList } from '@/lib/articles/list'

export const metadata: Metadata = {
  title: 'Money Guides',
  description:
    'Straight-up tips to earn more from bank and app sign-up offers. We decode referral math, read the fine print, and show what actually pays.',
  alternates: {
    canonical: '/articles'
  },
  openGraph: {
    title: 'Money Guides',
    description: 'Practical guides to bank bonuses, referrals, and sign-up offers that pay.'
  }
}

export default function ArticlesIndexPage() {
  return (
    <section className="article-index">
      <header className="article-index__header">
        <h1 className="article-index__title">Money Guides</h1>
        <p className="article-index__intro">
          Real-world tips to squeeze more out of sign-up and referral offers: how the numbers work, what to double-check in
          the terms, and tools to plan your next move.
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
