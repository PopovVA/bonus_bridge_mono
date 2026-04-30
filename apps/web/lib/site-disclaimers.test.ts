import { describe, expect, it } from 'vitest'
import { CHIME_TRADEMARK_NOTICE, REFERRAL_GUIDE_DISCLOSURE, SITE_FOOTER_DISCLAIMER } from './site-disclaimers'

describe('site-disclaimers', () => {
  it('exports stable disclosure copy for footer, guides, and trademarks', () => {
    expect(SITE_FOOTER_DISCLAIMER).toContain('independent informational website')
    expect(SITE_FOOTER_DISCLAIMER).toContain('We do not provide financial services')
    expect(REFERRAL_GUIDE_DISCLOSURE).toContain('referral offers can work')
    expect(CHIME_TRADEMARK_NOTICE).toContain('trademark')
  })
})
