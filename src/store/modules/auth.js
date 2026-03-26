import authApi from '@/api/auth'
import {setItem} from '@/helpers/persistanceStorage'
import {mutationTypes as settingsMutationTypes} from '@/store/modules/settings'

const state = {
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

  updateCurrentUserStart: '[auth] updateCurrentUserStart',
  updateCurrentUserSuccess: '[auth] updateCurrentUserSuccess',
  updateCurrentUserFailure: '[auth] updateCurrentUserFailure',

  logout: '[auth] logout'
}

export const actionsTypes = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser',
  updateCurrentUser: '[auth] updateCurrentUser',
  logout: '[auth] logout'
}

export const getterTypes = {
  currentUser: '[auth] currentUser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymous: '[auth] isAnonymous',
}

const getters = {
  [getterTypes.currentUser]: (state) => {
    return state.currentUser
  },
  [getterTypes.isLoggedIn]: (state) => {
    return Boolean(state.isLoggedIn)
  },
  [getterTypes.isAnonymous]: (state) => {
    return state.isLoggedIn === false
  },
}

const mutations = {
  [mutationsTypes.registerStart](state) {
    state.isSubmiting = true
    state.validationErrors = null
  },
  [mutationsTypes.registerSuccess](state, payload) {
    state.isSubmiting = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationsTypes.registerFailure](state, payload) {
    state.isSubmiting = false
    state.validationErrors = payload
  },

  [mutationsTypes.loginStart](state) {
    state.isSubmiting = true
    state.validationErrors = null
  },
  [mutationsTypes.loginSuccess](state, payload) {
    state.isSubmiting = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationsTypes.loginFailure](state, payload) {
    state.isSubmiting = false
    state.validationErrors = payload
  },
  [mutationsTypes.getCurrentUserStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.getCurrentUserSuccess](state, payload) {
    state.isLoading = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationsTypes.getCurrentUserFailure](state) {
    state.isLoading = false
    state.isLoggedIn = false
    state.currentUser = null
  },
  [mutationsTypes.updateCurrentUserStart]() {},
  [mutationsTypes.updateCurrentUserSuccess](state, payload) {
    state.currentUser = payload
  },
  [mutationsTypes.updateCurrentUserFailure]() {},

  [mutationsTypes.logout](state) {
    state.currentUser = null
    state.isLoggedIn = false
  }
}

const getValidationErrorsFromAuthError = error => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.errors
  ) {
    return error.response.data.errors
  }
  return null
}

const actions = {
  [actionsTypes.register](context, credentials) {
    return new Promise((resolve, reject) => {
      context.commit(mutationsTypes.registerStart)
      authApi
        .register(credentials)
        .then((response) => {
          context.commit(mutationsTypes.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch((error) => {
          context.commit(
            mutationsTypes.registerFailure,
            getValidationErrorsFromAuthError(error)
          )
          reject(error)
        })
    })
  },

  [actionsTypes.login](context, credentials) {
    return new Promise((resolve, reject) => {
      context.commit(mutationsTypes.loginStart)
      authApi
        .login(credentials)
        .then((response) => {
          context.commit(mutationsTypes.loginSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch((error) => {
          context.commit(
            mutationsTypes.loginFailure,
            getValidationErrorsFromAuthError(error)
          )
          reject(error)
        })
    })
  },
  [actionsTypes.getCurrentUser](context) {
    return new Promise((resolve, reject) => {
      context.commit(mutationsTypes.getCurrentUserStart)
      authApi
        .getCurrentUser()
        .then((response) => {
          context.commit(
            mutationsTypes.getCurrentUserSuccess,
            response.data.user
          )
          resolve(response.data.user)
        })
        .catch((error) => {
          context.commit(mutationsTypes.getCurrentUserFailure)
          reject(error)
        })
    })
  },
  [actionsTypes.updateCurrentUser](context, {currentUserInput}) {
    return new Promise((resolve, reject) => {
      context.commit(mutationsTypes.updateCurrentUserStart)
      context.commit(settingsMutationTypes.updateSettingsFormStart)
      authApi
          .updateCurrentUser(currentUserInput)
          .then((user) => {
            context.commit(
                mutationsTypes.updateCurrentUserSuccess,
                user
            )
            context.commit(settingsMutationTypes.updateSettingsFormSuccess)
            resolve(user)
          })
          .catch((error) => {
            const validationErrors = getValidationErrorsFromAuthError(error)
            context.commit(mutationsTypes.updateCurrentUserFailure)
            context.commit(
              settingsMutationTypes.updateSettingsFormFailure,
              validationErrors
            )
            reject(error)
          })
    })
  },
  [actionsTypes.logout](context) {
    return new Promise(resolve => {
      setItem('accessToken', '')
      context.commit(mutationsTypes.logout)
      resolve()
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
}
