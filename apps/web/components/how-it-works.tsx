import { SITE_OPERATOR_NOTICE } from '@/lib/site-disclaimers'

/* Copy is lifted from the site's existing guide and listing intros; nothing new is claimed here. */
const STEPS = [
  {
    title: 'Read the guide',
    body: 'Plain-English summaries of sign-up and referral offers: how the terms work and which eligibility details to confirm.'
  },
  {
    title: 'Check the provider terms',
    body: 'Each guide links the provider’s terms and says what we will not promise.'
  },
  {
    title: 'Confirm on the provider site',
    body: 'Eligibility, amounts, and timing are set by each provider and can change. Read the official terms before you sign up.'
  }
]

export function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-heading">
      <div className="how__intro" data-reveal>
        <p className="how__kicker">How to use BonusBridge</p>
        <h2 id="how-heading" className="how__title">
          Three steps across the bridge.
        </h2>
        <p className="how__note">{SITE_OPERATOR_NOTICE}</p>
      </div>
      <div className="how__track">
        <span className="how__line" aria-hidden="true">
          <span className="how__line-fill" />
        </span>
        <ol className="how-steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="how-step">
              <span className="how-step__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="how-step__title">{step.title}</h3>
              <p className="how-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
