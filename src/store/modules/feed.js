import feedApi from '@/api/feed'

const state = {
  data: null,
  isLoading: false,
  error: null,
}

export const mutationTypes = {
  getFeedStart: '[feed] Get feed start',
  getFeedSuccess: '[feed] Get feed Success',
  getFeedFailure: '[feed] Get feed Failure',
}

export const actionTypes = {
  getFeed: '[feed] Get feed',
}

const mutations = {
  [mutationTypes.getFeedStart](state) {
    state.isLoading = true
    state.data = null
    state.error = null
  },
  [mutationTypes.getFeedSuccess](state, payload) {
    state.isLoading = false
    state.data = payload
    state.error = null
  },
  [mutationTypes.getFeedFailure](state, payload) {
    state.isLoading = false
    state.error = payload
  },
}

const actions = {
  [actionTypes.getFeed](context, {apiUrl}) {
    return new Promise((resolve, reject) => {
      context.commit(mutationTypes.getFeedStart)
      feedApi
        .getFeed(apiUrl)
        .then((response) => {
          context.commit(mutationTypes.getFeedSuccess, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          const message =
            error && error.message ? error.message : 'Failed to load feed'
          context.commit(mutationTypes.getFeedFailure, message)
          reject(error)
        })
    })
  },
}

export default {
  state,
  actions,
  mutations,
}
