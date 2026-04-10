import type { Metadata } from 'next'
import { absoluteUrl } from '@/app/seo'
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
  title: 'Home',
  description: 'Discover referral bonuses and coupons by store.',
  alternates: {
    canonical: '/'
  }
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BonusBridge',
    url: absoluteUrl('/'),
    description: 'Find referral bonuses and coupons by store.'
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSlider slides={heroSlides} />

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <HomeClipCoupons coupons={clipCoupons} />

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
