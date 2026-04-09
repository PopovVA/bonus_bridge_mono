import { TrackedLink } from '@/components/tracked-link'

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-links">
          <TrackedLink href="/privacy" event="footer_privacy">
            Privacy Policy
          </TrackedLink>
          <TrackedLink href="/terms" event="footer_terms">
            Terms of Service
          </TrackedLink>
        </div>
        <hr className="home-footer-divider" />
        <p className="home-footer-copy">© 2026 BonusBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
