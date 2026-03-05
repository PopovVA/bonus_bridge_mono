export type WithDates = {
  createdAt: Date
  updatedAt: Date
}

export function toIsoDate(value: Date): string {
  return value.toISOString()
}

export function serializeEntityDates<T extends WithDates>(row: T): Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
} {
  return {
    ...row,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt)
  }
}
