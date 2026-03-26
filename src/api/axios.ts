import axios, { AxiosRequestConfig } from 'axios'
import { getItem } from '@/helpers/persistanceStorage'

/* =============== Клиент API ============= */

axios.defaults.baseURL = 'https://api.realworld.io/api'

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getItem<string>('accessToken')
  const authorizationToken = token ? `Token ${token}` : ''

  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      Authorization: authorizationToken,
    },
  }
})

export default axios
