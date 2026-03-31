import type { Metadata } from 'next'
import { HeroSlider } from '@/components/hero-slider'
import { CouponCard } from '@/components/coupon-card'
import { CategoryMarquee } from '@/components/category-marquee'
import { MonthlyTopOffers } from '@/components/monthly-top-offers'
import { HotCashback } from '@/components/hot-cashback'
import {
  getHeroSlides,
  getFeaturedOffers,
  getHomeCategoryMarquee,
  getHotCashbackOffers,
  getTopMonthlyOffers
} from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Home | BonusBridge',
  description: 'Discover referral bonuses and coupons by store.'
}

export default async function HomePage() {
  const [heroSlides, topMonthlyOffers, featuredOffers, categoryChips, hotCashbackOffers] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getTopMonthlyOffers().catch(() => []),
      getFeaturedOffers().catch(() => []),
      getHomeCategoryMarquee().catch(() => []),
      getHotCashbackOffers().catch(() => [])
    ])

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <MonthlyTopOffers offers={topMonthlyOffers} />

      <CategoryMarquee chips={categoryChips} />

      <section id="coupons" className="coupons-section">
        <div className="section-head">
          <h2 className="section-title">Hot Promo Codes</h2>
          <p className="section-subtitle">
            Grab these exclusive deals before they expire
          </p>
        </div>
        <div className="coupons-grid">
          {featuredOffers.map((fo) => {
            const offer = fo.offer
            const store = offer?.service
            if (!offer) return null
            return (
              <CouponCard
                key={fo.id}
                id={offer.id}
                title={offer.title}
                previewText={offer.previewText}
                couponCode={offer.couponCode}
                referralUrl={offer.referralUrl}
                storeName={store?.name}
                logoSvg={store?.logoSvg}
              />
            )
          })}
        </div>
      </section>

      <HotCashback offers={hotCashbackOffers} />
    </>
  )
}
