import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bonus Bridge Admin',
  description: 'Admin panel for countries, categories, stores, coupons and referral moderation.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
