import type { Metadata } from 'next'
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-site-meta'
import { absoluteUrl } from '@/app/seo'

const path = '/contact'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact BonusBridge — independent informational site about referral bonuses and offers. Email support for questions about the site.',
  alternates: {
    canonical: path
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Contact | BonusBridge',
    description:
      'Contact BonusBridge — independent informational site about referral bonuses and offers. Email support for questions about the site.',
    url: absoluteUrl(path),
    type: 'website'
  }
}

export default function ContactPage() {
  return (
    <article className="legal-page">
      <h1 className="legal-page__title">Contact</h1>
      <p className="legal-page__notice">
        BonusBridge is an independent informational website. We summarize publicly described referral and promotional
        programs; we are not a bank, broker, or financial institution.
      </p>
      <p>
        For questions about this website, privacy requests, or corrections to our editorial content, email{' '}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
      </p>
      <p className="legal-page__notice">
        We cannot answer account-specific questions for third-party brands. For eligibility, payouts, or product support,
        please use the official channels listed on the provider&apos;s website.
      </p>
    </article>
  )
}
