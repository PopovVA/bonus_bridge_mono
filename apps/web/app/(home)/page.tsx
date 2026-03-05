import type { Metadata } from 'next'
import { HeroSlider } from '@/components/hero-slider'
import { StoreCard } from '@/components/store-card'
import { CouponCard } from '@/components/coupon-card'
import { PromoBanner } from '@/components/promo-banner'
import {
  getHeroImages,
  getPremiumBanner,
  getFeaturedStores,
  getFeaturedOffers
} from '@/lib/api-client'

export const metadata: Metadata = {
  title: 'Home | BonusBridge',
  description: 'Discover referral bonuses and coupons by store.'
}

export default async function HomePage() {
  const [heroImages, premiumBanner, featuredStores, featuredOffers] = await Promise.all([
    getHeroImages().catch(() => []),
    getPremiumBanner().catch(() => null),
    getFeaturedStores().catch(() => []),
    getFeaturedOffers().catch(() => [])
  ])

  return (
    <>
      <HeroSlider images={heroImages} />

      <section id="stores" className="stores-section">
        <div className="section-head">
          <h2 className="section-title">Top Cashback Stores</h2>
          <p className="section-subtitle">
            Shop at your favorite stores and earn cashback on every purchase
          </p>
        </div>
        <div className="stores-grid">
          {featuredStores.map((fs) => {
            const store = fs.store
            if (!store) return null
            return (
              <StoreCard
                key={fs.id}
                id={store.id}
                name={store.name}
                slug={store.slug}
                logoSvg={store.logoSvg}
                bonusLabel="View deals"
              />
            )
          })}
        </div>
      </section>

      <PromoBanner banner={premiumBanner} />

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
    </>
  )
}
