import { describe, expect, it } from 'vitest'
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY, nextTheme, parseStoredTheme, resolveTheme } from '@/lib/theme'

describe('theme', () => {
  it('accepts only known stored values', () => {
    expect(parseStoredTheme('dark')).toBe('dark')
    expect(parseStoredTheme('light')).toBe('light')
    expect(parseStoredTheme('sepia')).toBeNull()
    expect(parseStoredTheme(null)).toBeNull()
  })

  it('prefers the stored choice, then the OS', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(undefined, false)).toBe('light')
  })

  it('toggles', () => {
    expect(nextTheme('dark')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
  })

  it('init script reads the same storage key and sets data-theme', () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    new Function(THEME_INIT_SCRIPT)()
    expect(document.documentElement.dataset.theme).toBe('dark')
    localStorage.removeItem(THEME_STORAGE_KEY)
  })
})
