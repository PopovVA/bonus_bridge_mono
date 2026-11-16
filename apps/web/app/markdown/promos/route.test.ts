import { describe, expect, it } from 'vitest'
import { GET, revalidate } from './route'

describe('promos markdown route', () => {
  it('serves the empty promo list as markdown', async () => {
    expect(revalidate).toBe(3600)
    const response = await GET()
    const body = await response.text()
    expect(response.headers.get('Content-Type')).toContain('text/markdown')
    expect(body).toContain('# Promo codes and limited-time offers')
    expect(body).toContain('https://bonusbridge.io/promos')
    expect(body).toContain('No promo codes are listed right now.')
    expect(body).not.toContain('\u2014')
  })
})