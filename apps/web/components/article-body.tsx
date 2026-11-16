import Link from 'next/link'
import { ArticlePartnerFigure } from '@/components/article-partner-figure'
import { BonusCta } from '@/components/bonus-cta'
import { TrackedOutboundLink } from '@/components/tracked-link'
import {
  type ArticleBlock,
  type ArticleDocument,
  type ArticleInline,
  type ArticleSection
} from '@/lib/articles/chime-document'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { requireSignupBonus } from '@/lib/signup-bonuses'

function InlineParts({ parts }: { parts: ArticleInline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        part.kind === 'link' ? (
          <Link key={`${part.href}-${index}`} href={part.href}>
            {part.label}
          </Link>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        )
      )}
    </>
  )
}

function ArticleBlockView({ block, doc }: { block: ArticleBlock; doc: ArticleDocument }) {
  if (block.type === 'p') {
    return (
      <p className={block.lede ? 'article-page__lede' : undefined}>
        <InlineParts parts={block.parts} />
      </p>
    )
  }
  if (block.type === 'ul') {
    return (
      <ul className="article-page__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'figure') {
    const figure = block.figure
    return (
      <ArticlePartnerFigure
        articleSlug={doc.slug}
        imageKey={figure.imageKey}
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes={figure.sizes}
        priority={figure.priority}
        caption={figure.caption}
        partnerOfferCta={figure.partnerOfferCta}
      />
    )
  }
  if (block.type === 'disclosure') {
    return <p>{FTC_AFFILIATE_DISCLOSURE}</p>
  }
  if (block.type === 'cta') {
    return <BonusCta bonus={requireSignupBonus(block.slug)} place={block.place} />
  }
  if (block.type === 'faqs') {
    return (
      <>
        {doc.faqs.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </>
    )
  }
  return (
    <p>
      <TrackedOutboundLink
        href={block.href}
        className="article-page__terms-link"
        event={block.event}
        eventParams={{ article_slug: doc.slug }}
        rel="noopener noreferrer"
        target="_blank"
      >
        {block.label}
      </TrackedOutboundLink>
    </p>
  )
}

function sectionClass(section: ArticleSection): string {
  if (section.variant === 'disclaimer') return 'article-page__disclaimer app-surface-card'
  return 'article-page__section'
}

export function ArticleBody({ doc }: { doc: ArticleDocument }) {
  return (
    <>
      {doc.sections.map((section) => (
        <section
          key={section.id}
          className={sectionClass(section)}
          aria-labelledby={section.id}
        >
          <h2 id={section.id} className={section.variant === 'disclaimer' ? 'article-page__disclaimer-title' : undefined}>
            {section.heading}
          </h2>
          {section.blocks.map((block, index) => (
            <ArticleBlockView key={`${section.id}-${index}`} block={block} doc={doc} />
          ))}
        </section>
      ))}
    </>
  )
}
