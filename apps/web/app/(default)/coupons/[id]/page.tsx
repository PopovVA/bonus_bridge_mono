import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getStoreSlugForOfferId } from '@/lib/site-data'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const slug = await getStoreSlugForOfferId(id)
  if (!slug) {
    return { title: 'Offer not found', robots: { index: false, follow: false } }
  }
  return {
    title: { absolute: 'BonusBridge' },
    robots: { index: false, follow: true },
    alternates: { canonical: `/stores/${slug}` }
  }
}

export default async function CouponToStoreRedirectPage({ params }: Props) {
  const { id } = await params
  const slug = await getStoreSlugForOfferId(id)
  if (!slug) {
    notFound()
  }
  permanentRedirect(`/stores/${slug}`)
}
