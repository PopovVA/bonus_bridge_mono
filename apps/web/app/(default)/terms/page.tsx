import type { Metadata } from 'next'
import { LEGAL_CONTACT_EMAIL, LEGAL_DOCUMENT_LAST_UPDATED } from '@/lib/legal-site-meta'
import { absoluteUrl } from '@/app/seo'

const path = '/terms'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms governing use of BonusBridge. Informational content only. No guarantee of third party offers, payouts, or eligibility.',
  alternates: {
    canonical: path
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Terms of Service | BonusBridge',
    description:
      'Terms governing use of BonusBridge. Informational content only. No guarantee of third party offers, payouts, or eligibility.',
    url: absoluteUrl(path),
    type: 'website'
  }
}

export default function TermsPage() {
  const updated = new Date(LEGAL_DOCUMENT_LAST_UPDATED).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="legal-page">
      <h1 className="legal-page__title">Terms of Service</h1>
      <p className="legal-page__updated">Last updated: {updated}</p>

      <p className="legal-page__notice">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the BonusBridge website and related content
        made available at the domain where these Terms are posted (the &quot;Site&quot;). By accessing or using the Site, you
        agree to these Terms. If you do not agree, do not use the Site. BonusBridge provides general information about
        publicly described partner, referral, and promotional programs offered by third parties. We do not guarantee that
        any offer is available, accurate, or will result in any payment or benefit to you. These Terms include important
        disclaimers and limitations of liability. Read them carefully. This document is not legal advice. If you need
        advice about your rights or obligations, consult a qualified professional.
      </p>

      <section aria-labelledby="terms-accept">
        <h2 id="terms-accept">1. Agreement to these Terms</h2>
        <p>
          You represent that you are at least 18 years old (or the age of majority in your jurisdiction) and have the legal
          capacity to enter into these Terms. If you use the Site on behalf of an organization, you represent that you
          have authority to bind that organization.
        </p>
      </section>

      <section aria-labelledby="terms-service">
        <h2 id="terms-service">2. The Site is an information resource</h2>
        <p>
          BonusBridge publishes editorial summaries, listings, tools (such as calculators), and links that may describe
          third party programs, including referral bonuses, coupons, and similar promotions. The Site is intended to help
          you discover and compare publicly described opportunities. We may earn compensation when you use certain partner
          links, as explained in Section 6.
        </p>
        <p>
          <strong>
            We do not process payments, operate bank accounts, issue rewards, or decide whether you qualify for any third
            party offer.
          </strong>{' '}
          Any payout, credit, or benefit is provided solely by the applicable third party according to its own rules,
          timelines, and eligibility requirements. Your relationship with any merchant, bank, or platform is strictly
          between you and that third party.
        </p>
      </section>

      <section aria-labelledby="terms-not-advice">
        <h2 id="terms-not-advice">3. No professional advice</h2>
        <p>
          Nothing on the Site is financial, investment, legal, tax, or accounting advice. Offers change frequently and may
          depend on your location, credit profile, employment, tax status, and other factors we do not evaluate. You are
          solely responsible for reviewing official terms, privacy notices, and disclosures on third party websites before
          you apply, enroll, deposit funds, or share personal information.
        </p>
      </section>

      <section aria-labelledby="terms-no-guarantee">
        <h2 id="terms-no-guarantee">4. No guarantee of offers, amounts, or payouts</h2>
        <p>
          Program details on the Site are based on information we believe to be reliable at the time of publication, but
          they may be incomplete, outdated, or summarized for readability. Third parties may change or withdraw offers at
          any time without notice to us.
        </p>
        <p>
          <strong>
            BonusBridge does not guarantee that any offer is still available, that you will be approved, or that any
            stated dollar amount will be paid.
          </strong>{' '}
          To the fullest extent permitted by law, we are not responsible for any loss, missed opportunity, tax
          consequence, or other outcome related to your reliance on information on the Site or your participation in any
          third party program.
        </p>
      </section>

      <section aria-labelledby="terms-affiliate">
        <h2 id="terms-affiliate">5. Affiliate and partner relationships</h2>
        <p>
          Some links on the Site are referral or affiliate links. We may receive compensation, credits, or other benefits
          when you click those links or complete qualifying actions with a partner. Compensation arrangements do not
          increase the cost you pay to a third party for the same offer in the ordinary course, but offers vary and you
          should always confirm terms on the partner&apos;s official site.
        </p>
        <p>
          Compensation may influence which offers we highlight or how we describe them, but we aim to present information
          accurately. Regardless of any relationship, Section 4 applies: we do not control third party payouts.
        </p>
      </section>

      <section aria-labelledby="terms-calculators">
        <h2 id="terms-calculators">6. Calculators and estimates</h2>
        <p>
          Any calculator or modeled figure on the Site is for illustration only. Results depend on assumptions shown on
          the page and on rules that third parties may change. Calculators are not promises of income, bonuses, or tax
          treatment.
        </p>
      </section>

      <section aria-labelledby="terms-conduct">
        <h2 id="terms-conduct">7. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Site in violation of law or third party rights</li>
          <li>Attempt to gain unauthorized access to our systems, other users, or third party services</li>
          <li>Transmit malware, scrape the Site in a way that impairs performance, or bypass technical measures</li>
          <li>Use automated means to access the Site in bulk without our prior written consent, except as allowed by public
            search engines for indexing</li>
          <li>Impersonate any person or misrepresent your affiliation</li>
        </ul>
        <p>We may suspend or terminate access if we believe you have violated these Terms or pose a risk to the Site.</p>
      </section>

      <section aria-labelledby="terms-ip">
        <h2 id="terms-ip">8. Intellectual property</h2>
        <p>
          The Site, including its design, text, graphics, logos, and selection and arrangement of content, is owned by
          BonusBridge or its licensors and is protected by copyright, trademark, and other laws. Subject to these Terms,
          we grant you a limited, non exclusive, non transferable, revocable license to access and use the Site for personal,
          non commercial use. You may not copy, modify, distribute, sell, or create derivative works from the Site
          except as allowed by law or with our prior written consent.
        </p>
        <p>
          Third party names, logos, and marks appearing on the Site are the property of their respective owners and are
          used for identification only. Use on the Site does not imply endorsement by those third parties beyond what is
          stated in our content.
        </p>
      </section>

      <section aria-labelledby="terms-disclaimer">
        <h2 id="terms-disclaimer">9. Disclaimer of warranties</h2>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND,
          WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, AND NON INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR
          FREE, OR FREE OF HARMFUL COMPONENTS. SOME JURISDICTIONS DO NOT ALLOW CERTAIN DISCLAIMERS, SO SOME OF THE ABOVE
          MAY NOT APPLY TO YOU.
        </p>
      </section>

      <section aria-labelledby="terms-liability">
        <h2 id="terms-liability">10. Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, BONUSBRIDGE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AND
          AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
          DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR
          USE OF THE SITE OR ANY THIRD PARTY OFFER, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATED TO THE SITE OR
          THESE TERMS WILL NOT EXCEED THE GREATER OF (A) ONE HUNDRED U.S. DOLLARS (USD $100) OR (B) THE AMOUNTS YOU PAID US,
          IF ANY, FOR USE OF THE SITE IN THE TWELVE (12) MONTHS BEFORE THE CLAIM. BECAUSE THE SITE IS PROVIDED FREE OF
          CHARGE TO USERS, THIS LIMITATION REFLECTS A REASONABLE ALLOCATION OF RISK.
        </p>
        <p>
          SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO THESE LIMITS MAY NOT APPLY TO YOU. IN THAT CASE, OUR
          LIABILITY WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section aria-labelledby="terms-indemnity">
        <h2 id="terms-indemnity">11. Indemnity</h2>
        <p>
          You will defend, indemnify, and hold harmless BonusBridge and its officers, directors, employees, and
          contractors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable
          attorneys&apos; fees) arising out of or related to your use of the Site, your violation of these Terms, or your
          interaction with any third party offer, except to the extent caused by our gross negligence or willful misconduct.
        </p>
      </section>

      <section aria-labelledby="terms-governing">
        <h2 id="terms-governing">12. Governing law and venue</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware and applicable United States federal law, without
          regard to conflict of law principles that would require application of another jurisdiction&apos;s laws. Subject to
          Section 13, you agree that the state and federal courts located in Delaware will have exclusive jurisdiction over
          any dispute arising out of or related to the Site or these Terms, and you consent to personal jurisdiction
          there.
        </p>
      </section>

      <section aria-labelledby="terms-disputes">
        <h2 id="terms-disputes">13. Informal resolution</h2>
        <p>
          Before filing a claim in court, you agree to contact us at the email address in Section 15 and give us at least
          thirty (30) days to try to resolve the dispute informally. If we cannot resolve the dispute within that period,
          either party may pursue remedies available under law.
        </p>
      </section>

      <section aria-labelledby="terms-general">
        <h2 id="terms-general">14. General</h2>
        <p>
          <strong>Entire agreement.</strong> These Terms and our Privacy Policy constitute the entire agreement between you
          and BonusBridge regarding the Site and supersede prior understandings on that subject.
        </p>
        <p>
          <strong>Severability.</strong> If any provision is held invalid or unenforceable, the remaining provisions remain
          in effect.
        </p>
        <p>
          <strong>Assignment.</strong> You may not assign these Terms without our consent. We may assign our rights and
          obligations in connection with a merger, acquisition, or sale of assets.
        </p>
        <p>
          <strong>No waiver.</strong> Failure to enforce any provision is not a waiver of our rights.
        </p>
        <p>
          <strong>Electronic communications.</strong> You consent to receive notices and agreements electronically through
          the Site or email.
        </p>
      </section>

      <section aria-labelledby="terms-contact">
        <h2 id="terms-contact">15. Contact</h2>
        <p>
          Questions about these Terms may be sent to{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
      </section>
    </article>
  )
}
