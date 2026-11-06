import { describe, expect, it } from 'vitest'
import { COMPLIANCE_PAGES_UPDATED, LEGAL_CONTACT_EMAIL, LEGAL_DOCUMENT_LAST_UPDATED } from './legal-site-meta'

describe('legal-site-meta', () => {
  it('exports a valid contact email and ISO date', () => {
    expect(LEGAL_CONTACT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(LEGAL_DOCUMENT_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(COMPLIANCE_PAGES_UPDATED).toBe('2026-11-05')
  })
})
