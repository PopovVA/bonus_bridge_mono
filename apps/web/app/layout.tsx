import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

const appSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-app',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'BonusBridge',
  description: 'Find referral bonuses and coupons by store.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={appSans.variable}>
      <body>{children}</body>
    </html>
  )
}
