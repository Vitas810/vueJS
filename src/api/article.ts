import axios from '@/api/axios'
import {Article, ArticleFormValues} from '@/types/domain'

/* =============== API статьи ============= */

interface ArticleResponse {
  article: Article
}

// Получение статьи
function getArticle(slug: string): Promise<Article> {
  return axios
    .get<ArticleResponse>(`/articles/${slug}`)
    .then((response) => response.data.article)
}

// Удаление статьи
function deleteArticle(slug: string) {
  return axios.delete(`/articles/${slug}`)
}

// Создание статьи
function createArticle(articleInput: ArticleFormValues): Promise<Article> {
  return axios
    .post<ArticleResponse>('/articles', {article: articleInput})
    .then((response) => response.data.article)
}

// Обновление статьи
function updateArticle(
  slug: string,
  articleInput: ArticleFormValues
): Promise<Article> {
  return axios
    .put<ArticleResponse>(`/articles/${slug}`, {article: articleInput})
    .then((response) => response.data.article)
}

export default {
  getArticle,
  deleteArticle,
  createArticle,
  updateArticle,
}
