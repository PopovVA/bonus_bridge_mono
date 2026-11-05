import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ClipOpenStoreDialog } from './clip-open-store-dialog'

describe('ClipOpenStoreDialog', () => {
  it('stays out of the document until it is opened', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ClipOpenStoreDialog isOpen={false} copySucceeded onClose={() => undefined} onConfirmOpen={() => undefined} />
    )
    expect(html).toBe('')
  })

  it('uses a paragraph title and both actions when open', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const html = renderToStaticMarkup(
      <ClipOpenStoreDialog
        isOpen
        copySucceeded={false}
        onClose={() => undefined}
        onConfirmOpen={() => undefined}
      />
    )
    expect(html).toContain('<p')
    expect(html).toContain('Open partner site?')
    expect(html).not.toContain('<h2')
    expect(html).toContain('couldn&#x27;t copy')
    expect(html).toContain('Not now')
    expect(html).toContain('Open in new tab')
    expect(html).toContain('aria-labelledby')
  })

  it('mentions a successful copy when the clipboard write worked', () => {
    ;(globalThis as { React?: typeof React }).React = React
    const onClose = vi.fn()
    const onConfirmOpen = vi.fn()
    const html = renderToStaticMarkup(
      <ClipOpenStoreDialog isOpen copySucceeded onClose={onClose} onConfirmOpen={onConfirmOpen} />
    )
    expect(html).toContain('copied to your clipboard')
    expect(onClose).not.toHaveBeenCalled()
    expect(onConfirmOpen).not.toHaveBeenCalled()
  })
})
