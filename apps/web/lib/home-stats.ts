export type HomeStats = {
  guides: number
  stores: number
  categories: number
}

/** Counts only pages the site actually publishes (the public sitemap), so the hero never shows an invented number. */
export function homeStatsFromPaths(paths: string[]): HomeStats {
  const count = (re: RegExp) => paths.filter((p) => re.test(p)).length
  return {
    guides: count(/^\/(articles|guides)\/[^/]+$/),
    stores: count(/^\/stores\/[^/]+$/),
    categories: count(/^\/categories\/[^/]+$/)
  }
}
