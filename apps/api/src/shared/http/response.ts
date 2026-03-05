export type ApiOk<T> = {
  ok: true
  data: T
}

export function apiOk<T>(data: T): ApiOk<T> {
  return { ok: true, data }
}
