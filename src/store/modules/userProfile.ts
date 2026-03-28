import {ActionTree, Module, MutationTree} from 'vuex'
import userProfileApi from '@/api/userProfile'
import {Profile} from '@/types/domain'
import {RootState, UserProfileState} from '@/types/store'
import {getErrorMessage} from '@/helpers/error'

/* =============== Типы userProfile ============= */

export const userProfileModuleName = 'userProfile'

export const mutationTypes = {
  getUserProfileStart: 'getUserProfileStart',
  getUserProfileSuccess: 'getUserProfileSuccess',
  getUserProfileFailure: 'getUserProfileFailure',
} as const

export const actionTypes = {
  getUserProfile: 'getUserProfile',
} as const

const state: UserProfileState = {
  data: null,
  isLoading: false,
  error: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<UserProfileState> = {
  [mutationTypes.getUserProfileStart](currentState) {
    currentState.isLoading = true
    currentState.data = null
    currentState.error = null
  },
  [mutationTypes.getUserProfileSuccess](currentState, payload: Profile) {
    currentState.isLoading = false
    currentState.data = payload
    currentState.error = null
  },
  [mutationTypes.getUserProfileFailure](currentState, payload: string) {
    currentState.isLoading = false
    currentState.error = payload
  },
}

/* =============== Actions ============= */

interface UserProfilePayload {
  slug: string
}

const actions: ActionTree<UserProfileState, RootState> = {
  async [actionTypes.getUserProfile](
    {commit},
    {slug}: UserProfilePayload
  ): Promise<Profile> {
    commit(mutationTypes.getUserProfileStart)

    try {
      const userProfile = await userProfileApi.getUserProfile(slug)

      commit(mutationTypes.getUserProfileSuccess, userProfile)
      return userProfile
    } catch (error) {
      commit(
        mutationTypes.getUserProfileFailure,
        getErrorMessage(error, 'Failed to load profile')
      )
      throw error
    }
  },
}

const userProfileModule: Module<UserProfileState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default userProfileModule
