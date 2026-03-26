import axios from '@/api/axios'

/* =============== API популярных тегов ============= */

interface TagsResponse {
  tags: string[]
}

// Получение популярных тегов
function getPopularTags(): Promise<string[]> {
  return axios
    .get<TagsResponse>('/tags')
    .then((response) => response.data.tags)
}

export default {
  getPopularTags,
}
