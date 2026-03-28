import {ActionTree, GetterTree, Module, MutationTree} from 'vuex'
import authApi from '@/api/auth'
import {removeItem, setItem} from '@/helpers/persistanceStorage'
import {getValidationErrors} from '@/helpers/error'
import {
  CurrentUser,
  CurrentUserInput,
  LoginCredentials,
  RegisterCredentials,
  ValidationErrors,
} from '@/types/domain'
import {AuthState, RootState} from '@/types/store'

/* =============== Типы auth ============= */

const state: AuthState = {
  isLoading: false,
  isSubmiting: false,
  currentUser: null,
  validationErrors: null,
  isLoggedIn: null,
}

export const mutationsTypes = {
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure',

  getCurrentUserStart: '[auth] getCurrentUserStart',
  getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
  getCurrentUserFailure: '[auth] getCurrentUserFailure',

  updateCurrentUserSuccess: '[auth] updateCurrentUserSuccess',
  logout: '[auth] logout',
} as const

export const actionsTypes = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser',
  updateCurrentUser: '[auth] updateCurrentUser',
  logout: '[auth] logout',
} as const

export const getterTypes = {
  currentUser: '[auth] currentUser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymous: '[auth] isAnonymous',
} as const

/* =============== Getters ============= */

const getters: GetterTree<AuthState, RootState> = {
  [getterTypes.currentUser](currentState): CurrentUser | null {
    return currentState.currentUser
  },
  [getterTypes.isLoggedIn](currentState): boolean {
    return Boolean(currentState.isLoggedIn)
  },
  [getterTypes.isAnonymous](currentState): boolean {
    return currentState.isLoggedIn === false
  },
}

/* =============== Мутации ============= */

const mutations: MutationTree<AuthState> = {
  [mutationsTypes.registerStart](currentState) {
    currentState.isSubmiting = true
    currentState.validationErrors = null
  },
  [mutationsTypes.registerSuccess](currentState, payload: CurrentUser) {
    currentState.isSubmiting = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationsTypes.registerFailure](
    currentState,
    payload: ValidationErrors | null
  ) {
    currentState.isSubmiting = false
    currentState.validationErrors = payload
  },
  [mutationsTypes.loginStart](currentState) {
    currentState.isSubmiting = true
    currentState.validationErrors = null
  },
  [mutationsTypes.loginSuccess](currentState, payload: CurrentUser) {
    currentState.isSubmiting = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationsTypes.loginFailure](
    currentState,
    payload: ValidationErrors | null
  ) {
    currentState.isSubmiting = false
    currentState.validationErrors = payload
  },
  [mutationsTypes.getCurrentUserStart](currentState) {
    currentState.isLoading = true
  },
  [mutationsTypes.getCurrentUserSuccess](currentState, payload: CurrentUser) {
    currentState.isLoading = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationsTypes.getCurrentUserFailure](currentState) {
    currentState.isLoading = false
    currentState.isLoggedIn = false
    currentState.currentUser = null
  },
  [mutationsTypes.updateCurrentUserSuccess](
    currentState,
    payload: CurrentUser
  ) {
    currentState.currentUser = payload
  },
  [mutationsTypes.logout](currentState) {
    currentState.currentUser = null
    currentState.isLoggedIn = false
  },
}

/* =============== Actions ============= */

interface UpdateCurrentUserPayload {
  currentUserInput: CurrentUserInput
}

const actions: ActionTree<AuthState, RootState> = {
  async [actionsTypes.register](
    {commit},
    credentials: RegisterCredentials
  ): Promise<CurrentUser> {
    commit(mutationsTypes.registerStart)

    try {
      const response = await authApi.register(credentials)
      const user = response.data.user

      commit(mutationsTypes.registerSuccess, user)
      setItem('accessToken', user.token)

      return user
    } catch (error) {
      commit(mutationsTypes.registerFailure, getValidationErrors(error))
      throw error
    }
  },
  async [actionsTypes.login](
    {commit},
    credentials: LoginCredentials
  ): Promise<CurrentUser> {
    commit(mutationsTypes.loginStart)

    try {
      const response = await authApi.login(credentials)
      const user = response.data.user

      commit(mutationsTypes.loginSuccess, user)
      setItem('accessToken', user.token)

      return user
    } catch (error) {
      commit(mutationsTypes.loginFailure, getValidationErrors(error))
      throw error
    }
  },
  async [actionsTypes.getCurrentUser]({commit}): Promise<CurrentUser> {
    commit(mutationsTypes.getCurrentUserStart)

    try {
      const response = await authApi.getCurrentUser()
      const user = response.data.user

      commit(mutationsTypes.getCurrentUserSuccess, user)
      return user
    } catch (error) {
      commit(mutationsTypes.getCurrentUserFailure)
      throw error
    }
  },
  async [actionsTypes.updateCurrentUser](
    {commit},
    {currentUserInput}: UpdateCurrentUserPayload
  ): Promise<CurrentUser> {
    const user = await authApi.updateCurrentUser(currentUserInput)

    commit(mutationsTypes.updateCurrentUserSuccess, user)
    setItem('accessToken', user.token)

    return user
  },
  async [actionsTypes.logout]({commit}): Promise<void> {
    removeItem('accessToken')
    commit(mutationsTypes.logout)
  },
}

const authModule: Module<AuthState, RootState> = {
  state,
  mutations,
  actions,
  getters,
}

export default authModule
