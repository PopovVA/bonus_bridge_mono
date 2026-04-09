'use client'

import { useEffect, useRef } from 'react'
import { trackGtagEvent } from '@/lib/gtag-track'

export type ClipOpenStoreDialogProps = {
  isOpen: boolean
  /** Whether clipboard copy succeeded before opening this dialog. */
  copySucceeded: boolean
  onClose: () => void
  /** Opens the partner URL in a new tab, then caller should close the dialog. */
  onConfirmOpen: () => void
}

/** After copying a promo code: confirm opening the partner site (no auto-navigation). */
export function ClipOpenStoreDialog({
  isOpen,
  copySucceeded,
  onClose,
  onConfirmOpen
}: ClipOpenStoreDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isOpen) {
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={ref}
      className="clip-open-store-dialog"
      aria-labelledby="clip-open-store-dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="clip-open-store-dialog__panel" onClick={(e) => e.stopPropagation()}>
        <h2 id="clip-open-store-dialog-title" className="clip-open-store-dialog__title">
          Open partner site?
        </h2>
        <p className="clip-open-store-dialog__body">
          {copySucceeded ? (
            <>
              The promo code was copied to your clipboard. Do you want to open the store in a new tab?
            </>
          ) : (
            <>
              We couldn&apos;t copy to your clipboard automatically. You can still open the partner site in a new
              tab.
            </>
          )}
        </p>
        <div className="clip-open-store-dialog__actions">
          <button
            type="button"
            className="clip-open-store-dialog__btn clip-open-store-dialog__btn--ghost"
            onClick={() => {
              trackGtagEvent('clip_dialog_not_now')
              onClose()
            }}
          >
            Not now
          </button>
          <button
            type="button"
            className="clip-open-store-dialog__btn clip-open-store-dialog__btn--primary"
            onClick={() => {
              trackGtagEvent('clip_dialog_open_tab')
              onConfirmOpen()
            }}
          >
            Open in new tab
          </button>
        </div>
      </div>
    </dialog>
  )
}
