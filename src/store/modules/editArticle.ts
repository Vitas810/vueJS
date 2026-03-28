import {ActionTree, Module, MutationTree} from 'vuex'
import articleApi from '@/api/article'
import {Article, ArticleFormValues} from '@/types/domain'
import {EditArticleState, RootState} from '@/types/store'
import {getValidationErrors} from '@/helpers/error'

/* =============== Типы editArticle ============= */

export const editArticleModuleName = 'editArticle'

export const mutationTypes = {
  updateArticleStart: 'updateArticleStart',
  updateArticleSuccess: 'updateArticleSuccess',
  updateArticleFailure: 'updateArticleFailure',

  getArticleStart: 'getArticleStart',
  getArticleSuccess: 'getArticleSuccess',
  getArticleFailure: 'getArticleFailure',
} as const

export const actionTypes = {
  updateArticle: 'updateArticle',
  getArticle: 'getArticle',
} as const

const state: EditArticleState = {
  isSubmitting: false,
  validationErrors: null,
  isLoading: false,
  article: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<EditArticleState> = {
  [mutationTypes.updateArticleStart](currentState) {
    currentState.isSubmitting = true
    currentState.validationErrors = null
  },
  [mutationTypes.updateArticleSuccess](currentState) {
    currentState.isSubmitting = false
  },
  [mutationTypes.updateArticleFailure](currentState, payload) {
    currentState.isSubmitting = false
    currentState.validationErrors = payload
  },
  [mutationTypes.getArticleStart](currentState) {
    currentState.isLoading = true
    currentState.article = null
  },
  [mutationTypes.getArticleSuccess](currentState, payload: Article) {
    currentState.isLoading = false
    currentState.article = payload
  },
  [mutationTypes.getArticleFailure](currentState) {
    currentState.isLoading = false
    currentState.article = null
  },
}

/* =============== Actions ============= */

interface UpdateArticlePayload {
  slug: string
  articleInput: ArticleFormValues
}

interface ArticleSlugPayload {
  slug: string
}

const actions: ActionTree<EditArticleState, RootState> = {
  async [actionTypes.updateArticle](
    {commit},
    {slug, articleInput}: UpdateArticlePayload
  ): Promise<Article> {
    commit(mutationTypes.updateArticleStart)

    try {
      const article = await articleApi.updateArticle(slug, articleInput)

      commit(mutationTypes.updateArticleSuccess)
      return article
    } catch (error) {
      commit(mutationTypes.updateArticleFailure, getValidationErrors(error))
      throw error
    }
  },
  async [actionTypes.getArticle](
    {commit},
    {slug}: ArticleSlugPayload
  ): Promise<Article> {
    commit(mutationTypes.getArticleStart)

    try {
      const article = await articleApi.getArticle(slug)

      commit(mutationTypes.getArticleSuccess, article)
      return article
    } catch (error) {
      commit(mutationTypes.getArticleFailure)
      throw error
    }
  },
}

const editArticleModule: Module<EditArticleState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default editArticleModule
