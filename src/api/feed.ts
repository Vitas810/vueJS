import {AxiosResponse} from 'axios'
import axios from '@/api/axios'
import {FeedResponse} from '@/types/domain'

/* =============== API ленты ============= */

// Получение ленты
function getFeed(apiUrl: string): Promise<AxiosResponse<FeedResponse>> {
  return axios.get(apiUrl)
}

export default {
  getFeed,
}
