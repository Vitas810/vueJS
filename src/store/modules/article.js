import getArticleAPi from '@/api/article'

const state = {
    data: null,
    isLoading: false,
    error: null,
}

export const mutationTypes = {
    getArticleStart: '[article] Get article Start',
    getArticleSuccess: '[article] Get article Success',
    getArticleFailure: '[article] Get article Failure',

    deleteArticleStart: '[article] delete article Start',
    deleteArticleSuccess: '[article] delete article Success',
    deleteArticleFailure: '[article] delete article Failure',
}

export const actionTypes = {
    getArticle: '[article] Get article',
    deleteArticle: '[article] delete article',
}

const mutations = {
    [mutationTypes.getArticleStart](state) {
        state.isLoading = true
        state.data = null
        state.error = null
    },
    [mutationTypes.getArticleSuccess](state, payload) {
        state.isLoading = false
        state.data = payload
        state.error = null
    },
    [mutationTypes.getArticleFailure](state, payload) {
        state.isLoading = false
        state.error = payload
    },

    [mutationTypes.deleteArticleStart](state) {
        state.error = null
    },
    [mutationTypes.deleteArticleSuccess](state) {
        state.isLoading = false
        state.data = null
        state.error = null
    },
    [mutationTypes.deleteArticleFailure](state) {
        state.isLoading = false
    },
}

const actions = {
    [actionTypes.getArticle](context, {slug}) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.getArticleStart, slug)
            getArticleAPi
                .getArticle(slug)
                .then((article) => {
                    context.commit(mutationTypes.getArticleSuccess, article)
                    resolve(article)
                })
                .catch((error) => {
                    const message =
                        error && error.message
                            ? error.message
                            : 'Failed to load article'
                    context.commit(mutationTypes.getArticleFailure, message)
                    reject(error)
                })
        })
    },
    [actionTypes.deleteArticle](context, {slug}) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.deleteArticleStart, slug)
            getArticleAPi
                .deleteArticle(slug)
                .then(() => {
                    context.commit(mutationTypes.deleteArticleSuccess)
                    resolve()
                })
                .catch((error) => {
                    context.commit(mutationTypes.deleteArticleFailure)
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
