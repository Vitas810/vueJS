import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {getAccessToken} from '@/helpers/accessToken'

/* =============== Клиент API ============= */

const API_BASE_URL = 'https://conduit-realworld-example-app.fly.dev/api'

// Значение заголовка авторизации
export function getAuthorizationHeaderValue(
  accessToken: string | null
): string | undefined {
  if (!accessToken) {
    return undefined
  }

  return `Token ${accessToken}`
}

// Создание клиента API
export function createApiClient(): AxiosInstance {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
  })

  apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
    const accessToken = getAccessToken()
    const authorizationHeaderValue = getAuthorizationHeaderValue(accessToken)
    const requestHeaders = {
      ...(config.headers ?? {}),
    }

    if (!authorizationHeaderValue) {
      return {
        ...config,
        headers: requestHeaders,
      }
    }

    return {
      ...config,
      headers: {
        ...requestHeaders,
        Authorization: authorizationHeaderValue,
      },
    }
  })

  return apiClient
}

const apiClient = createApiClient()

export default apiClient
