import userProfileApi from "@/api/userProfile";

const state = {
    data: null,
    isLoading: false,
    error: null,
}

export const mutationTypes = {
    getUserProfileStart: '[userProfile] Get user profile start',
    getUserProfileSuccess: '[userProfile] Get user profile Success',
    getUserProfileFailure: '[userProfile] Get user profile Failure',
}

export const actionTypes = {
    getUserProfile: '[userProfile] Get user profile',
}

const mutations = {
    [mutationTypes.getUserProfileStart](state) {
        state.isLoading = true
        state.data = null
        state.error = null
    },
    [mutationTypes.getUserProfileSuccess](state, payload) {
        state.isLoading = false
        state.data = payload
        state.error = null
    },
    [mutationTypes.getUserProfileFailure](state, payload) {
        state.isLoading = false
        state.error = payload
    },
}

const actions = {
    [actionTypes.getUserProfile](context, {slug}) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.getUserProfileStart)
            userProfileApi
                .getUserProfile(slug)
                .then((userProfile) => {
                    context.commit(mutationTypes.getUserProfileSuccess, userProfile)
                    resolve(userProfile)
                })
                .catch((error) => {
                    const message =
                        error && error.message
                            ? error.message
                            : 'Failed to load profile'
                    context.commit(mutationTypes.getUserProfileFailure, message)
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
