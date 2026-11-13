'use client'

import Link from 'next/link'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { trackGtagEvent, trackReferralClick, type GtagEventParams } from '@/lib/gtag-track'

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'onClick'> & {
  event: string
  eventParams?: GtagEventParams
  onClick?: ComponentProps<typeof Link>['onClick']
}

/** Internal navigation with GA4 `event` on click (before navigation). */
export function TrackedLink({ event, eventParams, onClick, ...rest }: TrackedLinkProps) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackGtagEvent(event, eventParams)
        onClick?.(e)
      }}
    />
  )
}

type TrackedOutboundLinkProps = ComponentPropsWithoutRef<'a'> & {
  event: string
  eventParams?: GtagEventParams
  /** When set, the click is a referral CTA: `bonus_cta` with this partner slug and the current path. */
  partnerSlug?: string
}

/** External `<a href="…">` with GA4 event on click. */
export function TrackedOutboundLink({
  event,
  eventParams,
  partnerSlug,
  onClick,
  ...rest
}: TrackedOutboundLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (partnerSlug) {
          trackReferralClick(partnerSlug, String(eventParams?.place ?? event), eventParams)
        } else {
          trackGtagEvent(event, eventParams)
        }
        onClick?.(e)
      }}
    />
  )
}
