import {parseUrl, stringify} from 'query-string'
import {limit} from '@/helpers/vars'

/* =============== Построение URL ленты для API ============= */

// Собирает полный query для запроса ленты
export function buildFeedApiUrl(apiUrl: string, currentPage: number): string {
  const pageNumber = Number(currentPage || 1)
  const offset = pageNumber * limit - limit
  const parsedUrl = parseUrl(apiUrl)
  const stringifiedParams = stringify({
    limit,
    offset,
    ...parsedUrl.query,
  })

  return `${parsedUrl.url}?${stringifiedParams}`
}
