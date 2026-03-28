import {ActionTree, Module, MutationTree} from 'vuex'
import addToFavoritesApi from '@/api/addToFavorites'
import {Article} from '@/types/domain'
import {AddToFavoritesState, RootState} from '@/types/store'

/* =============== Типы addToFavorites ============= */

export const addToFavoritesModuleName = 'addToFavorites'

export const mutationTypes = {
  addToFavoritesStart: 'addToFavoritesStart',
  addToFavoritesSuccess: 'addToFavoritesSuccess',
  addToFavoritesFailure: 'addToFavoritesFailure',
} as const

export const actionTypes = {
  addToFavorites: 'addToFavorites',
} as const

const state: AddToFavoritesState = {
  isSubmitting: false,
}

/* =============== Мутации ============= */

const mutations: MutationTree<AddToFavoritesState> = {
  [mutationTypes.addToFavoritesStart](currentState) {
    currentState.isSubmitting = true
  },
  [mutationTypes.addToFavoritesSuccess](currentState) {
    currentState.isSubmitting = false
  },
  [mutationTypes.addToFavoritesFailure](currentState) {
    currentState.isSubmitting = false
  },
}

/* =============== Actions ============= */

interface AddToFavoritesPayload {
  slug: string
  isFavorited: boolean
}

const actions: ActionTree<AddToFavoritesState, RootState> = {
  async [actionTypes.addToFavorites](
    {commit},
    {slug, isFavorited}: AddToFavoritesPayload
  ): Promise<Article> {
    commit(mutationTypes.addToFavoritesStart)

    try {
      const article = isFavorited
        ? await addToFavoritesApi.removeFromFavorites(slug)
        : await addToFavoritesApi.addToFavorites(slug)

      commit(mutationTypes.addToFavoritesSuccess)
      return article
    } catch (error) {
      commit(mutationTypes.addToFavoritesFailure)
      throw error
    }
  },
}

const addToFavoritesModule: Module<AddToFavoritesState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default addToFavoritesModule
