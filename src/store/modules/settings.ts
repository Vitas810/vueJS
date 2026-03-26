import { Module, MutationTree } from 'vuex'
import { ValidationErrors } from '@/types/domain'
import { RootState, SettingsState } from '@/types/store'

/* =============== Типы мутаций модуля settings ============= */

export const mutationTypes = {
  updateSettingsFormStart: '[settings] update settings form start',
  updateSettingsFormSuccess: '[settings] update settings form success',
  updateSettingsFormFailure: '[settings] update settings form failure',
} as const

const state: SettingsState = {
  isSubmitting: false,
  validationErrors: null,
}

/* =============== Мутации ============= */

const mutations: MutationTree<SettingsState> = {
  [mutationTypes.updateSettingsFormStart](currentState) {
    currentState.isSubmitting = true
    currentState.validationErrors = null
  },
  [mutationTypes.updateSettingsFormSuccess](currentState) {
    currentState.isSubmitting = false
  },
  [mutationTypes.updateSettingsFormFailure](
    currentState,
    payload: ValidationErrors | null
  ) {
    currentState.isSubmitting = false
    currentState.validationErrors = payload
  },
}

const settingsModule: Module<SettingsState, RootState> = {
  state,
  mutations,
}

export default settingsModule
