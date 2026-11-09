import type { Metadata } from 'next'
import { absoluteUrl, pageSocialMetadata } from '@/app/seo'
import { HeroSlider } from '@/components/hero-slider'
import { HomeHero } from '@/components/home-hero'
import { HowItWorks } from '@/components/how-it-works'
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
import { homeStatsFromPaths } from '@/lib/home-stats'
import { listPublicSitemapPaths } from '@/lib/public-sitemap'
import { featuredSignupBonus } from '@/lib/signup-bonuses'

export const metadata: Metadata = pageSocialMetadata({
  title: 'Referral guides and provider terms',
  description:
    'Independent notes on referral links and coupons. Amounts are quoted from provider terms, can change, and depend on your account and location.',
  path: '/'
})

export default async function HomePage() {
  const [heroSlides, topMonthlyOffers, clipCoupons, categoryChips, hotCashbackOffers, sitemapPaths] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getTopMonthlyOffers().catch(() => []),
      getHomeClipCoupons().catch(() => []),
      getHomeCategoryMarquee().catch(() => []),
      getHotCashbackOffers().catch(() => []),
      listPublicSitemapPaths().catch(() => [] as string[])
    ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BonusBridge',
    url: absoluteUrl('/'),
    description:
      'Independent notes on referral links and coupons. Amounts are quoted from provider terms, can change, and depend on your account and location.'
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero stats={homeStatsFromPaths(sitemapPaths)} bonus={featuredSignupBonus()} />
      <SiteDisclosure className="site-disclosure--home" />

      {heroSlides.length > 0 ? (
        <section className="featured" aria-labelledby="featured-heading">
          <div className="section-head">
            <p className="section-kicker">Featured guide</p>
            <h2 id="featured-heading" className="section-title">
              Read the terms before the link
            </h2>
          </div>
          <HeroSlider slides={heroSlides} />
        </section>
      ) : null}

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <HowItWorks />

      <HomeClipCoupons coupons={clipCoupons} />

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
