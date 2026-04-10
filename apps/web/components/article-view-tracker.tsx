'use client'

import { useEffect } from 'react'
import { trackGtagEvent } from '@/lib/gtag-track'

type Props = {
  slug: string
}

/** Fires once per mount so GA4 can attribute article reads. */
export function ArticleViewTracker({ slug }: Props) {
  useEffect(() => {
    trackGtagEvent('article_view', { article_slug: slug })
  }, [slug])
  return null
}
