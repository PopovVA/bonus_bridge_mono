import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.join(process.cwd(), 'app/home.css'), 'utf8')

describe('hero carousel alignment', () => {
  it('keeps slides flush and centers the nav buttons beside the copy', () => {
    expect(css).toContain('--hero-slide-gap: 0px')
    expect(css).toContain('padding-left: 0;')
    expect(css).not.toContain('margin-left: calc(-1 * var(--hero-slide-gap))')
    expect(css).not.toMatch(/\.hero-floating-arrow\s*\{[^}]*top:\s*10px/)
    expect(css).not.toMatch(/\.hero-floating-arrow\s*\{[^}]*transform:\s*none/)
    expect(css).toMatch(/\.hero-floating-arrow\s*\{[^}]*top:\s*50%/)
    expect(css).toMatch(/\.hero-floating-arrow\s*\{[^}]*transform:\s*translateY\(-50%\)/)
    expect(css).toMatch(/\.hero-floating-arrow:hover\s*\{[^}]*transform:\s*translateY\(-50%\)/)
    expect(css).toContain(
      '--hero-content-inline: calc(var(--hero-arrow-inset) + var(--hero-arrow-size) + 12px)'
    )
    expect(css).toContain('padding-left: var(--hero-content-inline)')
    expect(css).toContain('padding-right: var(--hero-content-inline)')
    expect(css).toContain('--hero-arrow-size: 44px')
    expect(css).toContain('left: var(--hero-arrow-inset)')
    expect(css).toContain('right: var(--hero-arrow-inset)')
  })
})

describe('stores menu scroll lock', () => {
  it('does not hide overflow on <html> while Lenis is stopped (breaks the sticky header)', () => {
    const globals = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8')
    expect(globals).not.toMatch(/\.lenis\.lenis-stopped\s*\{[^}]*overflow:\s*hidden/)
  })
})
