import '../home.css'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-page">
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </div>
  )
}
