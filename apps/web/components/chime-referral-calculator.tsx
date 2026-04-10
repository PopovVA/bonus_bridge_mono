'use client'

import { useEffect, useId, useState } from 'react'
import { friendsInputValueAfterBlur, sanitizeFriendsDigitsInput } from '@/lib/chime-friends-field-ui'
import {
  CHIME_DIRECT_DEPOSIT_BONUS_USD,
  CHIME_FRIEND_BONUS_USD,
  CHIME_REFERRER_PER_FRIEND_USD,
  computeChimeReferralTotals,
  parseChimeFriendsField
} from '@/lib/chime-referral-calculator'
import { trackGtagEvent } from '@/lib/gtag-track'

type Props = {
  articleSlug: string
  /** When false, omit the card title so the page can provide a single section heading. */
  showHeading?: boolean
  /** When false, hide the short rules recap under the title (page copy already explains). */
  showLead?: boolean
}

export function ChimeReferralCalculator({ articleSlug, showHeading = true, showLead = true }: Props) {
  const friendsId = useId()
  const ddBonusLabelId = useId()

  const [friendsInput, setFriendsInput] = useState('2')
  const [includeDd, setIncludeDd] = useState(true)

  const friends = parseChimeFriendsField(friendsInput)

  const totals = computeChimeReferralTotals({
    friends,
    includeDirectDepositBonus: includeDd
  })

  useEffect(() => {
    const t = window.setTimeout(() => {
      trackGtagEvent('chime_calc_update', {
        article_slug: articleSlug,
        friends: totals.friends,
        include_dd: includeDd ? 1 : 0,
        your_total_usd: totals.yourTotalUsd
      })
    }, 400)
    return () => window.clearTimeout(t)
  }, [articleSlug, totals.friends, totals.yourTotalUsd, includeDd])

  return (
    <section
      className={`article-calculator app-surface-card${!showHeading && !showLead ? ' article-calculator--embedded' : ''}`}
      aria-labelledby={showHeading ? 'chime-calc-heading' : undefined}
      aria-label={showHeading ? undefined : 'Chime profit calculator'}
    >
      {showHeading ? (
        <h2 id="chime-calc-heading" className="article-calculator__title">
          Profit Calculator
        </h2>
      ) : null}
      {showLead ? (
        <p className="article-calculator__lead">
          ${CHIME_REFERRER_PER_FRIEND_USD} per qualifying friend, ${CHIME_FRIEND_BONUS_USD} to each friend, optional $
          {CHIME_DIRECT_DEPOSIT_BONUS_USD} direct-deposit bonus for you (money deposited by employer or government benefit,
          per offer rules). Totals follow friends and bonus toggles only.
        </p>
      ) : null}
      <div className="article-calculator__grid">
        <div className="article-calculator__controls">
          <label htmlFor={friendsId} className="article-calculator__label">
            Friends
          </label>
          <div className="article-calculator__controls-row">
            <input
              id={friendsId}
              className="article-calculator__input article-calculator__input--num"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              value={friendsInput}
              onChange={(e) => setFriendsInput(sanitizeFriendsDigitsInput(e.target.value))}
              onBlur={() => setFriendsInput((v) => friendsInputValueAfterBlur(v))}
            />
            <div className="article-calculator__dd-bundle">
              <p id={ddBonusLabelId} className="article-calculator__dd-toggle-label">
                Include my ${CHIME_DIRECT_DEPOSIT_BONUS_USD} direct-deposit bonus
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={includeDd}
                aria-labelledby={ddBonusLabelId}
                className="article-calculator__ios-switch"
                onClick={() => setIncludeDd((v) => !v)}
              >
                <span className="article-calculator__ios-switch-track" aria-hidden>
                  <span className="article-calculator__ios-switch-thumb" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <dl className="article-calculator__results">
        <div className="article-calculator__row">
          <dt>From friend referrals</dt>
          <dd>${totals.referrerFromFriendsUsd.toLocaleString('en-US')}</dd>
        </div>
        {includeDd ? (
          <div className="article-calculator__row">
            <dt>Your direct-deposit bonus (modeled)</dt>
            <dd>${totals.directDepositBonusUsd.toLocaleString('en-US')}</dd>
          </div>
        ) : null}
        <div className="article-calculator__row article-calculator__row--total">
          <dt>Estimated total for you</dt>
          <dd>${totals.yourTotalUsd.toLocaleString('en-US')}</dd>
        </div>
        <div className="article-calculator__row article-calculator__row--muted">
          <dt>Modeled total paid to friends (their bonuses)</dt>
          <dd>${totals.friendsReceiveTotalUsd.toLocaleString('en-US')}</dd>
        </div>
      </dl>
      <p className="article-calculator__footnote">
        Illustration only. Eligibility, limits, and posting dates are controlled by Chime and can change. Some promotions
        also mention SpotMe credits, not included here.
      </p>
    </section>
  )
}
