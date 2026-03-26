import {stringify, parseUrl} from 'query-string'
import {limit} from '@/helpers/vars'

/* =============== Построение URL ленты для API ============= */

// Собирает полный query для запроса ленты (limit, offset, фильтры из apiUrl)
export function buildFeedApiUrl(apiUrl, currentPage) {
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
