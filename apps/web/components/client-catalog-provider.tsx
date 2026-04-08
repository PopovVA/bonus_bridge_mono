'use client'

import { createContext, type ReactNode, useContext } from 'react'
import type { ClientCatalogPayload } from '@/lib/site-data'

const ClientCatalogContext = createContext<ClientCatalogPayload | null>(null)

export function ClientCatalogProvider({
  value,
  children
}: {
  value: ClientCatalogPayload
  children: ReactNode
}) {
  return <ClientCatalogContext.Provider value={value}>{children}</ClientCatalogContext.Provider>
}

export function useClientCatalog(): ClientCatalogPayload | null {
  return useContext(ClientCatalogContext)
}
