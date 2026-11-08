import { TrackedLink } from '@/components/tracked-link'
import { SITE_FOOTER_DISCLAIMER, SITE_OPERATOR_NOTICE } from '@/lib/site-disclaimers'

const EXPLORE = [
  { href: '/articles', label: 'Guides', event: 'footer_articles' },
  { href: '/guides', label: 'Comparison guides', event: 'footer_guides' },
  { href: '/#coupons', label: 'Codes', event: 'footer_coupons' },
  { href: '/contact', label: 'Contact', event: 'footer_contact' }
]

const LEGAL = [
  { href: '/privacy', label: 'Privacy Policy', event: 'footer_privacy' },
  { href: '/cookies', label: 'Cookie Notice', event: 'footer_cookies' },
  { href: '/disclosures', label: 'Disclosures', event: 'footer_disclosures' },
  { href: '/terms-of-service', label: 'Terms of Service', event: 'footer_terms' }
]

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-top">
          <div className="home-footer-about">
            <p className="home-footer-disclaimer">{SITE_FOOTER_DISCLAIMER}</p>
            <p className="home-footer-operator">{SITE_OPERATOR_NOTICE}</p>
          </div>
          <nav className="home-footer-col" aria-label="Explore">
            <p className="home-footer-col__title">Explore</p>
            <div className="home-footer-links">
              {EXPLORE.map((l) => (
                <TrackedLink key={l.href} href={l.href} event={l.event}>
                  {l.label}
                </TrackedLink>
              ))}
            </div>
          </nav>
          <nav className="home-footer-col" aria-label="Legal">
            <p className="home-footer-col__title">Legal</p>
            <div className="home-footer-links">
              {LEGAL.map((l) => (
                <TrackedLink key={l.href} href={l.href} event={l.event}>
                  {l.label}
                </TrackedLink>
              ))}
            </div>
          </nav>
        </div>
        <p className="home-footer-wordmark" aria-hidden="true" data-parallax="-18">
          BonusBridge
        </p>
        <hr className="home-footer-divider" />
        <p className="home-footer-copy">© 2026 BonusBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
