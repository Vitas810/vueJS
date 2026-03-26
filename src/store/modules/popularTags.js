import popularTagsApi from '@/api/popularTags'

const state = {
    data: null,
    isLoading: false,
    error: null,
}

export const mutationTypes = {
    getPopularTagsStart: '[popularTags] Get popular tags start',
    getPopularTagsSuccess: '[popularTags] Get popular tags Success',
    getPopularTagsFailure: '[popularTags] Get popular tags Failure',
}

export const actionTypes = {
    getPopularTags: '[popularTags] Get popular tags',
}

const mutations = {
    [mutationTypes.getPopularTagsStart](state) {
        state.isLoading = true
        state.data = null
        state.error = null
    },
    [mutationTypes.getPopularTagsSuccess](state, payload) {
        state.isLoading = false
        state.data = payload
        state.error = null
    },
    [mutationTypes.getPopularTagsFailure](state, payload) {
        state.isLoading = false
        state.error = payload
    },
}

const actions = {
    [actionTypes.getPopularTags](context) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.getPopularTagsStart)
            popularTagsApi
                .getPopularTags()
                .then((tags) => {
                    context.commit(mutationTypes.getPopularTagsSuccess, tags)
                    resolve(tags)
                })
                .catch((error) => {
                    const message =
                        error && error.message
                            ? error.message
                            : 'Failed to load tags'
                    context.commit(mutationTypes.getPopularTagsFailure, message)
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
