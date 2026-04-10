import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for BonusBridge.',
  alternates: {
    canonical: '/terms'
  }
}

export default function TermsPage() {
  return (
    <section>
      <h1 className="title">Terms of Service</h1>
      <p className="meta">Terms of service content — coming soon.</p>
    </section>
  )
}
