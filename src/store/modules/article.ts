import {ActionTree, Module, MutationTree} from 'vuex'
import articleApi from '@/api/article'
import {Article} from '@/types/domain'
import {ArticleState, RootState} from '@/types/store'
import {getErrorMessage} from '@/helpers/error'

/* =============== Типы article ============= */

export const articleModuleName = 'article'

export const mutationTypes = {
  getArticleStart: 'getArticleStart',
  getArticleSuccess: 'getArticleSuccess',
  getArticleFailure: 'getArticleFailure',

  deleteArticleStart: 'deleteArticleStart',
  deleteArticleSuccess: 'deleteArticleSuccess',
  deleteArticleFailure: 'deleteArticleFailure',
} as const

export const actionTypes = {
  getArticle: 'getArticle',
  deleteArticle: 'deleteArticle',
} as const

const state: ArticleState = {
  data: null,
  isLoading: false,
  error: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<ArticleState> = {
  [mutationTypes.getArticleStart](currentState) {
    currentState.isLoading = true
    currentState.data = null
    currentState.error = null
  },
  [mutationTypes.getArticleSuccess](currentState, payload: Article) {
    currentState.isLoading = false
    currentState.data = payload
    currentState.error = null
  },
  [mutationTypes.getArticleFailure](currentState, payload: string) {
    currentState.isLoading = false
    currentState.error = payload
  },
  [mutationTypes.deleteArticleStart](currentState) {
    currentState.error = null
  },
  [mutationTypes.deleteArticleSuccess](currentState) {
    currentState.isLoading = false
    currentState.data = null
    currentState.error = null
  },
  [mutationTypes.deleteArticleFailure](currentState) {
    currentState.isLoading = false
  },
}

/* =============== Actions ============= */

interface ArticleSlugPayload {
  slug: string
}

const actions: ActionTree<ArticleState, RootState> = {
  async [actionTypes.getArticle]({commit}, {slug}: ArticleSlugPayload) {
    commit(mutationTypes.getArticleStart)

    try {
      const article = await articleApi.getArticle(slug)

      commit(mutationTypes.getArticleSuccess, article)
      return article
    } catch (error) {
      commit(
        mutationTypes.getArticleFailure,
        getErrorMessage(error, 'Failed to load article')
      )
      throw error
    }
  },
  async [actionTypes.deleteArticle]({commit}, {slug}: ArticleSlugPayload) {
    commit(mutationTypes.deleteArticleStart)

    try {
      await articleApi.deleteArticle(slug)
      commit(mutationTypes.deleteArticleSuccess)
    } catch (error) {
      commit(mutationTypes.deleteArticleFailure)
      throw error
    }
  },
}

const articleModule: Module<ArticleState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default articleModule
