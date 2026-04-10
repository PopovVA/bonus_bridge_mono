import type { Metadata } from 'next'
import { LEGAL_CONTACT_EMAIL, LEGAL_DOCUMENT_LAST_UPDATED } from '@/lib/legal-site-meta'
import { absoluteUrl } from '@/app/seo'

const path = '/privacy'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How BonusBridge collects, uses, and shares information when you use our website. California and U.S. privacy rights.',
  alternates: {
    canonical: path
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Privacy Policy | BonusBridge',
    description:
      'How BonusBridge collects, uses, and shares information when you use our website. California and U.S. privacy rights.',
    url: absoluteUrl(path),
    type: 'website'
  }
}

export default function PrivacyPage() {
  const updated = new Date(LEGAL_DOCUMENT_LAST_UPDATED).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="legal-page">
      <h1 className="legal-page__title">Privacy Policy</h1>
      <p className="legal-page__updated">Last updated: {updated}</p>

      <p className="legal-page__notice">
        BonusBridge (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website available at the domain where this policy
        is posted (the &quot;Site&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard information when
        you visit or use the Site. It applies to visitors in the United States unless we state otherwise. This policy is
        provided for general informational purposes and does not create rights enforceable by third parties. If you need
        legal advice about your specific situation, consult a qualified attorney.
      </p>

      <section aria-labelledby="privacy-scope">
        <h2 id="privacy-scope">1. Scope</h2>
        <p>
          This Privacy Policy applies to information we process in connection with the Site. It does not apply to third
          party websites, apps, or services that we do not control, including when you follow links to a partner or
          merchant. Those services have their own privacy notices.
        </p>
      </section>

      <section aria-labelledby="privacy-collect">
        <h2 id="privacy-collect">2. Information we collect</h2>
        <p>Depending on how you use the Site, we may collect or receive the following categories of information.</p>
        <h3>2.1 Information you provide</h3>
        <p>
          We may collect information that you voluntarily provide when you contact us (for example, your email address
          and the contents of your message).
        </p>
        <h3>2.2 Information collected automatically</h3>
        <p>
          When you access the Site, we and our service providers may automatically collect certain technical information,
          such as your browser type, device type, operating system, approximate region derived from IP address, referring
          URLs, pages viewed, and the dates and times of visits. We may use cookies, pixels, and similar technologies as
          described below.
        </p>
      </section>

      <section aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies">3. Cookies and analytics</h2>
        <p>
          We may use cookies and similar technologies to operate the Site, remember preferences, measure traffic, and
          understand how visitors use our pages. We may use third party analytics tools (such as Google Analytics) that
          collect information about use of the Site and generate aggregated or statistical reports. Those providers may
          process information according to their own privacy policies and terms.
        </p>
        <p>
          You can control many cookies through your browser settings. Some browsers offer a &quot;Do Not Track&quot; setting. The
          Site may not respond to all such signals because there is no uniform industry standard for how to interpret
          them.
        </p>
      </section>

      <section aria-labelledby="privacy-use">
        <h2 id="privacy-use">4. How we use information</h2>
        <p>We use information for purposes such as:</p>
        <ul>
          <li>Providing, maintaining, and improving the Site and its content</li>
          <li>Understanding how visitors use the Site and measuring performance</li>
          <li>Communicating with you if you contact us</li>
          <li>Protecting the security and integrity of the Site</li>
          <li>Complying with law and enforcing our Terms of Service</li>
        </ul>
        <p>
          We do not use the Site to offer you individualized financial, legal, or tax advice, and we do not decide whether
          you qualify for any third party promotion or payout.
        </p>
      </section>

      <section aria-labelledby="privacy-share">
        <h2 id="privacy-share">5. How we share information</h2>
        <p>We may share information in the following circumstances:</p>
        <ul>
          <li>
            <strong>Service providers.</strong> We may share information with vendors that help us host the Site, analyze
            traffic, send email, or provide similar services. They are permitted to use information only as needed to
            perform services for us.
          </li>
          <li>
            <strong>Legal and safety.</strong> We may disclose information if we believe in good faith that disclosure is
            required by law, subpoena, or legal process, or to protect the rights, property, or safety of BonusBridge, our
            users, or others.
          </li>
          <li>
            <strong>Business transfers.</strong> If we are involved in a merger, acquisition, financing, or sale of assets,
            information may be transferred as part of that transaction, subject to appropriate safeguards.
          </li>
        </ul>
        <p>
          We do not sell your personal information for money. Where state law defines &quot;sale&quot; or &quot;sharing&quot; broadly to
          include certain advertising or analytics activities, we describe your choices in Section 6.
        </p>
      </section>

      <section aria-labelledby="privacy-rights">
        <h2 id="privacy-rights">6. Your privacy rights (United States)</h2>
        <p>
          Depending on where you live, you may have rights under state privacy laws, including in California, Colorado,
          Connecticut, Virginia, and other states as laws evolve. These rights may include, where applicable, the right to
          access, delete, or correct certain personal information, and the right to opt out of certain processing such as
          targeted advertising or &quot;sales&quot; as defined by law.
        </p>
        <p>
          California residents may have additional rights under the California Consumer Privacy Act (CCPA), as amended.
          Depending on the facts, we may be a &quot;business&quot; or another entity type under those laws. You may submit requests
          by contacting us using the email address in Section 11. We will verify your request as required by law and
          respond within the timeframes those laws require. You may also designate an authorized agent in writing where
          permitted by law.
        </p>
        <p>
          We will not discriminate against you for exercising privacy rights that apply to you, except as permitted by
          law (for example, certain loyalty programs may be treated differently only as allowed by statute).
        </p>
      </section>

      <section aria-labelledby="privacy-children">
        <h2 id="privacy-children">7. Children</h2>
        <p>
          The Site is not directed to children under 13 years of age, and we do not knowingly collect personal
          information from children under 13. If you believe we have collected information from a child under 13, please
          contact us and we will take appropriate steps to delete it.
        </p>
      </section>

      <section aria-labelledby="privacy-security">
        <h2 id="privacy-security">8. Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational measures designed to protect information we
          maintain. No method of transmission over the Internet or electronic storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section aria-labelledby="privacy-retention">
        <h2 id="privacy-retention">9. Retention</h2>
        <p>
          We retain information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless
          a longer period is required or permitted by law. Actual retention periods depend on the nature of the data and
          our business needs.
        </p>
      </section>

      <section aria-labelledby="privacy-changes">
        <h2 id="privacy-changes">10. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated version on the Site and revise the
          &quot;Last updated&quot; date above. If changes are material, we may provide additional notice as required by law. Your
          continued use of the Site after the effective date of an update constitutes your acceptance of the revised
          policy, to the extent permitted by law.
        </p>
      </section>

      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact">11. Contact</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise privacy rights that may apply to you, contact
          us at{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
      </section>
    </article>
  )
}
