import axios from '@/api/axios'
import { Article } from '@/types/domain'

/* =============== API избранного ============= */

interface FavoriteArticleResponse {
  article: Article
}

// URL избранного статьи
function getUrl(slug: string): string {
  return `/articles/${slug}/favorite`
}

// Преобразование ответа избранного
function mapFavoriteResponse(response: FavoriteArticleResponse): Article {
  return response.article
}

// Добавление статьи в избранное
function addToFavorites(slug: string): Promise<Article> {
  const url = getUrl(slug)

  return axios.post<FavoriteArticleResponse>(url).then((response) => {
    return mapFavoriteResponse(response.data)
  })
}

// Удаление статьи из избранного
function removeFromFavorites(slug: string): Promise<Article> {
  const url = getUrl(slug)

  return axios.delete<FavoriteArticleResponse>(url).then((response) => {
    return mapFavoriteResponse(response.data)
  })
}

export default {
  addToFavorites,
  removeFromFavorites,
}
