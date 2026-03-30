'use client'

import { useState } from 'react'
import type { Category } from '@bonusbridge/shared'

type UpdateAction = (formData: FormData) => Promise<void>

export function EditableCategoryRow({
  category,
  updateAction
}: {
  category: Category
  updateAction: UpdateAction
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)

  const handleCancel = () => {
    setName(category.name)
    setSlug(category.slug)
    setIsEditing(false)
  }

  const handleSubmit = async (formData: FormData) => {
    await updateAction(formData)
    setIsEditing(false)
  }

  const formId = `edit-form-${category.id}`

  if (isEditing) {
    return (
      <tr>
        <td>
          <input
            form={formId}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            aria-label="Category name"
            required
            autoFocus
          />
        </td>
        <td>
          <input
            form={formId}
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="category-slug"
            aria-label="Category slug"
          />
        </td>
        <td>
          <form id={formId} action={handleSubmit} className="actions">
            <input type="hidden" name="id" value={category.id} />
            <button className="btn primary" type="submit">
              Save
            </button>
            <button className="btn" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit category ${category.name}`}
        >
          {category.name}
        </button>
      </td>
      <td>
        <button
          type="button"
          className="cell-edit-trigger"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit slug ${category.slug}`}
        >
          {category.slug}
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
