'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { TrackedOutboundLink } from '@/components/tracked-link'
import { CHIME_PARTNER_REFERRAL_URL } from '@/lib/chime-article-constants'

type Props = {
  articleSlug: string
  imageKey: 'referral_steps' | 'building'
  src: string
  alt: string
  width: number
  height: number
  sizes: string
  /** Optional. Omit to show image + optional CTA only (no caption under the image). */
  caption?: ReactNode
  priority?: boolean
  /** Renders a partner CTA below the caption (referral link + GA4). */
  partnerOfferCta?: boolean
}

/** Wraps an article figure image with the partner referral link + GA4 click event. */
export function ArticlePartnerFigure({
  articleSlug,
  imageKey,
  src,
  alt,
  width,
  height,
  sizes,
  caption,
  priority,
  partnerOfferCta
}: Props) {
  return (
    <figure className="article-page__figure">
      <TrackedOutboundLink
        href={CHIME_PARTNER_REFERRAL_URL}
        className="article-page__figure-link"
        target="_blank"
        rel="noopener noreferrer sponsored"
        event="article_chime_partner_image_click"
        eventParams={{ article_slug: articleSlug, image_key: imageKey }}
        aria-label={`View offer details on the official site, ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="article-page__img"
          sizes={sizes}
          priority={priority}
        />
      </TrackedOutboundLink>
      {caption != null ? <figcaption className="article-page__caption">{caption}</figcaption> : null}
      {partnerOfferCta ? (
        <div className="article-page__figure-cta">
          <TrackedOutboundLink
            href={CHIME_PARTNER_REFERRAL_URL}
            className="category-store-cta article-page__offer-cta"
            target="_blank"
            rel="noopener noreferrer sponsored"
            event="article_chime_partner_cta"
            eventParams={{ article_slug: articleSlug, cta_place: `under_${imageKey}` }}
          >
            View offer details
          </TrackedOutboundLink>
        </div>
      ) : null}
    </figure>
  )
}
