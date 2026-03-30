import type { Category, Offer, Service } from '@/lib/schemas'

export type ServiceWithCategory = Service & {
  category?: { id: string; name: string; slug: string; createdAt: string; updatedAt: string }
}

export function serviceWithCategory(s: Service, allCategories: Category[]): ServiceWithCategory {
  const cat = allCategories.find((c) => c.id === s.categoryId)
  return {
    ...s,
    category: cat
      ? { id: cat.id, name: cat.name, slug: cat.slug, createdAt: cat.createdAt, updatedAt: cat.updatedAt }
      : undefined
  }
}

export function offerWithService(
  o: Offer,
  allServices: Service[],
  allCategories: Category[]
): Offer & { service?: ServiceWithCategory } {
  const svc = allServices.find((s) => s.id === o.serviceId)
  return {
    ...o,
    service: svc ? serviceWithCategory(svc, allCategories) : undefined
  }
}
