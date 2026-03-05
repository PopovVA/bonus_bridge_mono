import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BonusBridge',
  description: 'Find referral bonuses and coupons by store.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
