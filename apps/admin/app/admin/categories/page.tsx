import { ResourceTable } from '@/components/resource-table'
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
    <ResourceTable
      title="Categories"
      subtitle="Group stores by a stable taxonomy used in web filters."
      columns={['Name', 'Slug', 'Actions']}
      rows={categories.map((category) => [
        category.name,
        category.slug,
        <form action={updateCategoryAction} key={category.id} className="actions">
          <input type="hidden" name="id" value={category.id} />
          <input name="name" defaultValue={category.name} placeholder="Category name" aria-label="Category name" required />
          <input name="slug" defaultValue={category.slug} placeholder="category-slug" aria-label="Category slug" required />
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      ])}
      actions={
        <>
          {loadError ? <span className="subtle">{loadError}</span> : null}
          <form action={createCategoryAction} className="actions">
            <input name="name" placeholder="Category name" aria-label="Category name" required />
            <input name="slug" placeholder="category-slug (optional, auto from name)" aria-label="Category slug" />
            <button className="btn primary" type="submit">
              Add category
            </button>
          </form>
        </>
      }
    />
  )
}
