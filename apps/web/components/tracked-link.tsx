'use client'

import Link from 'next/link'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { trackGtagEvent, type GtagEventParams } from '@/lib/gtag-track'

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
}

/** External `<a href="…">` with GA4 event on click. */
export function TrackedOutboundLink({ event, eventParams, onClick, ...rest }: TrackedOutboundLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackGtagEvent(event, eventParams)
        onClick?.(e)
      }}
    />
  )
}
