import {
  Article,
  CurrentUser,
  FeedResponse,
  Profile,
  ValidationErrors,
} from '@/types/domain'

/* =============== Типы состояния store ============= */

// Состояние auth
export interface AuthState {
  isLoading: boolean
  isSubmiting: boolean
  currentUser: CurrentUser | null
  validationErrors: ValidationErrors | null
  isLoggedIn: boolean | null
}

// Состояние feed
export interface FeedState {
  data: FeedResponse | null
  isLoading: boolean
  error: string | null
}

// Состояние популярных тегов
export interface PopularTagsState {
  data: string[] | null
  isLoading: boolean
  error: string | null
}

// Состояние статьи
export interface ArticleState {
  data: Article | null
  isLoading: boolean
  error: string | null
}

// Состояние создания статьи
export interface CreateArticleState {
  isSubmitting: boolean
  validationErrors: ValidationErrors | null
}

// Состояние редактирования статьи
export interface EditArticleState {
  isSubmitting: boolean
  validationErrors: ValidationErrors | null
  isLoading: boolean
  article: Article | null
}

// Состояние настроек
export interface SettingsState {
  isSubmitting: boolean
  validationErrors: ValidationErrors | null
}

// Состояние избранного
export interface AddToFavoritesState {
  isSubmitting: boolean
}

// Состояние профиля пользователя
export interface UserProfileState {
  data: Profile | null
  isLoading: boolean
  error: string | null
}

// Корневое состояние приложения
export interface RootState {
  auth: AuthState
  feed: FeedState
  popularTags: PopularTagsState
  article: ArticleState
  createArticle: CreateArticleState
  editArticle: EditArticleState
  settings: SettingsState
  addToFavorites: AddToFavoritesState
  userProfile: UserProfileState
}
