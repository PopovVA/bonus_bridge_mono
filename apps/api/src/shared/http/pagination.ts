export type Page = {
  limit: number
  offset: number
}

export function parsePagination(input: { limit?: number; offset?: number }, max = 100): Page {
  const safeLimit = Math.min(Math.max(input.limit ?? 20, 1), max)
  const safeOffset = Math.max(input.offset ?? 0, 0)

  return { limit: safeLimit, offset: safeOffset }
}
