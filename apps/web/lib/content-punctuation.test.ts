import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { forbiddenPunctuation, hasLooseDoubleHyphen, sourceWithoutComments } from './content-punctuation'

function walk(dir: string, acc: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'coverage') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, acc)
      continue
    }
    if (/\.test\./.test(entry.name) || entry.name === 'content-punctuation.ts') continue
    if (!/\.(ts|tsx)$/.test(entry.name)) continue
    acc.push(full)
  }
}

describe('content punctuation', () => {
  it('strips comments but keeps URLs and string dashes', () => {
    const source = [
      '/* em — dash */',
      'const url = "https://bonusbridge.io/guides"',
      'const note = "location — always" // en – dash',
      'const klass = "btn btn--accent"'
    ].join('\n')
    const stripped = sourceWithoutComments(source)
    expect(stripped).not.toContain('en dash')
    expect(stripped).toContain('https://bonusbridge.io/guides')
    expect(stripped).toContain('location — always')
    expect(forbiddenPunctuation(source)).toEqual(['em dash'])
  })

  it('flags en dashes, spaced double hyphens, and numeric ranges', () => {
    expect(forbiddenPunctuation('const label = "60–90 days"')).toEqual(['en dash'])
    expect(hasLooseDoubleHyphen('const klass = "btn btn--accent --font-app"')).toBe(false)
    expect(hasLooseDoubleHyphen('const row = `hero-row hero-row--${kind}`')).toBe(false)
    expect(hasLooseDoubleHyphen('const copy = "60--90 days"')).toBe(true)
    expect(hasLooseDoubleHyphen('const copy = "location -- always"')).toBe(true)
    expect(forbiddenPunctuation('const copy = "location -- always"')).toEqual(['double hyphen'])
  })

  it('keeps shipped web source free of em dashes, en dashes, and prose double hyphens', () => {
    const root = path.resolve(import.meta.dirname, '..')
    const files: string[] = []
    walk(root, files)
    const hits: string[] = []
    for (const file of files) {
      const found = forbiddenPunctuation(fs.readFileSync(file, 'utf8'))
      if (found.length > 0) hits.push(`${path.relative(root, file)}: ${found.join(', ')}`)
    }
    expect(hits).toEqual([])
  })
})