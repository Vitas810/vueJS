import { ActionTree, Module, MutationTree } from 'vuex'
import addToFavoritesApi from '@/api/addToFavorites'
import { Article } from '@/types/domain'
import { AddToFavoritesState, RootState } from '@/types/store'

/* =============== Типы addToFavorites ============= */

export const mutationsTypes = {
  addToFavoritesStart: '[addToFavorites] Add to favorites start',
  addToFavoritesSuccess: '[addToFavorites] Add to favorites success',
  addToFavoritesFailure: '[addToFavorites] Add to favorites failure',
} as const

export const actionTypes = {
  addToFavorites: '[addToFavorites] add to favorites',
} as const

const state: AddToFavoritesState = {
  isSubmitting: false,
}

/* =============== Мутации ============= */

const mutations: MutationTree<AddToFavoritesState> = {
  [mutationsTypes.addToFavoritesStart](currentState) {
    currentState.isSubmitting = true
  },
  [mutationsTypes.addToFavoritesSuccess](currentState) {
    currentState.isSubmitting = false
  },
  [mutationsTypes.addToFavoritesFailure](currentState) {
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
    { commit },
    { slug, isFavorited }: AddToFavoritesPayload
  ): Promise<Article> {
    commit(mutationsTypes.addToFavoritesStart)

    try {
      const article = isFavorited
        ? await addToFavoritesApi.removeFromFavorites(slug)
        : await addToFavoritesApi.addToFavorites(slug)

      commit(mutationsTypes.addToFavoritesSuccess)
      return article
    } catch (error) {
      commit(mutationsTypes.addToFavoritesFailure)
      throw error
    }
  },
}

const addToFavoritesModule: Module<AddToFavoritesState, RootState> = {
  state,
  actions,
  mutations,
}

export default addToFavoritesModule
