import {ActionTree, Module, MutationTree} from 'vuex'
import feedApi from '@/api/feed'
import {FeedResponse} from '@/types/domain'
import {RootState, FeedState} from '@/types/store'
import {getErrorMessage} from '@/helpers/error'

/* =============== Типы feed ============= */

export const feedModuleName = 'feed'

export const mutationTypes = {
  getFeedStart: 'getFeedStart',
  getFeedSuccess: 'getFeedSuccess',
  getFeedFailure: 'getFeedFailure',
} as const

export const actionTypes = {
  getFeed: 'getFeed',
} as const

const state: FeedState = {
  data: null,
  isLoading: false,
  error: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<FeedState> = {
  [mutationTypes.getFeedStart](currentState) {
    currentState.isLoading = true
    currentState.data = null
    currentState.error = null
  },
  [mutationTypes.getFeedSuccess](currentState, payload: FeedResponse) {
    currentState.isLoading = false
    currentState.data = payload
    currentState.error = null
  },
  [mutationTypes.getFeedFailure](currentState, payload: string) {
    currentState.isLoading = false
    currentState.error = payload
  },
}

/* =============== Actions ============= */

interface GetFeedPayload {
  apiUrl: string
}

const actions: ActionTree<FeedState, RootState> = {
  async [actionTypes.getFeed]({commit}, {apiUrl}: GetFeedPayload) {
    commit(mutationTypes.getFeedStart)

    try {
      const response = await feedApi.getFeed(apiUrl)

      commit(mutationTypes.getFeedSuccess, response.data)
      return response.data
    } catch (error) {
      commit(
        mutationTypes.getFeedFailure,
        getErrorMessage(error, 'Failed to load feed')
      )
      throw error
    }
  },
}

const feedModule: Module<FeedState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default feedModule
