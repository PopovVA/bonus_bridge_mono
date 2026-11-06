import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl } from '@/app/seo'
import { COMPLIANCE_PAGES_UPDATED, LEGAL_CONTACT_EMAIL } from '@/lib/legal-site-meta'

const path = '/cookies'

export const metadata: Metadata = {
  title: { absolute: 'Cookie Notice | BonusBridge' },
  description:
    'How BonusBridge uses cookies, how referral links may set provider cookies, and how to control them in your browser.',
  alternates: { canonical: path },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Cookie Notice | BonusBridge',
    description:
      'How BonusBridge uses cookies, how referral links may set provider cookies, and how to control them in your browser.',
    url: absoluteUrl(path),
    type: 'website'
  }
}

export default function CookiesPage() {
  const updated = new Date(`${COMPLIANCE_PAGES_UPDATED}T12:00:00.000Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })

  return (
    <article className="legal-page">
      <h1 className="legal-page__title">Cookie Notice</h1>
      <p className="legal-page__updated">Last updated: {updated}</p>
      <p className="legal-page__notice">
        This notice explains cookies on BonusBridge. It is here so shopping-portal programs that allow a public website,
        including TopCashback, can see a cookie policy next to our privacy policy. The notice does not block the site.
      </p>
      <section aria-labelledby="cookies-what">
        <h2 id="cookies-what">Cookies we use</h2>
        <ul>
          <li>Essential cookies that keep the site working, including a preference that remembers if you dismissed the cookie notice.</li>
          <li>Analytics cookies, such as Google Analytics, that measure traffic in aggregate. They load on public hosts, not on local loopback during development.</li>
        </ul>
      </section>
      <section aria-labelledby="cookies-referral">
        <h2 id="cookies-referral">Referral and affiliate cookies</h2>
        <p>
          When you leave BonusBridge through a referral or affiliate link, the provider (for example Rakuten or
          TopCashback) may set its own cookies to track a signup or a purchase. Those cookies belong to the provider.
          We do not control their expiry or the categories they exclude.
        </p>
      </section>
      <section aria-labelledby="cookies-control">
        <h2 id="cookies-control">Your choices</h2>
        <p>
          You can block or delete cookies in your browser settings. Blocking analytics cookies does not remove content
          from the pages. Blocking all cookies may hide the memory of a dismissed notice, so the short banner can return
          on a later visit.
        </p>
        <p>
          Privacy questions: <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. See also the{' '}
          <Link href="/privacy">Privacy Policy</Link> and <Link href="/disclosures">referral disclosures</Link>.
        </p>
      </section>
    </article>
  )
}
