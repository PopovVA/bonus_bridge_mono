import { EditableCategoryRow } from '@/components/editable-category-row'
import { createAdminApiClient } from '@/lib/api/admin-client'
import { getAccessToken, getAccessTokenForMutation } from '@/lib/auth'
import { CategoryCreateSchema, CategoryUpdateSchema, toSlug, type Category } from '@bonusbridge/shared'
import { revalidatePath } from 'next/cache'

async function createCategoryAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const api = createAdminApiClient(accessToken)
  const name = String(formData.get('name') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const payload = CategoryCreateSchema.parse({
    name,
    slug: slugRaw || toSlug(name)
  })

  await api.createCategory(payload)
  revalidatePath('/admin/categories')
}

async function updateCategoryAction(formData: FormData) {
  'use server'
  const accessToken = await getAccessTokenForMutation()
  if (!accessToken) {
    return
  }

  const id = String(formData.get('id') ?? '')
  const api = createAdminApiClient(accessToken)
  const name = String(formData.get('name') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const payload = CategoryUpdateSchema.parse({
    ...(name ? { name } : {}),
    ...(slugRaw ? { slug: slugRaw } : {})
  })

  if (Object.keys(payload).length === 0) return

  await api.updateCategory(id, payload)
  revalidatePath('/admin/categories')
}

export default async function CategoriesAdminPage() {
  const accessToken = await getAccessToken()
  const api = createAdminApiClient(accessToken)
  let categories: Category[] = []
  let loadError: string | null = null
  try {
    categories = await api.listCategories()
  } catch {
    loadError = 'Categories API is unavailable.'
  }

  return (
    <section className="panel grid">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h2 className="heading" style={{ marginBottom: 6 }}>
            Categories
          </h2>
          <p className="subtle">Group stores by a stable taxonomy used in web filters.</p>
        </div>
        <div className="actions">
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createCategoryAction} className="actions">
            <input name="name" placeholder="Category name" aria-label="Category name" required />
            <input name="slug" placeholder="category-slug (optional, auto from name)" aria-label="Category slug" />
            <button className="btn primary" type="submit">
              Add category
            </button>
          </form>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="subtle">
                No records. Check API or create new entities.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <EditableCategoryRow key={category.id} category={category} updateAction={updateCategoryAction} />
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
