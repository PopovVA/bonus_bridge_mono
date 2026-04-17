import { REFERRAL_GUIDE_DISCLOSURE } from '@/lib/site-disclaimers'

/** Editorial disclosure for referral / bonus guides — place near the top of the article. */
export function ArticleReferralDisclosure() {
  return (
    <aside
      className="article-page__referral-disclosure app-surface-card"
      aria-label="Referral program disclosure"
    >
      <p className="article-page__referral-disclosure-text">{REFERRAL_GUIDE_DISCLOSURE}</p>
    </aside>
  )
}
