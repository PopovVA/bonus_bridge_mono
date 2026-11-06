import Link from 'next/link'
import { TrackedOutboundLink } from '@/components/tracked-link'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { formatGuideDate, guideJsonLd, type Guide, type GuideLink } from '@/lib/guides'

function GuideTextLink({ link }: { link: GuideLink }) {
  if (link.href.startsWith('/')) {
    return <Link href={link.href}>{link.label}</Link>
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label}
    </a>
  )
}

type Props = {
  guide: Guide
}

export function GuideArticle({ guide }: Props) {
  const updated = formatGuideDate(guide.updatedAt)

  return (
    <article className="article-page guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(guide)) }} />
      <nav className="guide-page__crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/guides">Guides</Link>
        <span aria-hidden="true"> / </span>
        <span>{guide.h1}</span>
      </nav>
      <header className="article-page__header">
        <p className="article-page__eyebrow">Comparison guide</p>
        <h1 className="article-page__title">{guide.h1}</h1>
        <p className="article-page__meta">
          Updated <time dateTime={guide.updatedAt}>{updated}</time>
        </p>
      </header>
      <aside className="article-page__referral-disclosure app-surface-card" aria-label="Affiliate disclosure">
        <p className="article-page__referral-disclosure-text">{FTC_AFFILIATE_DISCLOSURE}</p>
      </aside>
      {guide.sections.map((section) => (
        <section key={section.id} className="article-page__section" aria-labelledby={section.id}>
          <h2 id={section.id}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="article-page__list">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="guide-page__links">
            {section.links.map((link) => (
              <GuideTextLink key={link.href} link={link} />
            ))}
          </p>
        </section>
      ))}
      <section className="article-page__section" aria-labelledby={`${guide.slug}-table`}>
        <h2 id={`${guide.slug}-table`}>{guide.table.caption}</h2>
        <div className="guide-page__table-wrap">
          <table className="guide-page__table">
            <caption className="guide-page__caption">{guide.table.caption}</caption>
            <thead>
              <tr>
                {guide.table.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.table.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} data-label={guide.table.columns[index]}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="article-page__section" aria-labelledby={`${guide.slug}-faq`}>
        <h2 id={`${guide.slug}-faq`}>Questions people ask</h2>
        {guide.faqs.map((faq) => (
          <div key={faq.question} className="guide-page__faq">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
      <section className="article-page__section" aria-labelledby={`${guide.slug}-next`}>
        <h2 id={`${guide.slug}-next`}>Continue</h2>
        <ul className="article-page__list">
          {guide.related.map((link) => (
            <li key={link.href}>
              <GuideTextLink link={link} />
            </li>
          ))}
        </ul>
        <p className="guide-page__cta-note">{FTC_AFFILIATE_DISCLOSURE}</p>
        <div className="guide-page__ctas">
          {guide.outbound.map((link) => (
            <TrackedOutboundLink
              key={link.href}
              href={link.href}
              className="category-store-cta"
              target="_blank"
              rel="noopener noreferrer sponsored"
              event="guide_outbound"
              eventParams={{ guide_slug: guide.slug }}
            >
              {link.label}
            </TrackedOutboundLink>
          ))}
        </div>
      </section>
    </article>
  )
}
