import {parseUrl, stringify} from 'query-string'

/* =============== Построение URL ленты для API ============= */

// Собирает полный query для запроса ленты
export function buildFeedApiUrl(
  apiUrl: string,
  currentPage: number,
  currentLimit: number
): string {
  const pageNumber = Number(currentPage || 1)
  const offset = pageNumber * currentLimit - currentLimit
  const parsedUrl = parseUrl(apiUrl)
  const stringifiedParams = stringify({
    ...parsedUrl.query,
    limit: currentLimit,
    offset,
  })

  return `${parsedUrl.url}?${stringifiedParams}`
}
