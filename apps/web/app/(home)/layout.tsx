import '../home.css'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

const chimeSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-chime-serif',
  display: 'swap'
})

const chimeUi = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-chime-ui',
  display: 'swap'
})

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`home-page ${chimeSerif.variable} ${chimeUi.variable}`}>
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </div>
  )
}
