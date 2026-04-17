import { TrackedLink } from '@/components/tracked-link'
import { SITE_FOOTER_DISCLAIMER } from '@/lib/site-disclaimers'

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <p className="home-footer-disclaimer">{SITE_FOOTER_DISCLAIMER}</p>
        <div className="home-footer-links">
          <TrackedLink href="/privacy-policy" event="footer_privacy">
            Privacy Policy
          </TrackedLink>
          <TrackedLink href="/terms-of-service" event="footer_terms">
            Terms of Service
          </TrackedLink>
          <TrackedLink href="/contact" event="footer_contact">
            Contact
          </TrackedLink>
        </div>
        <hr className="home-footer-divider" />
        <p className="home-footer-copy">© 2026 BonusBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
