'use client'

import { useCallback, useId, useState } from 'react'
import { tryWriteClipboard } from '@/lib/clip-partner-flow'

export type ClipPartnerPending = {
  url: string
  copySucceeded: boolean
}

const CLIP_TOAST_DURATION_MS = 30_000

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
    async (copyValue: string, openUrl: string) => {
      const copySucceeded = await tryWriteClipboard(copyValue)
      if (copySucceeded) {
        showToast('Copied to clipboard.')
      } else {
        showToast('Could not copy — select the code manually.')
      }
      setPending({ url: openUrl, copySucceeded })
    },
    [showToast]
  )

  const closeDialog = useCallback(() => setPending(null), [])

  const confirmOpenInNewTab = useCallback(() => {
    if (pending) {
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
