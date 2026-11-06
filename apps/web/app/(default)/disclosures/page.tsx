import type { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl } from '@/app/seo'
import { COMPLIANCE_PAGES_UPDATED } from '@/lib/legal-site-meta'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { referralPrograms, type ReferralProgram } from '@/lib/referral-programs'

const path = '/disclosures'

function TermsLink({ program }: { program: ReferralProgram }) {
  if (!program.termsUrl) return null
  return (
    <a href={program.termsUrl} rel="noopener noreferrer">
      Official terms
    </a>
  )
}

export const metadata: Metadata = {
  title: { absolute: 'Referral Disclosures | BonusBridge' },
  description:
    'How BonusBridge chooses referral links, which programs stay public, and why personal-only invites are left off the site.',
  alternates: { canonical: path },
  openGraph: {
    title: 'Referral Disclosures | BonusBridge',
    description:
      'How BonusBridge chooses referral links, which programs stay public, and why personal-only invites are left off the site.',
    url: absoluteUrl(path),
    siteName: 'BonusBridge',
    type: 'website'
  }
}

export default function DisclosuresPage() {
  const updated = new Date(`${COMPLIANCE_PAGES_UPDATED}T12:00:00.000Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
  const listed = referralPrograms.filter((program) => program.publicOk)
  const unlisted = referralPrograms.filter((program) => !program.publicOk)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Disclosures', item: absoluteUrl(path) }
        ]
      },
      {
        '@type': 'Article',
        headline: 'How BonusBridge vets referral programs',
        dateModified: `${COMPLIANCE_PAGES_UPDATED}T12:00:00.000Z`,
        author: { '@type': 'Organization', name: 'BonusBridge' },
        publisher: { '@type': 'Organization', name: 'BonusBridge' }
      }
    ]
  }

  return (
    <article className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="legal-page__title">How we vet referral programs</h1>
      <p className="legal-page__updated">Last updated: {updated}</p>
      <p className="legal-page__notice">{FTC_AFFILIATE_DISCLOSURE}</p>
      <section aria-labelledby="disclosures-method">
        <h2 id="disclosures-method">What we check</h2>
        <p>
          A program stays on public store cards, category grids, the homepage, and the sitemap only when its current US
          terms allow posting on a website we own, and when we can describe the offer without inventing a dollar amount.
          If the terms limit sharing to friends and family, ban commercial use, or were not found, the personal link
          comes off the public site.
        </p>
        <p>
          Old store URLs for unlisted programs stay reachable as plain explanations. They do not include a personal
          referral link, and search engines are asked not to index them.
        </p>
      </section>
      <section aria-labelledby="disclosures-listed">
        <h2 id="disclosures-listed">Listed on BonusBridge</h2>
        <ul>
          {listed.map((program) => (
            <li key={program.slug}>
              <strong>{program.name}.</strong> {program.maxClaimText} <TermsLink program={program} />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="disclosures-unlisted">
        <h2 id="disclosures-unlisted">Not listed publicly</h2>
        <ul>
          {unlisted.map((program) => (
            <li key={program.slug}>
              <strong>{program.name}.</strong> {program.disclosures[0]} <TermsLink program={program} />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="disclosures-log">
        <h2 id="disclosures-log">Update log</h2>
        <p>
          November 5, 2026: removed public referral cards whose terms are personal-only, unverified, or not actually
          referral links. Rewrote Rakuten, TopCashback, Lyft, Chime, and PayPal Honey copy to match those programs’
          published rules.
        </p>
        <p>
          Read the <Link href="/guides">comparison guides</Link>, <Link href="/privacy">Privacy Policy</Link>, and{' '}
          <Link href="/cookies">Cookie Notice</Link>.
        </p>
      </section>
    </article>
  )
}
