import Vue from 'vue'

export const state = () => ({
  loading: false,
  errors: [],
  message: '',
  isBlacklist: null
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
  SET_BLACKLIST: (state, isBlacklist) => {
    Vue.set(state, 'isBlacklist', isBlacklist)
  }
}

export const actions = {
  async verify ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$axios.post('api/bvn/verify', payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', error.response.data.message)
        return Promise.reject(error)
      })
  },
  async searchBlacklistNg ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$axios.post('api/blacklistng/search', payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', response.data.message)
        commit('SET_BLACKLIST', response.data.data)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
        }
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', error.response.data.message)
        return Promise.reject(error)
      })
  }

}
