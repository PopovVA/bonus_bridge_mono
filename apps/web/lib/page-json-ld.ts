import { absoluteUrl } from '@/app/seo'

export type Crumb = {
  name: string
  path: string
}

export function breadcrumbList(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  }
}

export function indexPageJsonLd(input: {
  path: string
  name: string
  description: string
  dateModified?: string
  type?: 'WebPage' | 'CollectionPage'
  items?: Crumb[]
}) {
  const page: Record<string, unknown> = {
    '@type': input.type ?? 'WebPage',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path)
  }
  if (input.dateModified) page.dateModified = input.dateModified
  if (input.items && input.items.length > 0) {
    page.mainEntity = {
      '@type': 'ItemList',
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path)
      }))
    }
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbList([{ name: 'Home', path: '/' }, { name: input.name, path: input.path }]), page]
  }
}
