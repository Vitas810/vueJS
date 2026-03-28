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

export const authModuleName = 'auth'

const state: AuthState = {
  isLoading: false,
  isSubmiting: false,
  currentUser: null,
  validationErrors: null,
  isLoggedIn: null,
}

export const mutationTypes = {
  registerStart: 'registerStart',
  registerSuccess: 'registerSuccess',
  registerFailure: 'registerFailure',

  loginStart: 'loginStart',
  loginSuccess: 'loginSuccess',
  loginFailure: 'loginFailure',

  getCurrentUserStart: 'getCurrentUserStart',
  getCurrentUserSuccess: 'getCurrentUserSuccess',
  getCurrentUserFailure: 'getCurrentUserFailure',

  updateCurrentUserSuccess: 'updateCurrentUserSuccess',
  logout: 'logout',
} as const

export const actionTypes = {
  register: 'register',
  login: 'login',
  getCurrentUser: 'getCurrentUser',
  updateCurrentUser: 'updateCurrentUser',
  logout: 'logout',
} as const

export const getterTypes = {
  currentUser: 'currentUser',
  isLoggedIn: 'isLoggedIn',
  isAnonymous: 'isAnonymous',
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
  [mutationTypes.registerStart](currentState) {
    currentState.isSubmiting = true
    currentState.validationErrors = null
  },
  [mutationTypes.registerSuccess](currentState, payload: CurrentUser) {
    currentState.isSubmiting = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationTypes.registerFailure](
    currentState,
    payload: ValidationErrors | null
  ) {
    currentState.isSubmiting = false
    currentState.validationErrors = payload
  },
  [mutationTypes.loginStart](currentState) {
    currentState.isSubmiting = true
    currentState.validationErrors = null
  },
  [mutationTypes.loginSuccess](currentState, payload: CurrentUser) {
    currentState.isSubmiting = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationTypes.loginFailure](currentState, payload: ValidationErrors | null) {
    currentState.isSubmiting = false
    currentState.validationErrors = payload
  },
  [mutationTypes.getCurrentUserStart](currentState) {
    currentState.isLoading = true
  },
  [mutationTypes.getCurrentUserSuccess](currentState, payload: CurrentUser) {
    currentState.isLoading = false
    currentState.currentUser = payload
    currentState.isLoggedIn = true
  },
  [mutationTypes.getCurrentUserFailure](currentState) {
    currentState.isLoading = false
    currentState.isLoggedIn = false
    currentState.currentUser = null
  },
  [mutationTypes.updateCurrentUserSuccess](currentState, payload: CurrentUser) {
    currentState.currentUser = payload
  },
  [mutationTypes.logout](currentState) {
    currentState.currentUser = null
    currentState.isLoggedIn = false
  },
}

/* =============== Actions ============= */

interface UpdateCurrentUserPayload {
  currentUserInput: CurrentUserInput
}

const actions: ActionTree<AuthState, RootState> = {
  async [actionTypes.register](
    {commit},
    credentials: RegisterCredentials
  ): Promise<CurrentUser> {
    commit(mutationTypes.registerStart)

    try {
      const response = await authApi.register(credentials)
      const user = response.data.user

      commit(mutationTypes.registerSuccess, user)
      setItem('accessToken', user.token)

      return user
    } catch (error) {
      commit(mutationTypes.registerFailure, getValidationErrors(error))
      throw error
    }
  },
  async [actionTypes.login](
    {commit},
    credentials: LoginCredentials
  ): Promise<CurrentUser> {
    commit(mutationTypes.loginStart)

    try {
      const response = await authApi.login(credentials)
      const user = response.data.user

      commit(mutationTypes.loginSuccess, user)
      setItem('accessToken', user.token)

      return user
    } catch (error) {
      commit(mutationTypes.loginFailure, getValidationErrors(error))
      throw error
    }
  },
  async [actionTypes.getCurrentUser]({commit}): Promise<CurrentUser> {
    commit(mutationTypes.getCurrentUserStart)

    try {
      const response = await authApi.getCurrentUser()
      const user = response.data.user

      commit(mutationTypes.getCurrentUserSuccess, user)
      return user
    } catch (error) {
      commit(mutationTypes.getCurrentUserFailure)
      throw error
    }
  },
  async [actionTypes.updateCurrentUser](
    {commit},
    {currentUserInput}: UpdateCurrentUserPayload
  ): Promise<CurrentUser> {
    const user = await authApi.updateCurrentUser(currentUserInput)

    commit(mutationTypes.updateCurrentUserSuccess, user)
    setItem('accessToken', user.token)

    return user
  },
  async [actionTypes.logout]({commit}): Promise<void> {
    removeItem('accessToken')
    commit(mutationTypes.logout)
  },
}

const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default authModule
