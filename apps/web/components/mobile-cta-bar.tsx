'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, BookOpen, Ticket } from 'lucide-react'
import { TrackedLink, TrackedOutboundLink } from '@/components/tracked-link'

type Props = {
  /** Featured bonus with a stated amount; replaces the Codes button when present. */
  bonus?: { slug: string; amount: string; provider: string; referralUrl: string } | null
}

/** Phone-only bottom bar. Appears after the first screen, steps aside when the footer is in view. */
export function MobileCtaBar({ bonus = null }: Props) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let footerVisible = false
    const update = () => setShown(window.scrollY > window.innerHeight * 0.6 && !footerVisible)
    const footer = document.querySelector('.home-footer')
    const observer =
      footer && 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            footerVisible = entry.isIntersecting
            update()
          })
        : null
    if (footer) observer?.observe(footer)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [])

  return (
    <nav className={`mobile-cta${shown ? ' mobile-cta--shown' : ''}`} aria-label="Quick links" aria-hidden={!shown}>
      {bonus ? (
        <TrackedOutboundLink
          href={bonus.referralUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mobile-cta__btn mobile-cta__btn--accent"
          event="bonus_cta"
          eventParams={{ store_slug: bonus.slug, place: 'mobile_bar' }}
          tabIndex={shown ? undefined : -1}
        >
          Get {bonus.amount} · {bonus.provider}
          <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
        </TrackedOutboundLink>
      ) : (
        <TrackedLink
          href="/#coupons"
          className="mobile-cta__btn mobile-cta__btn--primary"
          event="mobile_cta_codes"
          tabIndex={shown ? undefined : -1}
        >
          <Ticket size={18} strokeWidth={2} aria-hidden />
          Codes
        </TrackedLink>
      )}
      <TrackedLink href="/articles" className="mobile-cta__btn" event="mobile_cta_guides" tabIndex={shown ? undefined : -1}>
        <BookOpen size={18} strokeWidth={2} aria-hidden />
        Guides
      </TrackedLink>
    </nav>
  )
}
