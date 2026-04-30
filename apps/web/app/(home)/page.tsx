import type { Metadata } from 'next'
import { absoluteUrl } from '@/app/seo'
import { HeroSlider } from '@/components/hero-slider'
import { HomeClipCoupons } from '@/components/home-clip-coupons'
import { CategoryMarquee } from '@/components/category-marquee'
import { MonthlyTopOffers } from '@/components/monthly-top-offers'
import { HotCashback } from '@/components/hot-cashback'
import { SiteDisclosure } from '@/components/site-disclosure'
import {
  getHeroSlides,
  getHomeClipCoupons,
  getHomeCategoryMarquee,
  getHotCashbackOffers,
  getTopMonthlyOffers
} from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Learn about referral offers, coupons, eligibility, and provider terms by store.',
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
    description: 'Independent informational website about referral offers, coupons, and provider terms.'
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSlider slides={heroSlides} />
      <SiteDisclosure className="site-disclosure--home" />

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <HomeClipCoupons coupons={clipCoupons} />

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
