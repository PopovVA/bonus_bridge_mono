import Link from 'next/link'

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
        <hr className="home-footer-divider" />
        <p className="home-footer-copy">© 2026 BonusBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
