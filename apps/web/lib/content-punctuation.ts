const EM_DASH = '\u2014'
const EN_DASH = '\u2013'

/** Drop block and line comments. Keeps `https://` URLs (the slashes follow a colon). */
export function sourceWithoutComments(source: string): string {
  const withoutBlock = source.replace(/\/\*[\s\S]*?\*\//g, '')
  return withoutBlock.replace(/(^|[^:\\])\/\/.*$/gm, '$1')
}

/**
 * True when `--` remains after CSS variables (`--token`) and BEM modifiers (`block--mod`)
 * are removed. Spaced dashes and ranges such as `60--90` still count.
 */
export function hasLooseDoubleHyphen(source: string): boolean {
  const stripped = sourceWithoutComments(source)
    .replace(/(^|[^A-Za-z0-9_-])--[A-Za-z0-9_-]+/g, '$1')
    .replace(/(^|[^A-Za-z0-9_-])[A-Za-z_][A-Za-z0-9_-]*--\$\{/g, '$1')
    .replace(/(^|[^A-Za-z0-9_-])[A-Za-z_][A-Za-z0-9_-]*--[A-Za-z0-9_-]+/g, '$1')
  return stripped.includes('--')
}

export function forbiddenPunctuation(source: string): string[] {
  const text = sourceWithoutComments(source)
  const hits: string[] = []
  if (text.includes(EM_DASH)) hits.push('em dash')
  if (text.includes(EN_DASH)) hits.push('en dash')
  if (hasLooseDoubleHyphen(source)) hits.push('double hyphen')
  return hits
}
