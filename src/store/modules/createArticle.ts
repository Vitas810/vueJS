import {ActionTree, Module, MutationTree} from 'vuex'
import articleApi from '@/api/article'
import {Article, ArticleFormValues} from '@/types/domain'
import {CreateArticleState, RootState} from '@/types/store'
import {getValidationErrors} from '@/helpers/error'

/* =============== Типы createArticle ============= */

export const mutationTypes = {
  createArticleStart: '[createArticle] Create article start',
  createArticleSuccess: '[createArticle] Create article success',
  createArticleFailure: '[createArticle] Create article failure',
} as const

export const actionTypes = {
  createArticle: '[createArticle] Create article',
} as const

const state: CreateArticleState = {
  isSubmitting: false,
  validationErrors: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<CreateArticleState> = {
  [mutationTypes.createArticleStart](currentState) {
    currentState.isSubmitting = true
    currentState.validationErrors = null
  },
  [mutationTypes.createArticleSuccess](currentState) {
    currentState.isSubmitting = false
  },
  [mutationTypes.createArticleFailure](currentState, payload) {
    currentState.isSubmitting = false
    currentState.validationErrors = payload
  },
}

/* =============== Actions ============= */

interface CreateArticlePayload {
  articleInput: ArticleFormValues
}

const actions: ActionTree<CreateArticleState, RootState> = {
  async [actionTypes.createArticle](
    {commit},
    {articleInput}: CreateArticlePayload
  ): Promise<Article> {
    commit(mutationTypes.createArticleStart)

    try {
      const article = await articleApi.createArticle(articleInput)

      commit(mutationTypes.createArticleSuccess)
      return article
    } catch (error) {
      commit(mutationTypes.createArticleFailure, getValidationErrors(error))
      throw error
    }
  },
}

const createArticleModule: Module<CreateArticleState, RootState> = {
  state,
  actions,
  mutations,
}

export default createArticleModule
