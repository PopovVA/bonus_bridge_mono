import type { Metadata } from 'next'
import { ArticleBody } from '@/components/article-body'
import { ArticleReferralDisclosure } from '@/components/article-referral-disclosure'
import { ArticleViewTracker } from '@/components/article-view-tracker'
import { StoreRelatedPanel } from '@/components/store-related-panel'
import { absoluteUrl } from '@/app/seo'
import { articleJsonLd, chimeArticleDocument } from '@/lib/articles/chime-document'
import { articleList } from '@/lib/articles/list'
import { getCategories, getServiceBySlug } from '@/lib/site-data'

const doc = chimeArticleDocument
const chimeArticle = articleList.find((article) => article.slug === doc.slug)!

export async function generateMetadata(): Promise<Metadata> {
  const title = chimeArticle.title
  const description = chimeArticle.description
  const pageUrl = absoluteUrl(`/articles/${doc.slug}`)

  return {
    title: { absolute: `${title} | BonusBridge` },
    description,
    keywords: doc.keywords,
    alternates: {
      canonical: `/articles/${doc.slug}`,
      types: { 'text/markdown': `/articles/${doc.slug}.md` }
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: chimeArticle.publishedAt,
      modifiedTime: doc.updatedAt,
      url: pageUrl,
      images: [
        {
          url: doc.ogImage.src,
          width: doc.ogImage.width,
          height: doc.ogImage.height,
          alt: doc.ogImage.alt
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [doc.ogImage.src]
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export default async function ChimeArticlePage() {
  const [store, categoriesResult] = await Promise.all([
    Promise.resolve()
      .then(() => getServiceBySlug('chime'))
      .catch(() => null),
    Promise.resolve()
      .then(() => getCategories())
      .catch(() => [] as Awaited<ReturnType<typeof getCategories>>)
  ])
  const categories = Array.isArray(categoriesResult) ? categoriesResult : []
  const primaryCategorySlug = store ? categories.find((category) => category.id === store.categoryId)?.slug ?? null : null
  const jsonLd = articleJsonLd(doc, {
    title: chimeArticle.title,
    description: chimeArticle.description,
    publishedAt: chimeArticle.publishedAt
  })

  return (
    <>
      <ArticleViewTracker slug={doc.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="article-page">
        <header className="article-page__header" id="article-top">
          <p className="article-page__eyebrow">Informational Guides</p>
          <h1 className="article-page__title">{chimeArticle.title}</h1>
          <p className="article-page__meta">
            Updated{' '}
            <time dateTime={doc.updatedAt}>
              {new Date(doc.updatedAt).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })}
            </time>
          </p>
        </header>

        <ArticleReferralDisclosure />
        <p className="article-page__trademark-note">{doc.trademark}</p>
        <ArticleBody doc={doc} />

        <div className="article-page__explore" id="explore-more">
          <StoreRelatedPanel storeSlug="chime" primaryCategorySlug={primaryCategorySlug} />
        </div>
      </article>
    </>
  )
}
