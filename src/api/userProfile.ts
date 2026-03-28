import axios from '@/api/axios'
import {Profile} from '@/types/domain'

/* =============== API профиля ============= */

interface UserProfileResponse {
  profile: Profile
}

// Получение профиля пользователя
function getUserProfile(slug: string): Promise<Profile> {
  return axios
    .get<UserProfileResponse>(`/profiles/${slug}`)
    .then((response) => response.data.profile)
}

export default {
  getUserProfile,
}
