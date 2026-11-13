import { describe, expect, it } from 'vitest'
import {
  ReferralProgramSchema,
  getReferralProgram,
  isPublicStoreSlug,
  partnerSlugForReferralUrl,
  programClaim,
  publicReferralCode,
  referralPrograms,
  requirePartnerSlugForReferralUrl,
  requirePublicReferralUrl,
  unlistedStoreSlugs
} from './referral-programs'

const valid = {
  slug: 'example-brand',
  name: 'Example',
  bucket: 1 as const,
  publicOk: true,
  referralUrl: 'https://example.com/r/ok',
  termsUrl: 'https://example.com/terms',
  maxClaimText: 'A variable welcome offer.',
  disclosures: ['Owned-site posting is allowed.']
}

describe('referral programs', () => {
  it('keeps personal referral URLs only on bucket 1', () => {
    const listed = referralPrograms.filter((program) => program.publicOk)
    expect(listed.map((program) => program.slug).sort()).toEqual([
      'chime',
      'honey',
      'lyft',
      'rakuten',
      'topcashback'
    ])
    expect(unlistedStoreSlugs()).toContain('lemonade')
    expect(unlistedStoreSlugs()).toContain('visible')
    expect(unlistedStoreSlugs()).toContain('amex-hilton-honors')
    expect(getReferralProgram('visible')?.referralUrl).toBeNull()
    expect(getReferralProgram('amex-hilton-honors')?.referralUrl).toBeNull()
    expect(unlistedStoreSlugs()).toContain('uber')
    expect(unlistedStoreSlugs()).toContain('paypal')
    expect(unlistedStoreSlugs()).not.toContain('rakuten')
    expect(getReferralProgram('lyft')?.referralUrl).toContain('lyft.com')
    expect(getReferralProgram('missing')).toBeUndefined()
  })

  it('resolves public URLs and claims, and rejects unlisted slugs', () => {
    expect(requirePublicReferralUrl('rakuten')).toBe('https://www.rakuten.com/r/MVADIM7')
    expect(() => requirePublicReferralUrl('uber')).toThrow(/No public referral URL/)
    expect(() => requirePublicReferralUrl('lemonade')).toThrow(/No public referral URL/)
    expect(() => requirePublicReferralUrl('visible')).toThrow(/No public referral URL/)
    expect(() => requirePublicReferralUrl('amex-hilton-honors')).toThrow(/No public referral URL/)
    expect(getReferralProgram('lemonade')?.referralUrl).toBeNull()
    expect(partnerSlugForReferralUrl('https://www.rakuten.com/r/MVADIM7')).toBe('rakuten')
    expect(partnerSlugForReferralUrl('https://www.chime.com/r/vadimpopov1')).toBe('chime')
    expect(partnerSlugForReferralUrl('https://example.com/nope')).toBeNull()
    expect(requirePartnerSlugForReferralUrl('https://www.joinhoney.com/ref/nwpz6sw')).toBe('honey')
    expect(() => requirePartnerSlugForReferralUrl('https://example.com/nope')).toThrow(/No partner/)
    expect(() => requirePublicReferralUrl('missing')).toThrow(/No public referral URL/)
    expect(programClaim('honey')).toContain('PayPal Rewards points')
    expect(() => programClaim('missing')).toThrow(/No referral program/)
    expect(isPublicStoreSlug('chime')).toBe(true)
    expect(isPublicStoreSlug('robinhood')).toBe(false)
    expect(isPublicStoreSlug('missing')).toBe(false)
    expect(publicReferralCode('lyft')).toBe('VADIM53422')
    expect(publicReferralCode('rakuten')).toBeNull()
    expect(publicReferralCode('uber')).toBeNull()
  })

  it('rejects programs that disagree with the bucket rules', () => {
    expect(ReferralProgramSchema.safeParse({ ...valid, publicOk: false, referralUrl: null }).success).toBe(false)
    expect(
      ReferralProgramSchema.safeParse({ ...valid, bucket: 2, publicOk: true, referralUrl: 'https://example.com/r/no' })
        .success
    ).toBe(false)
    expect(ReferralProgramSchema.safeParse({ ...valid, referralUrl: null }).success).toBe(false)
    expect(
      ReferralProgramSchema.safeParse({
        ...valid,
        bucket: 2,
        publicOk: false,
        referralUrl: 'https://example.com/r/secret'
      }).success
    ).toBe(false)
    expect(ReferralProgramSchema.safeParse(valid).success).toBe(true)
  })
})
