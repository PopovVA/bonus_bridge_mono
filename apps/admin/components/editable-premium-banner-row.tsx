'use client'

import { useState } from 'react'
import type { PremiumBanner } from '@bonusbridge/shared'

type UpdateAction = (formData: FormData) => Promise<void>
type DeleteAction = (formData: FormData) => Promise<void>

export function EditablePremiumBannerRow({
  banner,
  updateAction,
  deleteAction
}: {
  banner: PremiumBanner
  updateAction: UpdateAction
  deleteAction: DeleteAction
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(banner.title)
  const [description, setDescription] = useState(banner.description)
  const [priceText, setPriceText] = useState(banner.priceText)
  const [priceNote, setPriceNote] = useState(banner.priceNote ?? '')
  const [ctaText, setCtaText] = useState(banner.ctaText)
  const [ctaHref, setCtaHref] = useState(banner.ctaHref ?? '')

  const handleCancel = () => {
    setTitle(banner.title)
    setDescription(banner.description)
    setPriceText(banner.priceText)
    setPriceNote(banner.priceNote ?? '')
    setCtaText(banner.ctaText)
    setCtaHref(banner.ctaHref ?? '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    const formData = new FormData()
    formData.set('id', banner.id)
    formData.set('title', title)
    formData.set('description', description)
    formData.set('priceText', priceText)
    formData.set('priceNote', priceNote)
    formData.set('ctaText', ctaText)
    formData.set('ctaHref', ctaHref)
    await updateAction(formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <tr>
        <td colSpan={5}>
          <div className="banner-edit-form-wrapper">
            <div className="banner-edit-form">
              <div className="edit-col">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  aria-label="Title"
                  required
                  autoFocus
                />
              </div>
              <div className="edit-col">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  aria-label="Description"
                  rows={2}
                  style={{ minWidth: 0, width: '100%' }}
                />
              </div>
              <div className="edit-col">
                <input
                  value={priceText}
                  onChange={(e) => setPriceText(e.target.value)}
                  placeholder="Price"
                  aria-label="Price"
                  required
                />
                <input
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  placeholder="Note (optional)"
                  aria-label="Price note"
                />
              </div>
              <div className="edit-col">
                <input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="CTA text"
                  aria-label="CTA text"
                  required
                />
                <input
                  value={ctaHref}
                  onChange={(e) => setCtaHref(e.target.value)}
                  placeholder="CTA link (optional)"
                  aria-label="CTA link"
                />
              </div>
              <div className="edit-actions">
                <button
                  className="btn primary"
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim() || !description.trim() || !priceText.trim() || !ctaText.trim()}
                >
                  Save
                </button>
                <button className="btn" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
            <form action={deleteAction} className="edit-actions edit-actions-delete" style={{ display: 'inline-flex' }}>
              <input type="hidden" name="id" value={banner.id} />
              <button className="btn" type="submit">
                Delete
              </button>
            </form>
          </div>
        </td>
      </tr>
    )
  }

  const priceDisplay = `${banner.priceText}${banner.priceNote ? ` (${banner.priceNote})` : ''}`
  const ctaDisplay = `${banner.ctaText}${banner.ctaHref ? ` → ${banner.ctaHref}` : ''}`

  return (
    <tr>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit title ${banner.title}`}
        >
          {banner.title}
        </button>
      </td>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit description`}
          style={{ maxWidth: 200, fontSize: 13, whiteSpace: 'pre-wrap', textAlign: 'left' }}
        >
          {banner.description}
        </button>
      </td>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit price ${priceDisplay}`}
        >
          {priceDisplay}
        </button>
      </td>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit CTA ${ctaDisplay}`}
        >
          {ctaDisplay}
        </button>
      </td>
      <td>
        <button className="btn" type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </td>
    </tr>
  )
}
