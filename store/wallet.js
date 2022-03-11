import Vue from 'vue'

export const state = () => ({
  loading: null,
  defaultWallet: {},
  errors: [],
  message: '',
  url: ''
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
  SET_DEFAULT_WALLET: (state, defaultWallet) => {
    Vue.set(state, 'defaultWallet', defaultWallet)
  },
  SET_URL: (state, url) => {
    Vue.set(state, 'url', url)
  }
}

export const actions = {
  async getDefaultWallet ({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$api.wallet.getDefault()
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_DEFAULT_WALLET', response.data.data)
        commit('SET_MESSAGE', response.data.message)
        return Promise.resolve(true)
      })
      .catch((error) => {
        if (error.response && (error.response.status === 422)) {
          commit('SET_ERRORS', error.response.data.errors)
          commit('SET_MESSAGE', error.response.data.message)
        }
        commit('SET_LOADING', false)
        commit('SET_MESSAGE', error.response.data.message)
        return Promise.reject(error)
      })
  },
  async fwPay ({ commit }, payload) {
    commit('SET_LOADING', true)
    commit('SET_ERRORS', [])
    commit('SET_MESSAGE', '')
    await this.$axios.post('api/fw/pay', payload)
      .then((response) => {
        commit('SET_LOADING', false)
        commit('SET_URL', response.data.data.payment_link)
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
  }
}
