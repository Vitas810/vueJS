/* =============== Типы мутаций модуля settings ============= */

export const mutationTypes = {
  updateSettingsFormStart: '[settings] update settings form start',
  updateSettingsFormSuccess: '[settings] update settings form success',
  updateSettingsFormFailure: '[settings] update settings form failure',
}

const state = {
  isSubmitting: false,
  validationErrors: null,
}

const mutations = {
  [mutationTypes.updateSettingsFormStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.updateSettingsFormSuccess](state) {
    state.isSubmitting = false
  },
  [mutationTypes.updateSettingsFormFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },
}

export default {
  state,
  mutations,
}
