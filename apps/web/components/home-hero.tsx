import { ArrowRight } from 'lucide-react'
import { BridgeArt } from '@/components/bridge-art'
import { SplitWords } from '@/components/split-words'
import { TrackedLink } from '@/components/tracked-link'
import type { HomeStats } from '@/lib/home-stats'

type Props = {
  stats: HomeStats
}

export function HomeHero({ stats }: Props) {
  const items = [
    { label: 'Guides and explainers', value: stats.guides },
    { label: 'Store pages', value: stats.stores },
    { label: 'Categories', value: stats.categories }
  ]

  return (
    <section className="hero" aria-labelledby="home-title">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
      </div>
      <div className="hero__inner">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          Independent referral notes
        </p>
        <h1 id="home-title" className="hero__title">
          <span className="sr-only">Referral guides and provider terms</span>
          <span aria-hidden="true">
            <SplitWords text="Referral guides" />{' '}
            <span className="hero__title-accent">
              <SplitWords text="and provider terms" start={2} />
            </span>
          </span>
        </h1>
        <p className="hero__lede">
          Independent notes on partner links and coupons. Bonus amounts are not verified here. Eligibility depends on
          the provider, your account, and where you live.
        </p>
        <div className="hero__ctas">
          <TrackedLink href="/articles" className="btn btn--primary" data-magnetic event="home_hero_guides">
            <span>Read the guides</span>
            <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
          </TrackedLink>
          <TrackedLink href="/#coupons" className="btn btn--ghost" data-magnetic event="home_hero_codes">
            Browse codes
          </TrackedLink>
        </div>
        <dl className="hero__stats">
          {items.map((item, i) => (
            <div key={item.label} className="hero__stat">
              <dt>{item.label}</dt>
              <dd data-count={item.value} data-count-delay={0.9 + i * 0.12}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <BridgeArt />
    </section>
  )
}
