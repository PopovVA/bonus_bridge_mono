import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuideArticle } from '@/components/guide-article'
import { getGuideBySlug, guideList } from '@/lib/guides'
import { absoluteUrl } from '@/app/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return guideList.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) {
    return { title: 'Guide not found', robots: { index: false, follow: false } }
  }
  return {
    title: { absolute: guide.metaTitle },
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
      siteName: 'BonusBridge',
      type: 'article',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary',
      title: guide.metaTitle,
      description: guide.description
    }
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()
  return <GuideArticle guide={guide} />
}
