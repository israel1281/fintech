import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  message: '',
  authorization: {},
  data: null,
  reference: null
})

export const mutations = {
  SET_LOADING: (state, loading) => {
    Vue.set(state, 'loading', loading)
  },
  SET_ERRORS: (state, errors) => {
    Vue.set(state, 'errors', errors)
  },
  SET_MESSAGE: (state, message) => {
    Vue.set(state, 'message', message)
  },
  SET_DATA: (state, data) => {
    Vue.set(state, 'data', data)
  },
  SET_AUTHORIZATION: (state, authorization) => {
    Vue.set(state, 'authorization', authorization)
  },
  SET_REFERENCE: (state, reference) => {
    Vue.set(state, 'reference', reference)
  }
}

export const actions = {
  // Generate Reference
  async generateReference ({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_REFERENCE', null)
    await this.$api.card.generateReference()
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_REFERENCE', response.data.data)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', error.response.data.message)
        return Promise.reject(error.response)
      })
  },
  // Initialize Card Payment
  async initialize ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_DATA', null)
    await this.$api.card.initialize(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_AUTHORIZATION', response.data.meta.authorization)
        commit('SET_DATA', response.data.data)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', error.response.data.message)
        return Promise.reject(error.response)
      })
  },
  // Validate Charge
  async validateCharge ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.card.validateCharge(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_DATA', response.data.data)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_MESSAGE', error.response.data.message)
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  },
  // Verify Payment
  async verifyPayment ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    await this.$api.card.verifyPayment(payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_DATA', response.data.data)
        return Promise.resolve(response)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_MESSAGE', error.response.data.message)
        commit('SET_LOADING', false)
        return Promise.reject(error.response)
      })
  }
}
