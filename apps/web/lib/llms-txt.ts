import { absoluteUrl } from '@/app/seo'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'

/** Plain-text summary for agents. Page list is the public sitemap, nothing else. */
export function buildLlmsTxt(paths: string[]): string {
  const pages = paths.map((path) => `- ${absoluteUrl(path)}`).join('\n')
  return [
    '# BonusBridge',
    '',
    '> BonusBridge (https://bonusbridge.io) is an independent US referral and cashback guide operated by Apis Systems LLC. It explains signup and referral offers for programs whose terms allow a website we own, and it links to each provider\'s terms. BonusBridge is not a bank, broker, insurer, or lender.',
    '',
    FTC_AFFILIATE_DISCLOSURE,
    '',
    '## Public pages',
    '',
    pages,
    ''
  ].join('\n')
}
