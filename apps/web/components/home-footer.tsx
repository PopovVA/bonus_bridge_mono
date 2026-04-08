import Link from 'next/link'
import { AtSign, Camera, MessageCircle, PlayCircle } from 'lucide-react'

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-top">
          <div className="home-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div className="home-footer-social">
            <a href="#facebook" aria-label="Facebook">
              <MessageCircle size={20} aria-hidden />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <AtSign size={20} aria-hidden />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <Camera size={20} aria-hidden />
            </a>
            <a href="#youtube" aria-label="YouTube">
              <PlayCircle size={20} aria-hidden />
            </a>
          </div>
        </div>
        <hr className="home-footer-divider" />
        <p className="home-footer-copy">© 2026 BonusBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
