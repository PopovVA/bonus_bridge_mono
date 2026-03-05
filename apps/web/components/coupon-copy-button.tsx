'use client'

import { useState } from 'react'

export function CouponCopyButton({ value, label }: { value: string, label?: string }) {
  const [copied, setCopied] = useState(false)
  const buttonLabel = label ?? 'Copy'

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button
        className="copy-btn"
        type="button"
        onClick={onCopy}
        aria-label={buttonLabel}
      >
        {copied ? 'Copied' : buttonLabel}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${buttonLabel} copied` : ''}
      </span>
    </>
  )
}
