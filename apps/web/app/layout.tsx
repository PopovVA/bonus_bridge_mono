import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BonusBridge',
  description: 'Find referral bonuses by country, category, and service.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='container'>
          <header style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 8, fontSize: 28, fontWeight: 700 }}>BonusBridge</p>
            <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href='/'>Home</Link>
              <Link href='/countries'>Countries</Link>
              <Link href='/services'>Services</Link>
              <Link href='/offers'>Offers</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
