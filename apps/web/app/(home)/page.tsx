import type { Metadata } from 'next'
import { HeroSlider } from '@/components/hero-slider'
import { HomeClipCoupons } from '@/components/home-clip-coupons'
import { CategoryMarquee } from '@/components/category-marquee'
import { MonthlyTopOffers } from '@/components/monthly-top-offers'
import { HotCashback } from '@/components/hot-cashback'
import {
  getHeroSlides,
  getHomeClipCoupons,
  getHomeCategoryMarquee,
  getHotCashbackOffers,
  getTopMonthlyOffers
} from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Home | BonusBridge',
  description: 'Discover referral bonuses and coupons by store.'
}

export default async function HomePage() {
  const [heroSlides, topMonthlyOffers, clipCoupons, categoryChips, hotCashbackOffers] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getTopMonthlyOffers().catch(() => []),
      getHomeClipCoupons().catch(() => []),
      getHomeCategoryMarquee().catch(() => []),
      getHotCashbackOffers().catch(() => [])
    ])

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <HomeClipCoupons coupons={clipCoupons} />

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
