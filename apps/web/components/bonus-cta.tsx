import { ArrowUpRight } from 'lucide-react'
import { TrackedOutboundLink } from '@/components/tracked-link'
import { formatCheckedDate, type SignupBonus } from '@/lib/signup-bonuses'

type Props = {
  bonus: SignupBonus
  /** GA4 `place` param, e.g. home_hero, store_page. */
  place: string
  /** panel: amount + condition + button + fine print. inline: button + fine print only. */
  variant?: 'panel' | 'inline'
}

/** Fine print shown next to every bonus button: who sets the terms, when we checked, and the source. */
export function BonusFinePrint({ bonus }: { bonus: SignupBonus }) {
  return (
    <p className="bonus-cta__fine">
      Terms apply and are set by {bonus.setBy ?? bonus.provider}. Checked {formatCheckedDate(bonus.checkedAt)}.{' '}
      <a href={bonus.sourceUrl} target="_blank" rel="noopener noreferrer">
        Official terms
      </a>
    </p>
  )
}

export function BonusButton({ bonus, place, className = '' }: { bonus: SignupBonus; place: string; className?: string }) {
  return (
    <TrackedOutboundLink
      href={bonus.referralUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`btn btn--accent ${className}`.trim()}
      data-magnetic
      partnerSlug={bonus.slug}
      event="bonus_cta"
      eventParams={{ store_slug: bonus.slug, place }}
    >
      <span>{bonus.ctaLabel}</span>
      <ArrowUpRight size={18} strokeWidth={2.25} aria-hidden />
    </TrackedOutboundLink>
  )
}

export function BonusCta({ bonus, place, variant = 'panel' }: Props) {
  if (variant === 'inline') {
    return (
      <div className="bonus-cta bonus-cta--inline">
        <BonusButton bonus={bonus} place={place} />
        <BonusFinePrint bonus={bonus} />
      </div>
    )
  }
  return (
    <div className="bonus-cta bonus-cta--panel">
      <p className="bonus-cta__lead">
        {bonus.amount ? <strong className="bonus-cta__amount">{bonus.amount}</strong> : null}
        <span className="bonus-cta__headline">{bonus.headline}</span>
      </p>
      <p className="bonus-cta__condition">{bonus.condition}</p>
      <BonusButton bonus={bonus} place={place} />
      <BonusFinePrint bonus={bonus} />
    </div>
  )
}
