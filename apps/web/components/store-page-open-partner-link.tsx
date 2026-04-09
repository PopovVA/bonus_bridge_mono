'use client'

import type { ReactNode } from 'react'
import { TrackedOutboundLink } from '@/components/tracked-link'

type Props = {
  href: string
  storeSlug: string
  children: ReactNode
}

/** Primary outbound CTA on the store page hero (“Open Store”). */
export function StorePageOpenPartnerLink({ href, storeSlug, children }: Props) {
  return (
    <TrackedOutboundLink
      href={href}
      target="_blank"
      rel="noreferrer"
      className="store-page-open-store-btn"
      event="store_page_open_partner"
      eventParams={{ store_slug: storeSlug }}
    >
      {children}
    </TrackedOutboundLink>
  )
}
