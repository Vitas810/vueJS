import {ActionTree, Module, MutationTree} from 'vuex'
import popularTagsApi from '@/api/popularTags'
import {PopularTagsState, RootState} from '@/types/store'
import {getErrorMessage} from '@/helpers/error'

/* =============== Типы popularTags ============= */

export const mutationTypes = {
  getPopularTagsStart: '[popularTags] Get popular tags start',
  getPopularTagsSuccess: '[popularTags] Get popular tags Success',
  getPopularTagsFailure: '[popularTags] Get popular tags Failure',
} as const

export const actionTypes = {
  getPopularTags: '[popularTags] Get popular tags',
} as const

const state: PopularTagsState = {
  data: null,
  isLoading: false,
  error: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<PopularTagsState> = {
  [mutationTypes.getPopularTagsStart](currentState) {
    currentState.isLoading = true
    currentState.data = null
    currentState.error = null
  },
  [mutationTypes.getPopularTagsSuccess](currentState, payload: string[]) {
    currentState.isLoading = false
    currentState.data = payload
    currentState.error = null
  },
  [mutationTypes.getPopularTagsFailure](currentState, payload: string) {
    currentState.isLoading = false
    currentState.error = payload
  },
}

/* =============== Actions ============= */

const actions: ActionTree<PopularTagsState, RootState> = {
  async [actionTypes.getPopularTags]({commit}): Promise<string[]> {
    commit(mutationTypes.getPopularTagsStart)

    try {
      const tags = await popularTagsApi.getPopularTags()

      commit(mutationTypes.getPopularTagsSuccess, tags)
      return tags
    } catch (error) {
      commit(
        mutationTypes.getPopularTagsFailure,
        getErrorMessage(error, 'Failed to load tags')
      )
      throw error
    }
  },
}

const popularTagsModule: Module<PopularTagsState, RootState> = {
  state,
  actions,
  mutations,
}

export default popularTagsModule
