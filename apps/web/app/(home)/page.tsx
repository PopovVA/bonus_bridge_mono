import type { Metadata } from 'next'
import { absoluteUrl, pageSocialMetadata } from '@/app/seo'
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

export const metadata: Metadata = pageSocialMetadata({
  title: 'Referral guides and provider terms',
  description:
    'Independent notes on referral links and coupons. Bonus amounts are not verified here and depend on the provider, your account, and your location.',
  path: '/'
})

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
    description:
      'Independent notes on referral links and coupons. Bonus amounts are not verified here and depend on the provider, your account, and your location.'
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="home-intro">
        <h1 className="home-intro__title">Referral guides and provider terms</h1>
        <p className="home-intro__lede">
          Independent notes on partner links and coupons. Bonus amounts are not verified here. Eligibility depends on
          the provider, your account, and where you live.
        </p>
      </header>
      <SiteDisclosure className="site-disclosure--home" />
      <HeroSlider slides={heroSlides} />

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <HomeClipCoupons coupons={clipCoupons} />

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
