'use client'

import { useCallback, useId, useState } from 'react'
import { tryWriteClipboard } from '@/lib/clip-partner-flow'
import { trackGtagEvent, trackReferralClick } from '@/lib/gtag-track'

export type ClipPartnerPending = {
  url: string
  copySucceeded: boolean
  partnerSlug: string | null
}

const CLIP_TOAST_DURATION_MS = 15_000

export function useClipPartnerOfferFlow() {
  const [toast, setToast] = useState<string | null>(null)
  const [pending, setPending] = useState<ClipPartnerPending | null>(null)
  const toastId = useId()

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), CLIP_TOAST_DURATION_MS)
  }, [])

  /** Copy value, toast, then show dialog — does not open a tab. */
  const runClipFlow = useCallback(
    async (copyValue: string, openUrl: string, partnerSlug?: string | null) => {
      const copySucceeded = await tryWriteClipboard(copyValue)
      if (copySucceeded) {
        showToast('Copied to clipboard.')
      } else {
        showToast('Could not copy. Select the code manually.')
      }
      setPending({ url: openUrl, copySucceeded, partnerSlug: partnerSlug ?? null })
    },
    [showToast]
  )

  const closeDialog = useCallback(() => setPending(null), [])

  const confirmOpenInNewTab = useCallback(() => {
    if (pending) {
      if (pending.partnerSlug) {
        trackReferralClick(pending.partnerSlug, 'clip_dialog_open_tab')
      } else {
        trackGtagEvent('clip_dialog_open_tab')
      }
      window.open(pending.url, '_blank', 'noopener,noreferrer')
    }
    setPending(null)
  }, [pending])

  return {
    toast,
    toastId,
    pending,
    runClipFlow,
    closeDialog,
    confirmOpenInNewTab
  }
}
