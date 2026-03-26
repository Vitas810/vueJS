import { AxiosResponse } from 'axios'
import axios from '@/api/axios'
import {
  CurrentUser,
  CurrentUserInput,
  LoginCredentials,
  RegisterCredentials,
} from '@/types/domain'

/* =============== API авторизации ============= */

interface UserResponse {
  user: CurrentUser
}

// Регистрация пользователя
function register(
  credentials: RegisterCredentials
): Promise<AxiosResponse<UserResponse>> {
  return axios.post('/users', { user: credentials })
}

// Вход пользователя
function login(
  credentials: LoginCredentials
): Promise<AxiosResponse<UserResponse>> {
  return axios.post('/users/login', { user: credentials })
}

// Текущий пользователь
function getCurrentUser(): Promise<AxiosResponse<UserResponse>> {
  return axios.get('/user')
}

// Обновление профиля
function updateCurrentUser(currentUserInput: CurrentUserInput): Promise<CurrentUser> {
  return axios
    .put<UserResponse>('/user', { user: currentUserInput })
    .then((response) => response.data.user)
}

export default {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
}
