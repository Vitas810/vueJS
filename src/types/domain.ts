/* =============== Базовые типы домена ============= */

// Ошибки валидации от API
export type ValidationErrors = Record<string, string[]>

// Профиль автора
export interface Profile {
  username: string
  bio: string | null
  image: string | null
  following: boolean
}

// Статья
export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Profile
}

// Ответ ленты статей
export interface FeedResponse {
  articles: Article[]
  articlesCount: number
}

// Данные формы статьи
export interface ArticleFormValues {
  title: string
  description: string
  body: string
  tagList: string[]
}

// Данные логина
export interface LoginCredentials {
  email: string
  password: string
}

// Данные регистрации
export interface RegisterCredentials extends LoginCredentials {
  username: string
}

// Текущий пользователь
export interface CurrentUser {
  email: string
  token: string
  username: string
  bio: string | null
  image: string | null
}

// Данные формы настроек пользователя
export interface CurrentUserInput {
  email: string
  username: string
  bio: string
  image: string
  password: string
}
