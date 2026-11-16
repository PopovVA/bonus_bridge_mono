import { absoluteUrl } from '@/app/seo'
import {
  articleDocuments,
  type ArticleBlock,
  type ArticleDocument,
  type ArticleInline
} from '@/lib/articles/chime-document'
import { getArticleBySlug } from '@/lib/articles/list'
import { formatGuideDate, guideList, type Guide, type GuideLink, type GuideTable } from '@/lib/guides'
import { isPublicStoreSlug, getReferralProgram } from '@/lib/referral-programs'
import { renderPromosMarkdown, withStorePromoMarkdown } from '@/lib/promo-entries'
import { promos } from '@/lib/promos'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { getOffers, getServiceBySlug, getServices } from '@/lib/site-data'
import { formatCheckedDate, getSignupBonus, storeFaqs, type SignupBonus } from '@/lib/signup-bonuses'

function mdHref(href: string): string {
  return href.startsWith('/') ? absoluteUrl(href) : href
}

function mdLink(link: GuideLink): string {
  return `[${link.label}](${mdHref(link.href)})`
}

function inlineMarkdown(parts: ArticleInline[]): string {
  return parts
    .map((part) => (part.kind === 'link' ? mdLink({ href: part.href, label: part.label }) : part.text))
    .join('')
}

function renderTable(table: GuideTable): string[] {
  const lines = [`## ${table.caption}`, '']
  const headers = table.columns.slice(1)
  for (const row of table.rows) {
    const details = headers.map((header, index) => `${header}: ${row[index + 1]}`).join('. ')
    lines.push(`- **${row[0]}.** ${details}`)
  }
  return lines
}

export function renderGuideMarkdown(guide: Guide): string {
  const lines: string[] = [
    `# ${guide.h1}`,
    '',
    `Canonical: ${absoluteUrl(`/guides/${guide.slug}`)}`,
    `Published: ${formatGuideDate(guide.publishedAt)}`,
    `Updated: ${formatGuideDate(guide.updatedAt)}`,
    '',
    FTC_AFFILIATE_DISCLOSURE,
    ''
  ]
  for (const section of guide.sections) {
    lines.push(`## ${section.heading}`, '')
    for (const paragraph of section.paragraphs) lines.push(paragraph, '')
    for (const bullet of section.bullets) lines.push(`- ${bullet}`)
    lines.push('')
    for (const link of section.links) lines.push(`- ${mdLink(link)}`)
    lines.push('')
  }
  lines.push(...renderTable(guide.table), '')
  lines.push('## Questions people ask', '')
  for (const faq of guide.faqs) {
    lines.push(`### ${faq.question}`, '', faq.answer, '')
  }
  lines.push('## Continue', '')
  for (const link of guide.related) lines.push(`- ${mdLink(link)}`)
  lines.push('', FTC_AFFILIATE_DISCLOSURE, '')
  for (const link of guide.outbound) lines.push(`- ${mdLink(link)}`)
  lines.push('')
  return lines.join('\n')
}

function articleBlockMarkdown(block: ArticleBlock, doc: ArticleDocument): string[] {
  if (block.type === 'p') return [inlineMarkdown(block.parts), '']
  if (block.type === 'ul') return [...block.items.map((item) => `- ${item}`), '']
  if (block.type === 'figure') {
    const figure = block.figure
    const lines = [`![${figure.alt}](${absoluteUrl(figure.src)})`]
    if (figure.caption) lines.push('', figure.caption)
    return [...lines, '']
  }
  if (block.type === 'disclosure') return [FTC_AFFILIATE_DISCLOSURE, '']
  if (block.type === 'cta') {
    const bonus = getSignupBonus(block.slug)
    if (!bonus) return []
    return [`- ${mdLink({ href: bonus.referralUrl, label: bonus.ctaLabel })}`, '']
  }
  if (block.type === 'faqs') {
    return doc.faqs.flatMap((faq) => [`### ${faq.question}`, '', faq.answer, ''])
  }
  return [`- ${mdLink({ href: block.href, label: block.label })}`, '']
}

export function renderArticleMarkdown(doc: ArticleDocument): string {
  const meta = getArticleBySlug(doc.slug)
  if (!meta) throw new Error(`No article list row for ${doc.slug}`)
  const lines: string[] = [
    `# ${meta.title}`,
    '',
    meta.description,
    '',
    `Canonical: ${absoluteUrl(`/articles/${doc.slug}`)}`,
    `Published: ${formatGuideDate(meta.publishedAt)}`,
    `Updated: ${formatGuideDate(doc.updatedAt)}`,
    '',
    doc.disclosure,
    '',
    doc.trademark,
    ''
  ]
  for (const section of doc.sections) {
    lines.push(`## ${section.heading}`, '')
    for (const block of section.blocks) lines.push(...articleBlockMarkdown(block, doc))
  }
  return lines.join('\n')
}

export function renderStoreMarkdown(input: {
  name: string
  slug: string
  description: string | null | undefined
  bonus: SignupBonus | null
  termsUrl: string | null
  offers: { title: string; previewText: string; terms?: string | null }[]
}): string {
  const lines: string[] = [
    `# ${input.name}`,
    '',
    `Canonical: ${absoluteUrl(`/stores/${input.slug}`)}`,
    ''
  ]
  if (input.bonus) {
    lines.push(`Checked: ${formatCheckedDate(input.bonus.checkedAt)}`, '')
  }
  lines.push(FTC_AFFILIATE_DISCLOSURE, '')
  const about = input.description?.trim()
  if (about) lines.push('## About this store', '', about, '')
  if (input.bonus) {
    const lead = input.bonus.amount ? `${input.bonus.amount} ${input.bonus.headline}` : input.bonus.headline
    lines.push('## Referral offer', '', lead, '', input.bonus.condition, '')
    lines.push(`- ${mdLink({ href: input.bonus.referralUrl, label: input.bonus.ctaLabel })}`, '')
    lines.push(
      `Checked ${formatCheckedDate(input.bonus.checkedAt)}. Source: ${mdLink({
        href: input.bonus.sourceUrl,
        label: 'Official terms'
      })}`,
      ''
    )
    lines.push('## Questions', '')
    for (const faq of storeFaqs(input.bonus)) {
      lines.push(`### ${faq.question}`, '', faq.answer, '')
    }
  } else {
    lines.push('A current bonus amount is not verified on BonusBridge.', '')
  }
  if (input.termsUrl && !input.bonus) {
    lines.push(`- ${mdLink({ href: input.termsUrl, label: 'Official program terms' })}`, '')
  }
  for (const offer of input.offers) {
    lines.push(`## ${offer.title}`, '', offer.previewText, '')
    if (offer.terms) lines.push(offer.terms, '')
  }
  return lines.join('\n')
}

export function referralTermsUrl(slug: string): string | null {
  const program = getReferralProgram(slug)
  if (!program) return null
  return program.termsUrl
}

export async function storeMarkdownBySlug(slug: string): Promise<string | null> {
  if (!isPublicStoreSlug(slug)) return null
  const store = await getServiceBySlug(slug)
  const offers = await getOffers({ service: slug, status: 'active' })
  return withStorePromoMarkdown(
    renderStoreMarkdown({
      name: store.name,
      slug: store.slug,
      description: store.description,
      bonus: getSignupBonus(slug),
      termsUrl: referralTermsUrl(slug),
      offers: offers.map((offer) => ({
        title: offer.title,
        previewText: offer.previewText,
        terms: offer.terms
      }))
    }),
    slug,
    promos,
    new Date()
  )
}

export async function markdownByKind(kind: string, slug: string): Promise<string | null> {
  if (kind === 'guides') {
    const guide = guideList.find((item) => item.slug === slug)
    return guide ? renderGuideMarkdown(guide) : null
  }
  if (kind === 'articles') {
    const doc = articleDocuments.find((item) => item.slug === slug)
    return doc ? renderArticleMarkdown(doc) : null
  }
  if (kind === 'stores') return storeMarkdownBySlug(slug)
  return null
}

export async function buildLlmsFullTxt(): Promise<string> {
  const stores = await getServices()
  const chunks: string[] = [
    '# BonusBridge',
    '',
    '> Full text of the public guides, articles, store pages, and the promo codes page. Generated from the same records as the HTML pages.',
    '',
    FTC_AFFILIATE_DISCLOSURE,
    ''
  ]
  for (const guide of guideList) chunks.push(renderGuideMarkdown(guide), '')
  for (const doc of articleDocuments) chunks.push(renderArticleMarkdown(doc), '')
  for (const store of stores) {
    const offers = await getOffers({ service: store.slug, status: 'active' })
    chunks.push(
      withStorePromoMarkdown(
        renderStoreMarkdown({
          name: store.name,
          slug: store.slug,
          description: store.description,
          bonus: getSignupBonus(store.slug),
          termsUrl: referralTermsUrl(store.slug),
          offers: offers.map((offer) => ({
            title: offer.title,
            previewText: offer.previewText,
            terms: offer.terms
          }))
        }),
        store.slug,
        promos,
        new Date()
      ),
      ''
    )
  }
  const knownSlugs = new Set(stores.map((store) => store.slug))
  chunks.push(renderPromosMarkdown(promos, new Date(), knownSlugs), '')
  return `${chunks.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}
