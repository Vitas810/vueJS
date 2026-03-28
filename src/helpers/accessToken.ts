import {getItem} from '@/helpers/persistanceStorage'

/* =============== Работа с access token ============= */

// Текущее значение access token
export function getAccessToken(): string | null {
  return getItem<string>('accessToken')
}

// Флаг авторизованного пользователя
export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}
