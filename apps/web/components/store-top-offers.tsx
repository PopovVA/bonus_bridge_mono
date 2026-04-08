'use client'

import type { Offer } from '@/lib/schemas'
import { StoreRelatedOfferCards, type StoreRelatedOfferCard } from '@/components/store-related-offer-cards'

type Props = {
  storeName: string
  storeSlug: string
  /** Resolved logo URL for this store (same as hero). */
  storeLogoSrc: string
  offers: Offer[]
}

/** Single “Top offers” grid: clip cards for codes, hot-cashback cards for links — same patterns as Explore More. */
export function StoreTopOffers({ storeName, storeSlug, storeLogoSrc, offers }: Props) {
  if (offers.length === 0) return null

  const cards: StoreRelatedOfferCard[] = offers.map((o) => ({
    id: o.id,
    title: o.title,
    previewText: o.previewText,
    couponCode: o.couponCode ?? null,
    serviceSlug: storeSlug,
    serviceName: storeName,
    logoSrc: storeLogoSrc,
    referralUrl: o.referralUrl
  }))

  return <StoreRelatedOfferCards offers={cards} labelledBy="store-top-offers-heading" />
}
