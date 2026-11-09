export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'bb-theme'

export function parseStoredTheme(value: string | null | undefined): Theme | null {
  return value === 'light' || value === 'dark' ? value : null
}

/** Stored choice wins; otherwise follow the OS setting. */
export function resolveTheme(stored: string | null | undefined, prefersDark: boolean): Theme {
  return parseStoredTheme(stored) ?? (prefersDark ? 'dark' : 'light')
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark'
}

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * Kept as a plain string: it must not depend on the React bundle.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var t=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.dataset.theme=t}catch(e){d.dataset.theme='light'}})()`
